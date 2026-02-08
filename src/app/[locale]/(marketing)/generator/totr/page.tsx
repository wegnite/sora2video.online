import { constructMetadata } from '@/lib/metadata';
import { getUrlWithLocale, shouldAppendLocale } from '@/lib/urls/urls';
import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { redirect } from 'next/navigation';

const TARGET_PATH = '/ai/polaroid/generator';

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
    title: 'Sora2 Prompt Lab — Generate Cinematic Shots',
    description:
      'Use the Sora Prompt Lab to transform prompts into cinematic sequences with metadata, captions, and automation-ready presets.',
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
