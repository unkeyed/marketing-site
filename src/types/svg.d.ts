declare module "*.inline.svg" {
  import type { FC, SVGProps } from "react";

  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}
