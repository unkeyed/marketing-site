import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "glass" | "dark" | "unstyled";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-white text-[#040406]",
  outline: "border border-white text-white",
  glass: "border border-white bg-[rgba(0,0,0,0.01)] text-white backdrop-blur-[5px]",
  dark: "bg-ink text-white",
  unstyled: "",
};

export default function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-none font-medium",
    variantClasses[variant],
    className,
  );

  return <button className={classes} {...props} />;
}
