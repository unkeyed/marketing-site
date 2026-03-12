'use client';

import { useCookieContext } from '@/contexts/cookie-banner-context';
import { AnimatePresence, domAnimation, LazyMotion } from 'motion/react';
import * as m from 'motion/react-m';

import { cn } from '@/lib/utils';

import InitialView from './initial-view';
import Settings from './settings';

interface ICookieBannerProps {
  description?: React.ReactNode;
  allowSettingsCustomization?: boolean;
  isInitiallyExpanded?: boolean;
}

export default function CookieBanner({
  description = 'These cookies are necessary for the website to function and cannot be switched off in our systems.',
  allowSettingsCustomization = false,
  isInitiallyExpanded = false,
}: ICookieBannerProps) {
  const {
    isCookieBannerVisible,
    checkboxValues,
    handleCheckboxChange,
    handleAcceptClick,
    handleDeclineClick,
    handleSaveClick,
    isCookieSettingsOpen,
    handleOpenCookieSettings,
  } = useCookieContext();

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isCookieBannerVisible && (
          <m.div
            key="cookie-banner-modal"
            className={cn(
              'fixed inset-x-5 bottom-5 z-[45] max-h-[70vh] overflow-y-auto border border-border bg-popover px-5 pt-4 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.25)] md:inset-x-8 md:bottom-8',
              allowSettingsCustomization ? 'pb-5' : 'pb-4',
              {
                'max-w-xl': !allowSettingsCustomization,
                'max-w-3xl': allowSettingsCustomization && isCookieSettingsOpen,
                'max-w-102': allowSettingsCustomization && !isCookieSettingsOpen,
              },
            )}
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.3 },
            }}
            exit={{
              opacity: 0,
              y: 30,
              transition: { delay: 0, duration: 0.2 },
            }}
          >
            {isCookieSettingsOpen ? (
              <Settings
                checkboxValues={checkboxValues}
                handleCheckboxChange={handleCheckboxChange}
                handleAcceptClick={handleAcceptClick}
                handleSaveClick={handleSaveClick}
              />
            ) : (
              <InitialView
                description={description}
                isInitiallyExpanded={isInitiallyExpanded}
                allowSettingsCustomization={allowSettingsCustomization}
                handleOpenCookieSettings={handleOpenCookieSettings}
                handleDeclineClick={handleDeclineClick}
                handleAcceptClick={handleAcceptClick}
              />
            )}
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
