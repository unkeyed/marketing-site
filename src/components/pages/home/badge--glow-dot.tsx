import { cn } from '@/lib/utils';

export default function BadgeGlowDot({
  children,
  variant = 'dark',
  className,
  labelClassName,
}: {
  children: React.ReactNode;
  variant?: 'dark' | 'light';
  className?: string;
  labelClassName?: string;
}) {
  const isDark = variant === 'dark';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 rounded-[6px] border px-3 py-2',
        isDark ? 'border-uw-border' : 'border-[rgba(4,4,6,0.2)]',
        className,
      )}
    >
      {isDark ? (
        <span className="relative h-[10px] w-[10px]">
          <span className="absolute inset-0 rounded-[2px] bg-blue-glow blur-[5px]" />
          <span className="absolute inset-0 rounded-[2px] bg-cyan blur-[2px]" />
          <span className="absolute inset-0 rounded-[2px] bg-cyan" />
        </span>
      ) : (
        <span className="h-[10px] w-[10px] rounded-[2px] bg-blue" />
      )}
      <span
        className={cn(
          'font-mono text-sm uppercase',
          isDark ? 'text-white' : 'text-ink',
          labelClassName,
        )}
      >
        {children}
      </span>
    </div>
  );
}
