"use client";

import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import * as THREE from "three";

type ParticleDatum = {
  baseX: number;
  baseY: number;
  baseZ: number;
  phase: number;
};

const PARTICLE_COUNT = 240;

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const noise3D = createNoise3D();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100
    );
    camera.position.z = 9;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const particles: ParticleDatum[] = [];

    const startColor = new THREE.Color("#a8e063");
    const endColor = new THREE.Color("#56ab2f");

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 8;
      const t = i / PARTICLE_COUNT;
      const color = startColor.clone().lerp(endColor, t);

      const idx = i * 3;
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      colors[idx] = color.r;
      colors[idx + 1] = color.g;
      colors[idx + 2] = color.b;

      particles.push({ baseX: x, baseY: y, baseZ: z, phase: Math.random() * 100 });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.58,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const mouse = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();
    let frameId = 0;

    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      mouse.set(x * 2 - 1, -(y * 2 - 1));
    };

    const onResize = () => {
      if (!container) {
        return;
      }
      const width = container.clientWidth;
      const height = Math.max(container.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const positionAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

      for (let i = 0; i < PARTICLE_COUNT; i += 1) {
        const datum = particles[i];
        const idx = i * 3;

        const nx = noise3D(datum.baseX * 0.09 + elapsed * 0.08, datum.baseY * 0.05, datum.phase);
        const ny = noise3D(datum.baseY * 0.07, datum.baseZ * 0.09 + elapsed * 0.08, datum.phase + 10);
        const nz = noise3D(datum.baseZ * 0.08, datum.baseX * 0.06, datum.phase + elapsed * 0.08);

        positionAttr.array[idx] = datum.baseX + nx * 0.75 + mouse.x * 0.22;
        positionAttr.array[idx + 1] = datum.baseY + ny * 0.75 + mouse.y * 0.2;
        positionAttr.array[idx + 2] = datum.baseZ + nz * 0.4;
      }

      positionAttr.needsUpdate = true;
      points.rotation.y += 0.0007;
      points.rotation.x = mouse.y * 0.04;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.5, 0.035);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 0.3, 0.035);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);

      frameId = window.requestAnimationFrame(animate);
    };

    if (!prefersReducedMotion) {
      frameId = window.requestAnimationFrame(animate);
    } else {
      renderer.render(scene, camera);
    }

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 -z-10" aria-hidden="true" />;
}
