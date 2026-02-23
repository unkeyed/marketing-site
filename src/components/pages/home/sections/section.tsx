import type { ComponentPropsWithoutRef } from "react";

export type SectionProps = ComponentPropsWithoutRef<"section">;

export default function Section(props: SectionProps) {
  return <section {...props} />;
}
