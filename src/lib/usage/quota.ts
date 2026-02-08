import { randomUUID } from 'crypto';
import { and, eq, sql } from 'drizzle-orm';
import type { NextRequest } from 'next/server';

import { getDb } from '@/db';
import { freeUsageQuota } from '@/db/schema';

const SESSION_COOKIE_NAME = 'free_usage_session_id';
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const ANONYMOUS_LIMIT = 2;
const AUTHENTICATED_LIMIT = 2;

export type UsageFeature = 'sora2-image' | 'image-generation';

export type UsageLimitReason = 'ANONYMOUS_LIMIT_REACHED' | 'AUTH_LIMIT_REACHED';

interface UsageCookie {
  name: string;
  value: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  path: string;
  maxAge: number;
}

export interface UsageLimitResult {
  allowed: boolean;
  reason?: UsageLimitReason;
  remaining?: number;
  sessionId: string;
  cookie?: UsageCookie;
}

interface EnforceLimitParams {
  request: NextRequest;
  feature: UsageFeature;
  userId?: string | null;
}

export async function enforceUsageLimit({
  request,
  feature,
  userId,
}: EnforceLimitParams): Promise<UsageLimitResult> {
  const cookieStore = request.cookies;
  let sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  let cookie: UsageCookie | undefined;

  if (!sessionId) {
    sessionId = randomUUID();
    cookie = {
      name: SESSION_COOKIE_NAME,
      value: sessionId,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_COOKIE_MAX_AGE,
    };
  }

  const db = await getDb();
  const now = new Date();

  const result = await db.transaction(async (tx) => {
    const [existingRecord] = await tx
      .select()
      .from(freeUsageQuota)
      .where(
        and(
          eq(freeUsageQuota.sessionId, sessionId!),
          eq(freeUsageQuota.feature, feature)
        )
      )
      .limit(1);

    let record = existingRecord;

    if (!record) {
      const newRecord = {
        id: randomUUID(),
        sessionId: sessionId!,
        feature,
        userId: userId ?? null,
        anonymousUses: 0,
        authenticatedUses: 0,
        createdAt: now,
        updatedAt: now,
      };
      await tx.insert(freeUsageQuota).values(newRecord);
      record = newRecord;
    } else if (userId && record.userId !== userId) {
      await tx
        .update(freeUsageQuota)
        .set({ userId, updatedAt: now })
        .where(eq(freeUsageQuota.id, record.id));
      record = { ...record, userId };
    }

    if (!userId) {
      if (record.anonymousUses >= ANONYMOUS_LIMIT) {
        return {
          allowed: false,
          reason: 'ANONYMOUS_LIMIT_REACHED' as UsageLimitReason,
        };
      }

      await tx
        .update(freeUsageQuota)
        .set({
          anonymousUses: record.anonymousUses + 1,
          updatedAt: now,
        })
        .where(eq(freeUsageQuota.id, record.id));

      const remaining = ANONYMOUS_LIMIT - (record.anonymousUses + 1);
      return { allowed: true, remaining };
    }

    const [{ totalUses }] = await tx
      .select({
        totalUses: sql<number>`COALESCE(SUM(${freeUsageQuota.authenticatedUses}), 0)`,
      })
      .from(freeUsageQuota)
      .where(
        and(
          eq(freeUsageQuota.feature, feature),
          eq(freeUsageQuota.userId, userId)
        )
      );

    if (totalUses >= AUTHENTICATED_LIMIT) {
      return {
        allowed: false,
        reason: 'AUTH_LIMIT_REACHED' as UsageLimitReason,
      };
    }

    await tx
      .update(freeUsageQuota)
      .set({
        authenticatedUses: record.authenticatedUses + 1,
        userId,
        updatedAt: now,
      })
      .where(eq(freeUsageQuota.id, record.id));

    const remaining = AUTHENTICATED_LIMIT - (totalUses + 1);
    return { allowed: true, remaining };
  });

  return {
    allowed: result.allowed,
    reason: result.reason,
    remaining: result.remaining,
    sessionId: sessionId!,
    cookie,
  };
}
