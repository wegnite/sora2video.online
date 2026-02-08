import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale, shouldAppendLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { redirect } from 'next/navigation';

const TARGET_PATH = '/ai/polaroid';

function getLocalizedTarget(locale: Locale): string {
  return shouldAppendLocale(locale) ? `/${locale}${TARGET_PATH}` : TARGET_PATH;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata | undefined> {
  const { locale } = await params;
  return constructMetadata({
    title: 'Sora2 Video — Launch Inspiration',
    description:
      'Learn how to build cinematic Sora2 stories with curated templates, prompt packs, and showcase inspiration.',
    canonicalUrl: getUrlWithLocale(TARGET_PATH, locale),
    noIndex: true,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  redirect(getLocalizedTarget(locale));
}
