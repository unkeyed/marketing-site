import type { IGlossaryDirectoryTerm } from '@/types/glossary';
import GlossaryTermCard from '@/components/pages/glossary/glossary-term-card';

interface IGlossaryLetterSectionProps {
  letter: string;
  terms: IGlossaryDirectoryTerm[];
}

function GlossaryLetterSection({ letter, terms }: IGlossaryLetterSectionProps) {
  if (!terms || terms.length === 0) {
    return null;
  }

  return (
    <section id={`letter-${letter}`} className="scroll-mt-30">
      <h2 className="font-display text-[2rem] leading-[1.125] font-normal tracking-tight text-foreground md:text-[2.25rem] lg:text-[2.25rem]">
        {letter}
      </h2>
      <ul className="mt-7 grid gap-4 md:grid-cols-2 md:gap-5">
        {terms.map((term) => (
          <li key={term.pathname}>
            <GlossaryTermCard
              anchorId={term.anchorId}
              term={term.term}
              description={term.description}
              pathname={term.pathname}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default GlossaryLetterSection;
