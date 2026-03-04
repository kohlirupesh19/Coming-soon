"use client";

import TagCloud, { type TagCloud as TagCloudInstance, type TagCloudOptions } from "TagCloud";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import styles from "./TechStackGlobe.module.css";

type TechStackGlobeProps = {
  technologies: string[];
  selectedTechnology: string;
  onSelectTechnology: (technology: string) => void;
  className?: string;
};

type ExtendedTagCloudOptions = TagCloudOptions & {
  direction?: number;
  reverseDirection?: boolean;
};

const isTagCloudArray = (instance: TagCloudInstance | TagCloudInstance[]): instance is TagCloudInstance[] =>
  Array.isArray(instance);

export default function TechStackGlobe({
  technologies,
  selectedTechnology,
  onSelectTechnology,
  className
}: TechStackGlobeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const tagHostRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef(selectedTechnology);

  const technologySet = useMemo(() => new Set(technologies), [technologies]);

  useEffect(() => {
    const root = rootRef.current;
    const canvasHost = canvasHostRef.current;
    if (!root || !canvasHost) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, root.clientWidth / Math.max(root.clientHeight, 1), 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(root.clientWidth, root.clientHeight);
    renderer.setClearColor(0x000000, 0);
    canvasHost.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const shellGeometry = new THREE.IcosahedronGeometry(2.45, 3);
    const shellMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#8db9ff"),
      transparent: true,
      wireframe: true,
      opacity: 0.2
    });
    const shellMesh = new THREE.Mesh(shellGeometry, shellMaterial);
    globeGroup.add(shellMesh);

    const haloGeometry = new THREE.SphereGeometry(2.68, 30, 30);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#2d4d80"),
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide
    });
    const haloMesh = new THREE.Mesh(haloGeometry, haloMaterial);
    globeGroup.add(haloMesh);

    const ringGeometry = new THREE.TorusGeometry(3.1, 0.03, 14, 120);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#a5cbff"),
      transparent: true,
      opacity: 0.24
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI * 0.38;
    ringMesh.rotation.y = Math.PI * 0.14;
    globeGroup.add(ringMesh);

    const starsGeometry = new THREE.BufferGeometry();
    const STAR_COUNT = 120;
    const starsPosition = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i += 1) {
      const distance = 3.2 + Math.random() * 1.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const index = i * 3;
      starsPosition[index] = distance * Math.sin(phi) * Math.cos(theta);
      starsPosition[index + 1] = distance * Math.sin(phi) * Math.sin(theta);
      starsPosition[index + 2] = distance * Math.cos(phi);
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starsPosition, 3));

    const starsMaterial = new THREE.PointsMaterial({
      color: new THREE.Color("#dce9ff"),
      size: 0.05,
      transparent: true,
      opacity: 0.82,
      depthWrite: false
    });
    const starsPoints = new THREE.Points(starsGeometry, starsMaterial);
    globeGroup.add(starsPoints);

    const targetRotation = { x: 0.18, y: 0 };
    const dragState = { isDragging: false, pointerId: -1, lastX: 0, lastY: 0 };
    let animationFrame = 0;

    const animate = () => {
      if (!prefersReducedMotion && !dragState.isDragging) {
        targetRotation.y += 0.0011;
      }

      globeGroup.rotation.x = THREE.MathUtils.lerp(globeGroup.rotation.x, targetRotation.x, 0.06);
      globeGroup.rotation.y = THREE.MathUtils.lerp(globeGroup.rotation.y, targetRotation.y, 0.06);
      renderer.render(scene, camera);

      animationFrame = window.requestAnimationFrame(animate);
    };

    const syncCanvasSize = () => {
      const width = root.clientWidth;
      const height = Math.max(root.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }
      dragState.isDragging = true;
      dragState.pointerId = event.pointerId;
      dragState.lastX = event.clientX;
      dragState.lastY = event.clientY;
      root.dataset.dragging = "true";
      root.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragState.isDragging) {
        return;
      }

      const dx = event.clientX - dragState.lastX;
      const dy = event.clientY - dragState.lastY;
      dragState.lastX = event.clientX;
      dragState.lastY = event.clientY;

      targetRotation.y += dx * 0.0085;
      targetRotation.x = THREE.MathUtils.clamp(targetRotation.x + dy * 0.0054, -0.7, 0.7);

      if (event.pointerType !== "mouse") {
        window.dispatchEvent(
          new MouseEvent("mousemove", {
            clientX: event.clientX,
            clientY: event.clientY,
            bubbles: true
          })
        );
      }
    };

    const endDrag = () => {
      if (!dragState.isDragging) {
        return;
      }
      dragState.isDragging = false;
      root.dataset.dragging = "false";
      if (dragState.pointerId !== -1 && root.hasPointerCapture(dragState.pointerId)) {
        root.releasePointerCapture(dragState.pointerId);
      }
      dragState.pointerId = -1;
    };

    const handleResize = () => {
      syncCanvasSize();
    };

    root.addEventListener("pointerdown", handlePointerDown, { passive: true });
    root.addEventListener("pointermove", handlePointerMove, { passive: true });
    root.addEventListener("pointerup", endDrag, { passive: true });
    root.addEventListener("pointerleave", endDrag, { passive: true });
    root.addEventListener("pointercancel", endDrag, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    if (!prefersReducedMotion) {
      animationFrame = window.requestAnimationFrame(animate);
    } else {
      renderer.render(scene, camera);
    }

    return () => {
      root.removeEventListener("pointerdown", handlePointerDown);
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerup", endDrag);
      root.removeEventListener("pointerleave", endDrag);
      root.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("resize", handleResize);

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      shellGeometry.dispose();
      shellMaterial.dispose();
      haloGeometry.dispose();
      haloMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      renderer.dispose();

      if (canvasHost.contains(renderer.domElement)) {
        canvasHost.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const host = tagHostRef.current;
    if (!host || technologies.length === 0) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const options: ExtendedTagCloudOptions = {
      radius: 140,
      maxSpeed: prefersReducedMotion ? "slow" : "normal",
      initSpeed: "normal",
      keep: true,
      useContainerInlineStyles: true,
      useItemInlineStyles: true,
      direction: 135,
      reverseDirection: false
    };

    const getRadius = () => Math.max(118, Math.min(host.clientWidth, host.clientHeight) * 0.36);
    let cloud: TagCloudInstance | null = null;
    let resizeFrame = 0;

    const decorateItems = () => {
      const items = host.querySelectorAll<HTMLElement>(".tagcloud--item");
      items.forEach((item) => {
        const tech = item.textContent?.trim() ?? "";
        const selected = tech === selectedRef.current;
        item.setAttribute("role", "button");
        item.setAttribute("tabindex", "0");
        item.setAttribute("aria-label", `Select ${item.textContent ?? "technology"} details`);
        item.dataset.selected = selected ? "true" : "false";
        item.setAttribute("aria-pressed", selected ? "true" : "false");
      });
    };

    const selectFromNode = (node: HTMLElement | null) => {
      if (!node) {
        return;
      }
      const value = node.textContent?.trim();
      if (value && technologySet.has(value)) {
        onSelectTechnology(value);
      }
    };

    const createCloud = () => {
      if (cloud) {
        cloud.destroy();
        cloud = null;
      }

      host.innerHTML = "";
      const createdCloud = TagCloud(host, technologies, {
        ...options,
        radius: getRadius()
      });
      cloud = isTagCloudArray(createdCloud) ? createdCloud[0] : createdCloud;
      decorateItems();
    };

    const handleClick = (event: Event) => {
      const item = (event.target as HTMLElement).closest(".tagcloud--item") as HTMLElement | null;
      selectFromNode(item);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      const item = (event.target as HTMLElement).closest(".tagcloud--item") as HTMLElement | null;
      if (!item) {
        return;
      }
      event.preventDefault();
      selectFromNode(item);
    };

    createCloud();
    host.addEventListener("click", handleClick);
    host.addEventListener("keydown", handleKeyDown);

    const resizeObserver = new ResizeObserver(() => {
      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame);
      }
      resizeFrame = window.requestAnimationFrame(createCloud);
    });

    resizeObserver.observe(host);

    return () => {
      resizeObserver.disconnect();
      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame);
      }
      host.removeEventListener("click", handleClick);
      host.removeEventListener("keydown", handleKeyDown);
      if (cloud) {
        cloud.destroy();
      }
      host.innerHTML = "";
    };
  }, [onSelectTechnology, technologies, technologySet]);

  useEffect(() => {
    const host = tagHostRef.current;
    if (!host) {
      return;
    }

    selectedRef.current = selectedTechnology;

    const items = host.querySelectorAll<HTMLElement>(".tagcloud--item");
    items.forEach((item) => {
      const tech = item.textContent?.trim() ?? "";
      const selected = tech === selectedTechnology;
      item.dataset.selected = selected ? "true" : "false";
      item.setAttribute("aria-pressed", selected ? "true" : "false");
    });
  }, [selectedTechnology, technologies]);

  return (
    <div
      ref={rootRef}
      className={cn(
        styles.globeRoot,
        "h-[360px] w-full border border-white/12 bg-black/45 shadow-[0_26px_70px_rgba(0,0,0,0.55)] md:h-[420px]",
        className
      )}
      data-dragging="false"
      aria-label="Interactive 3D technology cloud. Drag to rotate and select a technology."
    >
      <div ref={canvasHostRef} className={styles.canvasLayer} aria-hidden="true" />
      <div className={styles.overlay} aria-hidden="true" />
      <div ref={tagHostRef} className={styles.tagLayer} />
      <p className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-text-muted">
        Drag to rotate · Click a technology
      </p>
    </div>
  );
}
