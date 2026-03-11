'use client';

import { createContext, useContext } from 'react';
import { cookieBanner } from '@/configs/cookie-banner-config';

import { type ICookieBanner } from '@/types/common';
import useCookieBanner from '@/hooks/use-cookie-banner';

const CookieBannerContext = createContext<ICookieBanner>({} as ICookieBanner);

export const useCookieContext = () => useContext(CookieBannerContext);

export function CookieBannerProvider({ children }: { children: React.ReactNode }) {
  const cookieBannerValue = useCookieBanner({
    cookieSettings: cookieBanner.cookieSettings,
    cookieKey: cookieBanner.key,
  });

  return (
    <CookieBannerContext.Provider value={cookieBannerValue}>
      {children}
    </CookieBannerContext.Provider>
  );
}
