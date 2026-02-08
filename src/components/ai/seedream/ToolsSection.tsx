import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { type ToolsPageCopy } from '@/components/marketing/tools/tools-landing';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes';
import { getMessages } from 'next-intl/server';
import Link from 'next/link';

const moduleRoutes: string[] = [
  Routes.AiPolaroid,
  Routes.AiPolaroidTemplates,
  Routes.AiPolaroidGenerator,
  Routes.AiPolaroid,
];

export async function ToolsSection() {
  const { ToolsPage: toolsPageMessages } = await getMessages();
  const copy = toolsPageMessages as ToolsPageCopy;
  const { modules, title, description, ctaSection } = copy;

  return (
    <section className="container mx-auto px-4 py-12" id="tools">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-muted-foreground">{description}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.items.map((item, index) => (
          <Card key={item.title} className="space-y-2 border bg-card/50 p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
              {item.tag}
            </span>
            <h3 className="text-lg font-medium">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.body}</p>
            <Link
              href={moduleRoutes[index] ?? Routes.Tools}
              className={cn(
                buttonVariants({ variant: 'default', size: 'sm' }),
                'mt-3'
              )}
            >
              {ctaSection.primary}
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
