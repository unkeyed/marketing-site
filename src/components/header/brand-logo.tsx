'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import config from '@/configs/website-config';
import { Download } from 'lucide-react';

interface IBrandLogoProps {
  alt: string;
  href: string;
  src: string;
}

const brandAssets = [
  {
    label: 'Black wordmark',
    href: config.logo.dark,
    width: 83,
    height: 28,
    previewClassName: 'bg-gray-94',
  },
  {
    label: 'White wordmark',
    href: config.logo.light,
    width: 83,
    height: 28,
    previewClassName: 'bg-gray-12',
  },
  {
    label: 'Black logo',
    href: '/favicon/favicon-light.svg',
    width: 40,
    height: 40,
    previewClassName: 'bg-gray-94',
  },
  {
    label: 'White logo',
    href: '/favicon/favicon-dark.svg',
    width: 40,
    height: 40,
    previewClassName: 'bg-gray-12',
  },
];

function BrandLogo({ alt, href, src }: IBrandLogoProps) {
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const firstAssetRef = useRef<HTMLAnchorElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    firstAssetRef.current?.focus();

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        logoRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="relative shrink-0"
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
        <div
          id={menuId}
          role="menu"
          aria-label="Download brand assets"
          className="absolute top-full left-0 z-70 mt-2.5 w-80 border border-gray-90 bg-foreground p-2 shadow-lg"
          onKeyDown={(event) => {
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
          <p className="px-2 pt-1 pb-2 text-xs font-medium tracking-tight text-gray-40">
            Download brand assets
          </p>
          <div className="grid grid-cols-2 gap-2">
            {brandAssets.map((asset, index) => (
              <a
                key={asset.href}
                ref={index === 0 ? firstAssetRef : undefined}
                role="menuitem"
                href={asset.href}
                download
                className="group min-w-0 p-1 transition-colors outline-none hover:bg-gray-94 focus-visible:bg-gray-94"
                onClick={() => setIsOpen(false)}
              >
                <span
                  className={`flex h-16 items-center justify-center border border-gray-80 px-4 ${asset.previewClassName}`}
                >
                  <Image
                    src={asset.href}
                    alt=""
                    width={asset.width}
                    height={asset.height}
                    aria-hidden
                  />
                </span>
                <span className="flex items-center justify-between gap-2 px-1 pt-2 pb-1 text-xs font-medium text-background">
                  <span>{asset.label}</span>
                  <Download className="size-3.5 shrink-0 text-gray-40 group-hover:text-background group-focus-visible:text-background" />
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BrandLogo;
