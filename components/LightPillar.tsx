"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import styles from "./LightPillar.module.css";

export type LightPillarQuality = "low" | "medium" | "high";

export interface LightPillarProps {
  topColor?: string;
  bottomColor?: string;
  intensity?: number;
  rotationSpeed?: number;
  interactive?: boolean;
  className?: string;
  glowAmount?: number;
  pillarWidth?: number;
  pillarHeight?: number;
  noiseIntensity?: number;
  mixBlendMode?: CSSProperties["mixBlendMode"];
  pillarRotation?: number;
  quality?: LightPillarQuality;
}

type QualitySettings = {
  iterations: number;
  waveIterations: number;
  pixelRatio: number;
  precision: "highp" | "mediump";
  stepMultiplier: number;
  targetFps: number;
};

const QUALITY_SETTINGS: Record<LightPillarQuality, QualitySettings> = {
  low: {
    iterations: 24,
    waveIterations: 1,
    pixelRatio: 0.7,
    precision: "mediump",
    stepMultiplier: 1.5,
    targetFps: 30
  },
  medium: {
    iterations: 40,
    waveIterations: 2,
    pixelRatio: 1,
    precision: "mediump",
    stepMultiplier: 1.2,
    targetFps: 45
  },
  high: {
    iterations: 80,
    waveIterations: 4,
    pixelRatio: 1.5,
    precision: "highp",
    stepMultiplier: 1.0,
    targetFps: 60
  }
};

function hasWebGLSupport(): boolean {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  return Boolean(context);
}

function resolveQuality(preferred: LightPillarQuality): LightPillarQuality {
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  const isLowEndDevice = Boolean(
    isMobile || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
  );

  if (isMobile && preferred !== "low") {
    return "low";
  }

  if (isLowEndDevice && preferred === "high") {
    return "medium";
  }

  return preferred;
}

function parseColor(hex: string): THREE.Vector3 {
  const color = new THREE.Color(hex);
  return new THREE.Vector3(color.r, color.g, color.b);
}

