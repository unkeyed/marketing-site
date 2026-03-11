import { ICookieSettingsItem } from '@/types/common';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface ISettingsProps {
  className?: string;
  checkboxValues: ICookieSettingsItem[];
  handleCheckboxChange: (index: number) => void;
  handleAcceptClick: () => void;
  handleSaveClick: () => void;
}

export default function Settings({
  className,
  checkboxValues,
  handleCheckboxChange,
  handleAcceptClick,
  handleSaveClick,
}: ISettingsProps) {
  return (
    <div className={cn('w-full', className)}>
      <h2 className="text-lg leading-snug font-semibold tracking-tight text-foreground">
        Cookie settings
      </h2>
      <p className="mt-5 text-sm leading-normal tracking-tight text-muted-foreground">
        These cookies are necessary for the website to function and cannot be switched off in our
        systems. They are usually only set in response to actions made by you which amount to a
        request for services, such as setting your privacy preferences, logging in, or filling in
        forms.
      </p>
      <ul className="mt-5 flex flex-col gap-y-5">
        {checkboxValues.map(({ title, description, isChecked, isRequired }, index) => {
          const checkboxId = `cookie-item-${index}`;
          return (
            <li className="flex flex-col gap-y-2 border-t border-border pt-5" key={checkboxId}>
              <div className="flex items-center gap-x-2.5">
                <Checkbox
                  id={checkboxId}
                  checked={isChecked}
                  disabled={isRequired}
                  onCheckedChange={() => handleCheckboxChange(index)}
                  aria-label={`Consent for ${title}`}
                />
                <label
                  htmlFor={checkboxId}
                  className={cn(
                    'w-full text-sm leading-snug font-medium tracking-tight text-foreground',
                    isRequired ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
                  )}
                >
                  <span className="sr-only">Accept for </span>
                  {title}
                </label>
              </div>
              <p className="text-sm leading-normal tracking-tight text-muted-foreground">
                {description}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="mt-7 flex flex-wrap items-center justify-end gap-3 sm:gap-x-3.5 sm:gap-y-0">
        <Button
          className="h-10 min-w-32 rounded-none px-5"
          size="sm"
          variant="outline"
          onClick={handleSaveClick}
        >
          Save settings
        </Button>
        <Button className="h-10 min-w-28 rounded-none px-5" size="sm" onClick={handleAcceptClick}>
          Accept all
        </Button>
      </div>
    </div>
  );
}
