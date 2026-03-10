import type { IBlogSearchItem } from '@/types/blog';
import type { IGlossaryLetterGroup } from '@/types/glossary';
import { cn } from '@/lib/utils';
import GlossaryLetterSection from '@/components/pages/glossary/glossary-letter-section';
import GlossaryStickyControls from '@/components/pages/glossary/glossary-sticky-controls';

interface IGlossaryDirectoryProps {
  className?: string;
  groups: IGlossaryLetterGroup[];
  searchItems: IBlogSearchItem[];
  suggestions: IBlogSearchItem[];
}

function GlossaryDirectory({
  className,
  groups,
  searchItems,
  suggestions,
}: IGlossaryDirectoryProps) {
  const availableLetters = groups.map((group) => group.letter.toUpperCase());

  return (
    <section
      className={cn(
        'section-container mb-24 pt-16 md:mb-32 md:pt-12 lg:mb-40 xl:mb-50 xl:!px-40 xl:pt-38',
        className,
      )}
    >
      <div className="flex flex-col gap-9">
        <GlossaryStickyControls
          searchItems={searchItems}
          suggestions={suggestions}
          availableLetters={availableLetters}
          initialActiveLetter={groups[0]?.letter.toUpperCase()}
        />

        <div className="flex flex-col gap-14">
          {groups.map((group) => (
            <GlossaryLetterSection key={group.letter} letter={group.letter} terms={group.terms} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default GlossaryDirectory;
export type { IGlossaryDirectoryProps };
