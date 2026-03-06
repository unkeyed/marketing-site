import { type IRiveFontConfig } from '@/components/ui/rive-canvas.types';

const fontCaches = new Map<string, Promise<Uint8Array>>();

export function loadFontBytes(url: string): Promise<Uint8Array> {
  let cached = fontCaches.get(url);
  if (!cached) {
    cached = fetch(url).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to load font: ${url} (${response.status})`);
      }
      return new Uint8Array(await response.arrayBuffer());
    });
    fontCaches.set(url, cached);
  }
  return cached;
}

export function prefetchFonts(urls: Record<string, string>) {
  for (const url of Object.values(urls)) {
    loadFontBytes(url);
  }
}

function matchFontUrl(fonts: IRiveFontConfig, assetName: string): string | undefined {
  const entries = Object.entries(fonts.urls);
  const patterns = fonts.patterns;

  for (const [key, url] of entries) {
    const pattern = patterns?.[key] ?? new RegExp(key, 'i');
    if (pattern.test(assetName)) return url;
  }

  return fonts.urls.regular ?? entries[0]?.[1];
}

export function createFontAssetLoader(fonts: IRiveFontConfig) {
  return (
    asset: { isFont: boolean; cdnUuid: string; name?: string; decode: (b: Uint8Array) => void },
    bytes: Uint8Array,
  ) => {
    if (!asset.isFont || bytes.length !== 0 || asset.cdnUuid.length !== 0) {
      return false;
    }

    const url = matchFontUrl(fonts, asset.name ?? '');
    if (!url) return false;

    void loadFontBytes(url)
      .then((buffer) => asset.decode(buffer))
      .catch((error: unknown) => console.error('Failed to load Rive font asset:', error));

    return true;
  };
}