export default function LightPillar({
  topColor = "#5227FF",
  bottomColor = "#FF9FFC",
  intensity = 1.0,
  rotationSpeed = 0.3,
  interactive = false,
  className = "",
  glowAmount = 0.005,
  pillarWidth = 3.0,
  pillarHeight = 0.4,
  noiseIntensity = 0.5,
  mixBlendMode = "screen",
  pillarRotation = 0,
  quality = "high"
}: LightPillarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const mouseTargetRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const timeRef = useRef<number>(0);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);

  useEffect(() => {
    if (!hasWebGLSupport()) {
      setWebGLSupported(false);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !webGLSupported) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const effectiveQuality = resolveQuality(quality);
    const settings = QUALITY_SETTINGS[effectiveQuality];

    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: effectiveQuality === "high" ? "high-performance" : "low-power",
        precision: settings.precision,
        stencil: false,
        depth: false
      });
    } catch {
      setWebGLSupported(false);
      return;
    }

    const pixelRatio = Math.min(window.devicePixelRatio, settings.pixelRatio);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision ${settings.precision} float;

      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform vec3 uTopColor;
      uniform vec3 uBottomColor;
      uniform float uIntensity;
      uniform bool uInteractive;
      uniform float uGlowAmount;
      uniform float uPillarWidth;
      uniform float uPillarHeight;
      uniform float uNoiseIntensity;
      uniform float uRotCos;
      uniform float uRotSin;
      uniform float uPillarRotCos;
      uniform float uPillarRotSin;
      uniform float uWaveSin;
      uniform float uWaveCos;
      varying vec2 vUv;

      const float STEP_MULT = ${settings.stepMultiplier.toFixed(1)};
      const int MAX_ITER = ${settings.iterations};
      const int WAVE_ITER = ${settings.waveIterations};

      void main() {
        vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
        uv = vec2(
          uPillarRotCos * uv.x - uPillarRotSin * uv.y,
          uPillarRotSin * uv.x + uPillarRotCos * uv.y
        );

        vec3 ro = vec3(0.0, 0.0, -10.0);
        vec3 rd = normalize(vec3(uv, 1.0));

        float rotC = uRotCos;
        float rotS = uRotSin;
        if (uInteractive && (uMouse.x != 0.0 || uMouse.y != 0.0)) {
          float angle = uMouse.x * 6.283185;
          rotC = cos(angle);
          rotS = sin(angle);
        }

        vec3 col = vec3(0.0);
        float t = 0.1;

        for (int i = 0; i < MAX_ITER; i++) {
          vec3 p = ro + rd * t;
          p.xz = vec2(rotC * p.x - rotS * p.z, rotS * p.x + rotC * p.z);

          vec3 q = p;
          q.y = p.y * uPillarHeight + uTime;

          float freq = 1.0;
          float amp = 1.0;
          for (int j = 0; j < WAVE_ITER; j++) {
            q.xz = vec2(
              uWaveCos * q.x - uWaveSin * q.z,
              uWaveSin * q.x + uWaveCos * q.z
            );
            q += cos(q.zxy * freq - uTime * float(j) * 2.0) * amp;
            freq *= 2.0;
            amp *= 0.5;
          }

          float d = length(cos(q.xz)) - 0.2;
          float bound = length(p.xz) - uPillarWidth;
          float k = 4.0;
          float h = max(k - abs(d - bound), 0.0);
          d = max(d, bound) + h * h * 0.0625 / k;
          d = abs(d) * 0.15 + 0.01;

          float grad = clamp((15.0 - p.y) / 30.0, 0.0, 1.0);
          col += mix(uBottomColor, uTopColor, grad) / d;

          t += d * STEP_MULT;
          if (t > 50.0) {
            break;
          }
        }

        float widthNorm = uPillarWidth / 3.0;
        col = tanh(col * uGlowAmount / widthNorm);

        col -= fract(
          sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453
        ) / 15.0 * uNoiseIntensity;

        gl_FragColor = vec4(col * uIntensity, 1.0);
      }
    `;

    const pillarRotRad = (pillarRotation * Math.PI) / 180;
    const waveSin = Math.sin(0.4);
    const waveCos = Math.cos(0.4);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uMouse: { value: mouseRef.current.clone() },
        uTopColor: { value: parseColor(topColor) },
        uBottomColor: { value: parseColor(bottomColor) },
        uIntensity: { value: intensity },
        uInteractive: { value: interactive },
        uGlowAmount: { value: glowAmount },
        uPillarWidth: { value: pillarWidth },
        uPillarHeight: { value: pillarHeight },
        uNoiseIntensity: { value: noiseIntensity },
        uRotCos: { value: 1.0 },
        uRotSin: { value: 0.0 },
        uPillarRotCos: { value: Math.cos(pillarRotRad) },
        uPillarRotSin: { value: Math.sin(pillarRotRad) },
        uWaveSin: { value: waveSin },
        uWaveCos: { value: waveCos }
      },
      transparent: true,
      depthWrite: false,
      depthTest: false
    });

    materialRef.current = material;
    const geometry = new THREE.PlaneGeometry(2, 2);
    geometryRef.current = geometry;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handlePointerMove = (event: PointerEvent) => {
      if (!interactive) {
        return;
      }
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      mouseTargetRef.current.set(x, y);
    };

    const handlePointerLeave = () => {
      mouseTargetRef.current.set(0, 0);
    };

    if (interactive) {
      container.addEventListener("pointermove", handlePointerMove, { passive: true });
      container.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    }

    const resizeRenderer = () => {
      const currentRenderer = rendererRef.current;
      const currentMaterial = materialRef.current;
      const currentContainer = containerRef.current;

      if (!currentRenderer || !currentMaterial || !currentContainer) {
        return;
      }

      const nextWidth = Math.max(currentContainer.clientWidth, 1);
      const nextHeight = Math.max(currentContainer.clientHeight, 1);
      currentRenderer.setSize(nextWidth, nextHeight, false);
      (currentMaterial.uniforms.uResolution.value as THREE.Vector2).set(nextWidth, nextHeight);
    };

    const resizeObserver = new ResizeObserver(resizeRenderer);
    resizeObserver.observe(container);

    let isPageVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let lastFrameTime = performance.now();
    const frameInterval = 1000 / settings.targetFps;

    const animate = (timestamp: number) => {
      if (!rendererRef.current || !materialRef.current) {
        return;
      }

      if (!isPageVisible) {
        rafRef.current = window.requestAnimationFrame(animate);
        return;
      }

      const deltaMs = timestamp - lastFrameTime;
      if (deltaMs >= frameInterval) {
        const deltaSeconds = Math.min(deltaMs, 100) / 1000;
        timeRef.current += deltaSeconds * rotationSpeed * 3;
        const t = timeRef.current;

        mouseRef.current.lerp(mouseTargetRef.current, interactive ? 0.08 : 1);

        material.uniforms.uTime.value = t;
        (material.uniforms.uMouse.value as THREE.Vector2).copy(mouseRef.current);
        material.uniforms.uRotCos.value = Math.cos(t * 0.3);
        material.uniforms.uRotSin.value = Math.sin(t * 0.3);

        renderer.render(scene, camera);
        lastFrameTime = timestamp - (deltaMs % frameInterval);
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    if (prefersReducedMotion) {
      material.uniforms.uInteractive.value = false;
      renderer.render(scene, camera);
    } else {
      rafRef.current = window.requestAnimationFrame(animate);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      resizeObserver.disconnect();

      if (interactive) {
        container.removeEventListener("pointermove", handlePointerMove);
        container.removeEventListener("pointerleave", handlePointerLeave);
      }

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }

      if (materialRef.current) {
        materialRef.current.dispose();
      }

      if (geometryRef.current) {
        geometryRef.current.dispose();
      }

      rendererRef.current = null;
      materialRef.current = null;
      geometryRef.current = null;
      rafRef.current = null;
    };
  }, [
    topColor,
    bottomColor,
    intensity,
    rotationSpeed,
    interactive,
    glowAmount,
    pillarWidth,
    pillarHeight,
    noiseIntensity,
    mixBlendMode,
    pillarRotation,
    quality,
    webGLSupported
  ]);

  if (!webGLSupported) {
    return (
      <div className={cn(styles.fallback, className)} style={{ mixBlendMode }}>
        WebGL not supported
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(styles.container, className)}
      style={{ mixBlendMode }}
      aria-hidden="true"
    />
  );
}
