import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface IInitialViewProps {
  allowSettingsCustomization: boolean;
  handleOpenCookieSettings?: () => void;
  handleDeclineClick: () => void;
  handleAcceptClick: () => void;
  description: React.ReactNode;
  isInitiallyExpanded: boolean;
}

export default function InitialView({
  allowSettingsCustomization,
  handleOpenCookieSettings,
  handleDeclineClick,
  handleAcceptClick,
  description,
  isInitiallyExpanded,
}: IInitialViewProps) {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);

  return (
    <div
      className={cn(
        'flex flex-col gap-7',
        !allowSettingsCustomization && 'sm:flex-row sm:items-center sm:justify-between',
      )}
    >
      <div>
        <div
          className={cn(
            'flex flex-col gap-y-5 text-sm leading-normal tracking-tight text-pretty text-muted-foreground',
            !isExpanded && 'line-clamp-3',
          )}
        >
          {description}
        </div>
        {allowSettingsCustomization && (
          <button
            className="tracking-none mt-2.5 text-[0.8125rem] leading-snug font-medium text-foreground transition-colors duration-300 hover:text-foreground/85"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className={cn(
            'order-1 flex w-full flex-row flex-wrap gap-3 sm:order-2 sm:w-auto sm:flex-nowrap sm:gap-x-3.5',
            !allowSettingsCustomization && 'sm:ml-auto',
          )}
        >
          <Button
            className="h-10 min-w-0 flex-1 rounded-none px-5 sm:min-w-28 sm:flex-none"
            variant="outline"
            size="sm"
            onClick={handleDeclineClick}
          >
            Reject
          </Button>
          <Button
            className="h-10 min-w-0 flex-1 rounded-none px-5 sm:min-w-28 sm:flex-none"
            size="sm"
            onClick={handleAcceptClick}
          >
            Accept
          </Button>
        </div>
        {allowSettingsCustomization && handleOpenCookieSettings && (
          <Button
            className="order-2 w-full justify-center px-0 text-center text-foreground underline decoration-muted-foreground underline-offset-[0.375rem] hover:decoration-foreground sm:order-1 sm:w-fit sm:justify-start sm:text-left"
            variant="link"
            size="sm"
            onClick={handleOpenCookieSettings}
          >
            Cookies settings
          </Button>
        )}
      </div>
    </div>
  );
}
