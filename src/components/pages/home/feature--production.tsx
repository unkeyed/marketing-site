const CONTAINER =
  'mx-auto w-full max-w-[var(--spacing-content)] px-5 md:px-8 xl:px-10 2xl:px-0';

interface IProductionItem {
  title: string;
  text: string;
}

interface IProductionProps {
  label: string;
  items: IProductionItem[];
}

export default function FeatureProduction({ label, items }: IProductionProps) {
  return (
    <section className="pt-12 md:pt-[80px]">
      <div className={`${CONTAINER} grid gap-8 lg:grid-cols-[1fr_3fr] lg:gap-0`}>
        <div className="flex items-start pt-[7px]">
          <div className="flex items-center gap-2.5">
            <span className="relative h-[10px] w-[10px]">
              <span className="absolute inset-0 rounded-[2px] bg-blue-glow blur-[5px]" />
              <span className="absolute inset-0 rounded-[2px] bg-cyan blur-[2px]" />
              <span className="absolute inset-0 rounded-[2px] bg-cyan" />
            </span>
            <h2 className="font-mono text-sm uppercase tracking-[0.42px] text-white">
              {label}
            </h2>
          </div>
        </div>
        <div className="flex flex-col gap-8 md:gap-12 lg:flex-row lg:gap-24">
          {items.map((item) => (
            <div className="flex flex-1 gap-5" key={item.title}>
              <div className="flex w-px flex-col self-stretch">
                <div className="h-[30px] w-px shrink-0 bg-white" />
                <div className="w-px flex-1 bg-gray-20" />
              </div>
              <div className="flex flex-col gap-2 text-lg md:text-xl">
                <p className="leading-normal font-medium text-white">{item.title}</p>
                <p className="leading-snug text-gray-70">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
