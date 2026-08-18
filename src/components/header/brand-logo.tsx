'use client';

import { useId, useRef, useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import config from '@/configs/website-config';
import { Download } from 'lucide-react';

import {
  HeaderPopover,
  HeaderPopoverItem,
  HeaderPopoverPreview,
  HeaderPopoverText,
} from './header-popover';

interface IBrandLogoProps {
  alt: string;
  href: string;
  src: string;
}

const brandAssets = [
  {
    label: 'Black wordmark',
    href: config.logo.dark,
    filename: 'unkey-wordmark-black.svg',
    width: 83,
    height: 28,
    previewClassName: 'bg-gray-94',
  },
  {
    label: 'White wordmark',
    href: config.logo.light,
    filename: 'unkey-wordmark-white.svg',
    width: 83,
    height: 28,
    previewClassName: 'bg-gray-12',
  },
  {
    label: 'Black logo',
    href: '/favicon/favicon-light.svg',
    filename: 'unkey-logo-black.svg',
    width: 40,
    height: 40,
    previewClassName: 'bg-gray-94',
  },
  {
    label: 'White logo',
    href: '/favicon/favicon-dark.svg',
    filename: 'unkey-logo-white.svg',
    width: 40,
    height: 40,
    previewClassName: 'bg-gray-12',
  },
];

function focusMenuItem(element: HTMLAnchorElement | null) {
  element?.focus();
}

function BrandLogo({ alt, href, src }: IBrandLogoProps) {
  const menuId = useId();
  const logoRef = useRef<HTMLAnchorElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative flex h-full shrink-0 items-center"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <NextLink
        ref={logoRef}
        className="inline-flex shrink-0"
        href={href}
        aria-controls={isOpen ? menuId : undefined}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onContextMenu={(event) => {
          event.preventDefault();
          setIsOpen(true);
        }}
      >
        <Image className="block h-7 w-auto shrink-0" src={src} alt={alt} width={83} height={28} />
      </NextLink>

      {isOpen && (
        <HeaderPopover
          id={menuId}
          role="menu"
          aria-label="Download brand assets"
          isOpen={isOpen}
          className="-left-6 z-70"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              setIsOpen(false);
              logoRef.current?.focus();
              return;
            }

            if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
              return;
            }

            event.preventDefault();
            const items = Array.from(
              event.currentTarget.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]'),
            );
            const currentIndex = items.indexOf(document.activeElement as HTMLAnchorElement);
            const nextIndex =
              event.key === 'Home'
                ? 0
                : event.key === 'End'
                  ? items.length - 1
                  : (currentIndex + (event.key === 'ArrowDown' ? 1 : -1) + items.length) %
                    items.length;

            items[nextIndex]?.focus();
          }}
        >
          {brandAssets.map((asset, index) => (
            <HeaderPopoverItem
              key={asset.href}
              className="group outline-none focus-visible:bg-gray-94"
            >
              <a
                ref={index === 0 ? focusMenuItem : undefined}
                role="menuitem"
                href={asset.href}
                download={asset.filename}
                onClick={() => setIsOpen(false)}
              >
                <HeaderPopoverPreview className={asset.previewClassName}>
                  <Image
                    src={asset.href}
                    alt=""
                    width={asset.width}
                    height={asset.height}
                    className="max-h-5 max-w-7 object-contain"
                    aria-hidden
                  />
                </HeaderPopoverPreview>
                <HeaderPopoverText className="flex-1" label={asset.label} description="SVG" />
                <Download className="mt-2.5 size-3.5 shrink-0 text-gray-40 transition-colors group-hover:text-background group-focus-visible:text-background" />
              </a>
            </HeaderPopoverItem>
          ))}
        </HeaderPopover>
      )}
    </div>
  );
}

export default BrandLogo;
