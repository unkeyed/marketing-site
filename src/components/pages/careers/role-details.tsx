import type { ICareerFrontmatter } from '@/types/career';
import { cn } from '@/lib/utils';

export default function RoleDetails({
  stats,
  className,
}: Pick<ICareerFrontmatter, 'stats'> & { className?: string }) {
  return (
    <section aria-label="Role details" className={cn('flex flex-col gap-5', className)}>
      <h2 className="text-base font-medium tracking-tight">At a glance</h2>
      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
        {stats.map((item) => (
          <div key={item.label} className="space-y-2">
            <dt className="text-sm leading-snug font-medium tracking-tight">{item.label}</dt>
            <dd className="text-sm leading-snug tracking-tight text-muted-foreground">
              {item.content}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
