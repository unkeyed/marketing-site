import NextLink from 'next/link';

interface IGlossaryTermCardProps {
  anchorId: string;
  term: string;
  description: string;
  pathname: string;
}

function GlossaryTermCard({ anchorId, term, description, pathname }: IGlossaryTermCardProps) {
  return (
    <NextLink
      id={anchorId}
      href={pathname}
      className="group block border border-gray-20 px-5 py-5 transition-colors hover:border-gray-30 sm:px-6 sm:py-6 md:px-5 md:py-5 md:pr-18"
      aria-label={`Open term ${term}`}
    >
      <h3 className="font-display text-xl leading-[1.125] font-normal tracking-tight text-foreground sm:text-2xl">
        {term}
      </h3>
      <p className="mt-4 line-clamp-2 text-base leading-snug tracking-tight text-gray-70 transition-colors group-hover:text-foreground">
        {description}
      </p>
    </NextLink>
  );
}

export default GlossaryTermCard;
