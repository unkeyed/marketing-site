import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type CardVariant = "outline" | "solid" | "none";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
};

const variantClasses: Record<CardVariant, string> = {
  outline: "border border-border bg-ink",
  solid: "bg-ink",
  none: "",
};

export default function Card({
  variant = "outline",
  className,
  ...props
}: CardProps) {
  const classes = cn(variantClasses[variant], className);

  return <div className={classes} {...props} />;
}
