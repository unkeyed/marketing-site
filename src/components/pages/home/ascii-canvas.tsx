'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { shaderMaterial, Text, useFBO } from '@react-three/drei';
import { Canvas, createPortal, extend, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { cn } from '@/lib/utils';

const asciiVertexShader = /* glsl */ `
varying vec2 v_texCoord;

void main() {
  v_texCoord = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const asciiFragmentShader = /* glsl */ `
precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_image;
uniform sampler2D u_fontAtlas;

uniform vec2 u_resolution;

uniform float u_matrixCharSize;
uniform float u_backgroundCharSize;
uniform float u_depthIntensity;
uniform float u_threshold;
uniform float u_symbolBalance;
uniform float u_blackPoint;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_revealProgress;
uniform float u_time;
uniform float u_effectMode;
uniform float u_transparent;

uniform vec3 u_backgroundColor;
uniform vec3 u_backgroundCharColor;
uniform float u_backgroundEnabled;
uniform vec3 u_objectColor1;
uniform vec3 u_objectColor2;
uniform vec3 u_objectColor3;

float random(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 getDepthAndAlpha(vec2 uv) {
  vec4 color = texture2D(u_image, uv);
  color.rgb = (color.rgb - 0.5) * u_contrast + 0.5;
  color.rgb *= u_brightness;
  color.rgb = clamp(color.rgb, 0.0, 1.0);
  float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  return vec2(luminance, color.a);
}

float sampleCharacter(vec2 cellUV, float charIndex, float scale) {
  if (scale < 0.01) return 0.0;

  vec2 centeredUV = cellUV - 0.5;
  scale = max(scale, 0.01);
  centeredUV /= scale;
  vec2 scaledUV = centeredUV + 0.5;

  float edgeSoftness = 0.02 / scale;
  float mask = smoothstep(0.0 - edgeSoftness, 0.0 + edgeSoftness, scaledUV.x)
             * smoothstep(1.0 + edgeSoftness, 1.0 - edgeSoftness, scaledUV.x)
             * smoothstep(0.0 - edgeSoftness, 0.0 + edgeSoftness, scaledUV.y)
             * smoothstep(1.0 + edgeSoftness, 1.0 - edgeSoftness, scaledUV.y);

  scaledUV = clamp(scaledUV, 0.0, 1.0);

  vec2 fontUV = scaledUV;
  fontUV.x = (fontUV.x * 0.5) + (charIndex * 0.5);

  vec4 charColor = texture2D(u_fontAtlas, fontUV);
  return charColor.r * mask;
}

float segmentDistance(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

float lineMask(vec2 uv, vec2 a, vec2 b, float thickness) {
  float d = segmentDistance(uv, a, b);
  return 1.0 - smoothstep(thickness, thickness + 0.015, d);
}

float circleMask(vec2 uv, vec2 c, float radius, float edge) {
  float d = length(uv - c);
  return 1.0 - smoothstep(radius, radius + edge, d);
}

float sampleDecryptGlyph(vec2 cellUV, float glyphIndex, float scale) {
  if (scale < 0.01) return 0.0;

  vec2 uv = (cellUV - 0.5) / max(scale, 0.01) + 0.5;
  float boxMask = smoothstep(0.0, 0.03, uv.x)
                * smoothstep(1.0, 0.97, uv.x)
                * smoothstep(0.0, 0.03, uv.y)
                * smoothstep(1.0, 0.97, uv.y);
  uv = clamp(uv, 0.0, 1.0);

  float hashMask = 0.0;
  hashMask += lineMask(uv, vec2(0.34, 0.20), vec2(0.34, 0.80), 0.045);
  hashMask += lineMask(uv, vec2(0.66, 0.20), vec2(0.66, 0.80), 0.045);
  hashMask += lineMask(uv, vec2(0.20, 0.36), vec2(0.80, 0.36), 0.045);
  hashMask += lineMask(uv, vec2(0.20, 0.64), vec2(0.80, 0.64), 0.045);
  hashMask = clamp(hashMask, 0.0, 1.0);

  float dotGlyph = circleMask(uv, vec2(0.5, 0.76), 0.09, 0.02);
  float colonGlyph = 0.0;
  colonGlyph += circleMask(uv, vec2(0.5, 0.33), 0.08, 0.02);
  colonGlyph += circleMask(uv, vec2(0.5, 0.67), 0.08, 0.02);
  colonGlyph = clamp(colonGlyph, 0.0, 1.0);

  float slashGlyph = lineMask(uv, vec2(0.28, 0.82), vec2(0.72, 0.18), 0.05);

  float percentMask = 0.0;
  percentMask += lineMask(uv, vec2(0.24, 0.78), vec2(0.76, 0.22), 0.045);
  percentMask += circleMask(uv, vec2(0.29, 0.30), 0.10, 0.02);
  percentMask += circleMask(uv, vec2(0.71, 0.70), 0.10, 0.02);
  percentMask = clamp(percentMask, 0.0, 1.0);

  float glyph = dotGlyph;
  if (glyphIndex < 0.5) {
    glyph = percentMask;
  } else if (glyphIndex < 1.5) {
    glyph = hashMask;
  } else if (glyphIndex < 2.5) {
    glyph = dotGlyph;
  } else if (glyphIndex < 3.5) {
    glyph = colonGlyph;
  } else {
    glyph = slashGlyph;
  }

  return glyph * boxMask;
}

void main() {
  float aspect = u_resolution.x / u_resolution.y;

  float charSize = max(u_matrixCharSize, 1.0);
  float bgCharScale = max(u_backgroundCharSize, 0.1);

  vec2 p = v_texCoord;
  p.x *= aspect;

  float cellSize = charSize;
  vec2 gridIndex = floor(p * u_resolution.y / cellSize);
  vec2 cellUV = fract(p * u_resolution.y / cellSize);

  vec2 cellCenterUV = (gridIndex + 0.5) * cellSize / u_resolution.y;
  cellCenterUV.x /= aspect;
  cellCenterUV = clamp(cellCenterUV, 0.0, 1.0);

  vec2 cellDepthAlpha = getDepthAndAlpha(cellCenterUV);
  float cellDepth = cellDepthAlpha.x;
  float cellAlpha = cellDepthAlpha.y;

  vec3 finalColor = u_backgroundColor;
  float charMask = 0.0;
  vec3 charColor = u_objectColor1;

  if (cellAlpha < 0.1) {
    if (u_backgroundEnabled < 0.5) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      return;
    }
    charMask = sampleCharacter(cellUV, 0.0, bgCharScale);
    charColor = u_backgroundCharColor;
  } else {
    float backgroundMaskForObject = 0.0;
    if (u_backgroundEnabled > 0.5) {
      backgroundMaskForObject = sampleCharacter(cellUV, 0.0, bgCharScale);
    }

    float objectMask = 0.0;
    vec3 objectCharColor = u_objectColor1;
    float objectScale = 0.0;
    float objectCharChoice = 1.0;

    if (cellDepth < u_threshold) {
      objectMask = 0.0;
    } else {
      float normalizedDepth = (cellDepth - u_threshold) / (1.0 - u_threshold + 0.001);
      normalizedDepth = clamp(normalizedDepth, 0.0, 1.0);

      float adjustedDepth = (normalizedDepth - u_blackPoint) / (1.0 - u_blackPoint + 0.001);
      adjustedDepth = clamp(adjustedDepth, 0.0, 1.0);

      if (normalizedDepth < u_blackPoint) {
        objectMask = 0.0;
      } else {
        float scale = adjustedDepth * u_depthIntensity;
        scale = clamp(scale, 0.0, 1.0);
        objectScale = scale;

        float charChoice = (normalizedDepth > u_symbolBalance) ? 1.0 : 0.0;
        objectCharChoice = charChoice;
        objectMask = sampleCharacter(cellUV, charChoice, scale);
      }

      if (normalizedDepth < 0.5) {
        float t = normalizedDepth * 2.0;
        objectCharColor = mix(u_objectColor1, u_objectColor2, t);
      } else {
        float t = (normalizedDepth - 0.5) * 2.0;
        objectCharColor = mix(u_objectColor2, u_objectColor3, t);
      }

      float revealMix = smoothstep(normalizedDepth, normalizedDepth + 0.12, u_revealProgress);

      if (u_effectMode < 0.5) {
        charMask = mix(backgroundMaskForObject, objectMask, revealMix);
        charColor = mix(u_backgroundCharColor, objectCharColor, revealMix);
      } else if (u_effectMode < 1.5) {
        if (normalizedDepth < u_blackPoint) {
          charMask = backgroundMaskForObject;
          charColor = u_backgroundCharColor;
        } else {
          float decryptStart = smoothstep(0.06, 0.28, revealMix);
          float objectResolve = smoothstep(0.56, 0.96, revealMix);

          float cellSeed = random(gridIndex + 9.17);
          float tick = floor(u_time * (20.0 + cellSeed * 12.0) + cellSeed * 41.0);
          float scramblePick = floor(random(gridIndex + vec2(tick, tick * 1.73)) * 5.0);
          float scrambleMask = sampleDecryptGlyph(cellUV, scramblePick, max(objectScale, 0.18));
          vec3 scrambleColor = mix(u_backgroundCharColor, objectCharColor, 0.45 + 0.55 * random(gridIndex + vec2(tick * 0.37, tick * 0.71)));

          float midMask = mix(backgroundMaskForObject, scrambleMask, decryptStart);
          vec3 midColor = mix(u_backgroundCharColor, scrambleColor, decryptStart);

          charMask = mix(midMask, objectMask, objectResolve);
          charColor = mix(midColor, objectCharColor, objectResolve);
        }
      } else {
        if (normalizedDepth < u_blackPoint) {
          charMask = backgroundMaskForObject;
          charColor = u_backgroundCharColor;
        } else {
          float stagger = mod(gridIndex.x + gridIndex.y, 2.0) * 0.12 + random(gridIndex + 6.11) * 0.08;
          float localPhase = clamp((revealMix - stagger) / (1.0 - stagger + 0.0001), 0.0, 1.0);

          float zeroShift = localPhase * 1.15;
          float zeroMask = sampleCharacter(cellUV - vec2(zeroShift, 0.0), 0.0, bgCharScale);
          float zeroVisibility = 1.0 - smoothstep(0.22, 0.86, localPhase);

          float finalVisibility = smoothstep(0.26, 1.0, localPhase);
          float finalMask = sampleCharacter(cellUV, objectCharChoice, max(objectScale, 0.18));

          charMask = max(zeroMask * zeroVisibility, finalMask * finalVisibility);
          charColor = mix(u_backgroundCharColor, objectCharColor, finalVisibility);
        }
      }
    }

    if (cellDepth < u_threshold) {
      charMask = backgroundMaskForObject;
      charColor = u_backgroundCharColor;
    }
  }

  if (u_transparent > 0.5) {
    finalColor = charColor;
    gl_FragColor = vec4(finalColor, charMask);
  } else {
    finalColor = mix(u_backgroundColor, charColor, charMask);
    gl_FragColor = vec4(finalColor, 1.0);
  }
}
`;

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? new THREE.Vector3(
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      )
    : new THREE.Vector3(1, 1, 1);
};

function createPlaceholderTexture() {
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  if (!canvas) return new THREE.Texture();
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 1, 1);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

const AsciiEffectMaterial = shaderMaterial(
  {
    u_image: createPlaceholderTexture(),
    u_fontAtlas: createPlaceholderTexture(),
    u_resolution: new THREE.Vector2(0, 0),
    u_matrixCharSize: 20.0,
    u_backgroundCharSize: 0.5,
    u_depthIntensity: 1.0,
    u_threshold: 0.5,
    u_symbolBalance: 0.5,
    u_blackPoint: 0.5,
    u_brightness: 1.0,
    u_contrast: 1.0,
    u_revealProgress: 1.0,
    u_time: 0.0,
    u_effectMode: 0.0,
    u_transparent: 0.0,
    u_backgroundColor: new THREE.Vector3(0, 0, 0),
    u_backgroundCharColor: new THREE.Vector3(0.2, 0.2, 0.2),
    u_backgroundEnabled: 1.0,
    u_objectColor1: new THREE.Vector3(0.2, 0.2, 0.2),
    u_objectColor2: new THREE.Vector3(0.5, 0.5, 0.5),
    u_objectColor3: new THREE.Vector3(1.0, 1.0, 1.0),
  },
  asciiVertexShader,
  asciiFragmentShader,
);

extend({ AsciiEffectMaterial });

export interface IAsciiConfig {
  imageSrc: string;
  matrixCharSize?: number;
  backgroundCharSize?: number;
  backgroundColor?: string;
  backgroundCharColor?: string;
  backgroundEnabled?: boolean;
  objectColor1?: string;
  objectColor2?: string;
  objectColor3?: string;
  depthIntensity?: number;
  threshold?: number;
  symbolBalance?: number;
  blackPoint?: number;
  brightness?: number;
  contrast?: number;
  appearanceEffect?: 'natural' | 'decryption' | 'symbolShift';
  fontUrl?: string;
}

const DEFAULT_CONFIG: Required<Omit<IAsciiConfig, 'imageSrc' | 'fontUrl'>> = {
  matrixCharSize: 34,
  backgroundCharSize: 85,
  backgroundColor: '#040406',
  backgroundCharColor: '#878787',
  backgroundEnabled: true,
  objectColor1: '#bababa',
  objectColor2: '#bababa',
  objectColor3: '#bababa',
  depthIntensity: 4,
  threshold: 0,
  symbolBalance: 21,
  blackPoint: 8,
  brightness: 1,
  contrast: 1,
  appearanceEffect: 'natural',
};

const DEFAULT_FONT_URL = '/rive/home/GeistMono-Regular.ttf';
const REVEAL_DURATION_MS = 1800;

function FontAtlas({
  textureRef,
  fontUrl,
}: {
  textureRef: React.RefObject<THREE.Texture | null>;
  fontUrl: string;
}) {
  const fbo = useFBO(2048, 1024, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
  });

  const scene = useMemo(() => new THREE.Scene(), []);
  const camera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 0.5, -0.5, 0, 10), []);

  useFrame(({ gl }) => {
    gl.setRenderTarget(fbo);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    if (textureRef.current !== fbo.texture) {
      textureRef.current = fbo.texture;
    }
  });

  return createPortal(
    <>
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[2, 1]} />
        <meshBasicMaterial color="black" />
      </mesh>
      <Text
        font={fontUrl}
        fontSize={0.8}
        position={[-0.5, 0, 0]}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        0
      </Text>
      <Text
        font={fontUrl}
        fontSize={0.8}
        position={[0.5, 0, 0]}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        1
      </Text>
    </>,
    scene,
  );
}

interface IMainSceneProps {
  imageSrc: string;
  config: Required<Omit<IAsciiConfig, 'imageSrc' | 'fontUrl'>>;
  fontUrl: string;
}

function MainScene({ imageSrc, config, fontUrl }: IMainSceneProps) {
  const { size } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const fontTextureRef = useRef<THREE.Texture | null>(null);
  const [imgTexture, setImgTexture] = useState<THREE.Texture | null>(null);
  const revealStartRef = useRef(0);
  const revealRef = useRef(0);

  useEffect(() => {
    if (!imageSrc) {
      setImgTexture(null);
      revealRef.current = 1;
      return;
    }
    const loader = new THREE.TextureLoader();
    loader.load(imageSrc, (tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      setImgTexture(tex);
    });
    revealStartRef.current = performance.now();
    revealRef.current = 0;
  }, [imageSrc]);

  const resolution = useMemo(() => {
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    return new THREE.Vector2(size.width * dpr, size.height * dpr);
  }, [size.width, size.height]);

  useFrame(() => {
    const mat = materialRef.current;
    if (!mat) return;

    const now = performance.now();
    const elapsed = now - revealStartRef.current;
    const linear = Math.min(Math.max(elapsed / REVEAL_DURATION_MS, 0), 1);
    const eased =
      linear < 0.5 ? 4 * linear * linear * linear : 1 - Math.pow(-2 * linear + 2, 3) / 2;
    revealRef.current = imgTexture ? eased : 1;

    mat.uniforms.u_resolution.value.copy(resolution);
    if (imgTexture) mat.uniforms.u_image.value = imgTexture;
    if (fontTextureRef.current) mat.uniforms.u_fontAtlas.value = fontTextureRef.current;

    mat.uniforms.u_matrixCharSize.value = config.matrixCharSize;
    mat.uniforms.u_backgroundCharSize.value = config.backgroundCharSize / 100;
    mat.uniforms.u_depthIntensity.value = config.depthIntensity * 0.5;
    mat.uniforms.u_threshold.value = config.threshold / 100;
    mat.uniforms.u_symbolBalance.value = config.symbolBalance / 100;
    mat.uniforms.u_blackPoint.value = config.blackPoint / 100;
    mat.uniforms.u_brightness.value = config.brightness;
    mat.uniforms.u_contrast.value = config.contrast;
    mat.uniforms.u_revealProgress.value = revealRef.current;
    mat.uniforms.u_time.value = now * 0.001;
    mat.uniforms.u_effectMode.value =
      config.appearanceEffect === 'decryption'
        ? 1
        : config.appearanceEffect === 'symbolShift'
          ? 2
          : 0;
    mat.uniforms.u_transparent.value = 0;
    mat.uniforms.u_backgroundColor.value = hexToRgb(config.backgroundColor);
    mat.uniforms.u_backgroundCharColor.value = hexToRgb(config.backgroundCharColor);
    mat.uniforms.u_backgroundEnabled.value = config.backgroundEnabled ? 1 : 0;
    mat.uniforms.u_objectColor1.value = hexToRgb(config.objectColor1);
    mat.uniforms.u_objectColor2.value = hexToRgb(config.objectColor2);
    mat.uniforms.u_objectColor3.value = hexToRgb(config.objectColor3);
  });

  return (
    <>
      <FontAtlas textureRef={fontTextureRef} fontUrl={fontUrl} />
      <mesh>
        <planeGeometry args={[2, 2]} />
        {/* @ts-expect-error -- custom shader material registered via extend */}
        <asciiEffectMaterial ref={materialRef} transparent />
      </mesh>
    </>
  );
}

interface IAsciiCanvasProps {
  className?: string;
  lazy?: boolean;
  lazyOffset?: number;
  config: IAsciiConfig;
}

function AsciiRenderer({ config, className }: { config: IAsciiConfig; className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const mergedConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);
  const fontUrl = config.fontUrl ?? DEFAULT_FONT_URL;

  if (!mounted) return null;

  return (
    <div className={cn('h-full w-full', className)}>
      <Canvas
        gl={{ antialias: true, alpha: false }}
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1] }}
        style={{ display: 'block', width: '100%', height: '100%' }}
      >
        <MainScene imageSrc={mergedConfig.imageSrc} config={mergedConfig} fontUrl={fontUrl} />
      </Canvas>
    </div>
  );
}

export default function AsciiCanvas({
  className,
  lazy = false,
  lazyOffset = 200,
  config,
}: IAsciiCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(!lazy);

  useEffect(() => {
    if (!lazy || shouldRender) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin: `0px 0px ${lazyOffset}px`, threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [lazy, shouldRender, lazyOffset]);

  if (!lazy) {
    return <AsciiRenderer config={config} className={className} />;
  }

  return (
    <div ref={containerRef} className={className}>
      {shouldRender ? <AsciiRenderer config={config} className="h-full w-full" /> : null}
    </div>
  );
}
