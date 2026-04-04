'use client';

import Container from '@/components/layout/container';
import { Logo } from '@/components/layout/logo';
import { ModeSwitcherHorizontal } from '@/components/layout/mode-switcher-horizontal';
import { getFooterLinks } from '@/config/footer-config';
import { getSocialLinks } from '@/config/social-config';
import { LocaleLink } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes';
import { useTranslations } from 'next-intl';
import type React from 'react';

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  const t = useTranslations();
  const footerLinks = getFooterLinks();
  const socialLinks = getSocialLinks();

  return (
    <footer
      className={cn(
        'relative overflow-hidden border-t border-white/10 bg-[#030516] text-slate-300',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(86,110,255,0.18),transparent_65%)]" />
        <div className="animate-aurora absolute -top-40 right-[-160px] h-[420px] w-[420px] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(76,201,255,0.25),rgba(255,189,145,0.18),rgba(122,230,255,0.25))] blur-3xl" />
        <div className="animate-blob absolute -bottom-44 left-[-180px] h-[520px] w-[520px] rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <Container className="relative z-10 px-4">
        <div className="grid grid-cols-2 gap-8 py-16 md:grid-cols-6">
          <div className="flex flex-col items-start col-span-full md:col-span-2">
            <div className="space-y-4">
              {/* logo and name */}
              <div className="items-center space-x-2 flex">
                <Logo />
                <span className="text-xl font-semibold">
                  {t('Metadata.name')}
                </span>
              </div>

              {/* tagline */}
              <p className="text-base text-slate-300/80 py-2 md:pr-12">
                {t('Marketing.footer.tagline')}
              </p>

              {/* social links - commented out as requested */}
              {/* <div className="flex items-center gap-4 py-2">
                <div className="flex items-center gap-2">
                  {socialLinks?.map((link) => (
                    <a
                      key={link.title}
                      href={link.href || '#'}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.title}
                      className="border border-border inline-flex h-8 w-8 items-center
                          justify-center rounded-full hover:bg-accent hover:text-accent-foreground"
                    >
                      <span className="sr-only">{link.title}</span>
                      {link.icon ? link.icon : null}
                    </a>
                  ))}
                </div>
              </div> */}
            </div>
          </div>

          {/* footer links */}
          {footerLinks?.map((section) => (
            <div
              key={section.title}
              className="col-span-1 md:col-span-1 items-start"
            >
              <span className="text-sm font-semibold uppercase text-white/80">
                {section.title}
              </span>
              <ul className="mt-4 list-inside space-y-3">
                {section.items?.map(
                  (item) =>
                    item.href && (
                      <li key={item.title}>
                        <LocaleLink
                          href={item.href || '#'}
                          target={item.external ? '_blank' : undefined}
                          className="text-sm text-slate-300 hover:text-white"
                        >
                          {item.title}
                        </LocaleLink>
                      </li>
                    )
                )}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      <div className="relative border-t border-white/10 py-8">
        <Container className="relative z-10 px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <span className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} {t('Metadata.name')} All Rights
              Reserved.
            </span>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <LocaleLink
                href={Routes.PrivacyPolicy}
                className="text-slate-400 hover:text-white"
              >
                {t('Marketing.footer.legal.items.privacyPolicy')}
              </LocaleLink>
              <LocaleLink
                href={Routes.TermsOfService}
                className="text-slate-400 hover:text-white"
              >
                {t('Marketing.footer.legal.items.termsOfService')}
              </LocaleLink>
              <LocaleLink
                href={Routes.CookiePolicy}
                className="text-slate-400 hover:text-white"
              >
                {t('Marketing.footer.legal.items.cookiePolicy')}
              </LocaleLink>
            </div>

            <div className="flex items-center gap-x-4">
              <ModeSwitcherHorizontal />
            </div>
          </div>
        </Container>
      </div>
                {/* WHITE-LINK-FANOUT:START */}
      <div className="mt-6 border-t border-border/40 pt-4 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/80">
          Related Sites
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
        <a
          key="songunique.com"
          href="https://songunique.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          songunique.com
        </a>
        </div>
      </div>
      {/* WHITE-LINK-FANOUT:END */}
</footer>
  );
}
