import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "dark" | "light";

export type BadgeProps = HTMLAttributes<HTMLDivElement> & {
  variant?: BadgeVariant;
  labelClassName?: string;
  children: ReactNode;
};

const variantClasses: Record<BadgeVariant, string> = {
  dark: "rounded-[6px] border border-border px-3 py-2",
  light: "rounded-[6px] border border-[rgba(4,4,6,0.2)] px-3 py-2",
};

const dotByVariant: Record<BadgeVariant, ReactNode> = {
  dark: (
    <div className="relative h-[10px] w-[10px] shrink-0">
      <span className="absolute inset-0 rounded-[2px] bg-blue-glow blur-[5px]" />
      <span className="absolute inset-0 rounded-[2px] bg-cyan blur-[2px]" />
      <span className="absolute inset-0 rounded-[2px] bg-cyan" />
    </div>
  ),
  light: <div className="h-[10px] w-[10px] shrink-0 rounded-[2px] bg-blue" />,
};

export default function Badge({
  variant = "dark",
  className,
  labelClassName,
  children,
  ...props
}: BadgeProps) {
  const classes = cn(
    "inline-flex items-center gap-2.5",
    variantClasses[variant],
    className,
  );
  const labelClasses = cn(
    "font-mono text-sm uppercase",
    variant === "light" ? "text-ink" : "text-white",
    labelClassName,
  );

  return (
    <div className={classes} {...props}>
      {dotByVariant[variant]}
      <span className={labelClasses}>{children}</span>
    </div>
  );
}
