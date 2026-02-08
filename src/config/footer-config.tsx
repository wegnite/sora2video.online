'use client';

import { Routes } from '@/routes';
import type { NestedMenuItem } from '@/types';
import { useTranslations } from 'next-intl';
import { websiteConfig } from './website';

/**
 * Get footer config with translations
 *
 * NOTICE: used in client components only
 *
 * docs:
 * https://sora2video.online/docs/config/footer
 *
 * @returns The footer config with translated titles
 */
export function getFooterLinks(): NestedMenuItem[] {
  const t = useTranslations('Marketing.footer');

  return [
    {
      title: t('product.title'),
      items: [
        {
          title: t('product.items.generator'),
          href: Routes.AiPolaroidGenerator,
          external: false,
        },
        {
          title: t('product.items.templates'),
          href: Routes.AiPolaroidTemplates,
          external: false,
        },
        {
          title: t('product.items.vintage'),
          href: Routes.AiVintagePhoto,
          external: false,
        },
      ],
    },
    {
      title: t('resources.title'),
      items: [
        {
          title: t('resources.items.gallery'),
          href: Routes.Gallery,
          external: false,
        },
        {
          title: t('resources.items.tutorials'),
          href: Routes.Tutorials,
          external: false,
        },
        {
          title: t('resources.items.wan22'),
          href: Routes.Wan22,
          external: false,
        },
        ...(websiteConfig.blog.enable
          ? [
            {
              title: t('resources.items.blog'),
              href: Routes.Blog,
              external: false,
            },
          ]
          : []),
        ...(websiteConfig.docs.enable
          ? [
            {
              title: t('resources.items.docs'),
              href: Routes.Docs,
              external: false,
            },
          ]
          : []),
      ],
    },
    {
      title: t('company.title'),
      items: [
        {
          title: t('company.items.about'),
          href: Routes.About,
          external: false,
        },
        {
          title: t('company.items.contact'),
          href: Routes.Contact,
          external: false,
        },
        {
          title: t('company.items.changelog'),
          href: Routes.Changelog,
          external: false,
        },
        {
          title: t('company.items.waitlist'),
          href: Routes.Waitlist,
          external: false,
        },
      ],
    },
    {
      title: t('legal.title'),
      items: [
        {
          title: t('legal.items.cookiePolicy'),
          href: Routes.CookiePolicy,
          external: false,
        },
        {
          title: t('legal.items.privacyPolicy'),
          href: Routes.PrivacyPolicy,
          external: false,
        },
        {
          title: t('legal.items.termsOfService'),
          href: Routes.TermsOfService,
          external: false,
        },
      ],
    },
    {
      title: 'Friends',
      items: [
        {
          title: 'Seedance AI',
          href: 'https://seedance20.net',
          external: true,
        },
        {
          title: 'Seedream AI',
          href: 'https://seedream50.com',
          external: true,
        },
        {
          title: 'Kling AI',
          href: 'https://kling3.co/',
          external: true,
        },
        {
          title: 'AI Music Maker',
          href: 'https://musicmake.ai',
          external: true,
        },
        {
          title: 'Song Unique',
          href: 'https://songunique.com',
          external: true,
        },
      ],
    },
  ];
}
