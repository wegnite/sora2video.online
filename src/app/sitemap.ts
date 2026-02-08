import { websiteConfig } from '@/config/website';
import { getLocalePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { blogSource, categorySource, source } from '@/lib/source';
import type { MetadataRoute } from 'next';
import type { Locale } from 'next-intl';
import { getBaseUrl } from '../lib/urls/urls';

type Href = Parameters<typeof getLocalePathname>[0]['href'];

/**
 * Static routes prioritized for Sora2 Video
 */
const staticRoutes = [
  '/',
  '/ai/image',
  '/ai/polaroid',
  '/ai/polaroid/generator',
  '/ai/polaroid/templates',
  '/ai/vintage-photo',
  '/tools',
  '/gallery',
  '/tutorials',
  '/policy/ugc',
  // legal/basic pages
  '/privacy',
  '/terms',
  '/cookie',
  // optional
  '/about',
  '/contact',
  '/changelog',
  '/wan-2-2',
];

/**
 * Generate a sitemap for the website
 *
 * https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
 * https://github.com/javayhu/cnblocks/blob/main/app/sitemap.ts
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapList: MetadataRoute.Sitemap = []; // final result

  // Route-specific priority and change frequency
  const routeMeta: Record<
    string,
    {
      priority: number;
      changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    }
  > = {
    '/': { priority: 1.0, changeFrequency: 'weekly' },
    '/ai/image': { priority: 1.0, changeFrequency: 'weekly' },
    '/ai/polaroid': { priority: 1.0, changeFrequency: 'weekly' },
    '/ai/polaroid/generator': { priority: 0.95, changeFrequency: 'weekly' },
    '/ai/polaroid/templates': { priority: 0.9, changeFrequency: 'weekly' },
    '/ai/vintage-photo': { priority: 0.9, changeFrequency: 'weekly' },
    '/tools': { priority: 0.8, changeFrequency: 'monthly' },
    '/gallery': { priority: 0.8, changeFrequency: 'daily' },
    '/tutorials': { priority: 0.7, changeFrequency: 'weekly' },
    '/policy/ugc': { priority: 0.6, changeFrequency: 'yearly' },
    '/privacy': { priority: 0.5, changeFrequency: 'yearly' },
    '/terms': { priority: 0.5, changeFrequency: 'yearly' },
    '/cookie': { priority: 0.5, changeFrequency: 'yearly' },
    '/about': { priority: 0.3, changeFrequency: 'yearly' },
    '/contact': { priority: 0.3, changeFrequency: 'yearly' },
    '/changelog': { priority: 0.3, changeFrequency: 'monthly' },
    '/wan-2-2': { priority: 0.6, changeFrequency: 'weekly' },
  };

  // add static routes
  sitemapList.push(
    ...staticRoutes.flatMap((route) =>
      routing.locales.map((locale) => ({
        url: getUrl(route, locale),
        lastModified: new Date(),
        priority: routeMeta[route]?.priority ?? 0.5,
        changeFrequency: routeMeta[route]?.changeFrequency ?? 'monthly',
      }))
    )
  );

  // Blog routes temporarily disabled to avoid 404 pages in sitemap
  // TODO: Re-enable when blog content is ready for Sora2 Video
  /*
  if (websiteConfig.blog.enable) {
    // add categories
    sitemapList.push(
      ...categorySource.getPages().flatMap((category) =>
        routing.locales.map((locale) => ({
          url: getUrl(`/blog/category/${category.slugs[0]}`, locale),
          lastModified: new Date(),
          priority: 0.8,
          changeFrequency: 'weekly' as const,
        }))
      )
    );

    // add paginated blog list pages
    routing.locales.forEach((locale) => {
      const posts = blogSource
        .getPages(locale)
        .filter((post) => post.data.published);
      const totalPages = Math.max(
        1,
        Math.ceil(posts.length / websiteConfig.blog.paginationSize)
      );
      // /blog/page/[page] (from 2)
      for (let page = 2; page <= totalPages; page++) {
        sitemapList.push({
          url: getUrl(`/blog/page/${page}`, locale),
          lastModified: new Date(),
          priority: 0.8,
          changeFrequency: 'weekly' as const,
        });
      }
    });

    // add paginated category pages
    routing.locales.forEach((locale) => {
      const localeCategories = categorySource.getPages(locale);
      localeCategories.forEach((category) => {
        // posts in this category and locale
        const postsInCategory = blogSource
          .getPages(locale)
          .filter((post) => post.data.published)
          .filter((post) =>
            post.data.categories.some((cat) => cat === category.slugs[0])
          );
        const totalPages = Math.max(
          1,
          Math.ceil(postsInCategory.length / websiteConfig.blog.paginationSize)
        );
        // /blog/category/[slug] (first page)
        sitemapList.push({
          url: getUrl(`/blog/category/${category.slugs[0]}`, locale),
          lastModified: new Date(),
          priority: 0.8,
          changeFrequency: 'weekly' as const,
        });
        // /blog/category/[slug]/page/[page] (from 2)
        for (let page = 2; page <= totalPages; page++) {
          sitemapList.push({
            url: getUrl(
              `/blog/category/${category.slugs[0]}/page/${page}`,
              locale
            ),
            lastModified: new Date(),
            priority: 0.8,
            changeFrequency: 'weekly' as const,
          });
        }
      });
    });

    // add posts (single post pages)
    sitemapList.push(
      ...blogSource.getPages().flatMap((post) =>
        routing.locales
          .filter((locale) => post.locale === locale)
          .map((locale) => ({
            url: getUrl(`/blog/${post.slugs.join('/')}`, locale),
            lastModified: new Date(),
            priority: 0.8,
            changeFrequency: 'weekly' as const,
          }))
      )
    );
  }
  */

  // Docs routes temporarily disabled to avoid 404 pages in sitemap
  // TODO: Re-enable when docs content is relevant for Sora2 Video
  /*
  if (websiteConfig.docs.enable) {
    const docsParams = source.generateParams();
    sitemapList.push(
      ...docsParams.flatMap((param) =>
        routing.locales.map((locale) => ({
          url: getUrl(`/docs/${param.slug.join('/')}`, locale),
          lastModified: new Date(),
          priority: 0.8,
          changeFrequency: 'weekly' as const,
        }))
      )
    );
  }
  */

  return sitemapList;
}

function getUrl(href: Href, locale: Locale) {
  const pathname = getLocalePathname({ locale, href });
  return getBaseUrl() + pathname;
}

/**
 * https://next-intl.dev/docs/environments/actions-metadata-route-handlers#sitemap
 * https://github.com/amannn/next-intl/blob/main/examples/example-app-router/src/app/sitemap.ts
 */
function getEntries(href: Href) {
  return routing.locales.map((locale) => ({
    url: getUrl(href, locale),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((cur) => [cur, getUrl(href, cur)])
      ),
    },
  }));
}
