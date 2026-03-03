import { Label } from '@/components/ui/label';

interface IProductionItem {
  title: string;
  text: string;
}

interface IProductionProps {
  label: string;
  items: IProductionItem[];
}

export default function Production({ label, items }: IProductionProps) {
  return (
    <section className="pt-12 pb-20 md:pt-20 md:pb-35 xl:pb-50">
      <h2 className="sr-only">{label}</h2>
      <div className="container grid gap-[1.25rem] md:gap-8 lg:grid-cols-[1fr_3fr] lg:gap-0">
        <div className="flex items-start pt-1.75">
          <Label size="plain">{label}</Label>
        </div>
        <ul className="flex flex-col gap-8 sm:gap-10 md:gap-12 lg:flex-row lg:gap-24">
          {items.map((item, index) => (
            <li className="flex flex-1 gap-5" key={`${item.title}-${index}`}>
              <div className="flex w-px flex-col self-stretch">
                <div className="h-7.5 w-px shrink-0 bg-white" />
                <div className="w-px flex-1 bg-gray-20" />
              </div>
              <div className="flex flex-col gap-2 text-[1rem] md:text-[1.125rem] xl:text-xl">
                <h3 className="leading-normal font-medium text-white">{item.title}</h3>
                <p className="leading-snug text-gray-70">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
