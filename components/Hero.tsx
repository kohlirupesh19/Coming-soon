"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";
import Container from "@/components/ui/Container";

const LightPillar = dynamic(() => import("@/components/LightPillar"), {
  ssr: false
});

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 }
};

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden border-b border-white/10 pb-12 pt-28"
      aria-labelledby="hero-heading"
    >
      <LightPillar
        topColor="#86A5D0"
        bottomColor="#1C345B"
        intensity={1.06}
        rotationSpeed={0.22}
        glowAmount={0.0036}
        pillarWidth={2.9}
        pillarHeight={0.44}
        noiseIntensity={0.35}
        pillarRotation={10}
        interactive={false}
        mixBlendMode="screen"
        quality="high"
        className="opacity-85"
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(70,114,171,0.2),transparent_40%),radial-gradient(circle_at_84%_10%,rgba(93,143,198,0.14),transparent_36%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(1,5,14,0.22),rgba(2,6,16,0.9)_88%)]" aria-hidden="true" />

      <Container className="relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mx-auto flex max-w-5xl flex-col items-center text-center"
        >
          <motion.p
            variants={fadeUp}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="mb-5 rounded-full border border-white/20 bg-white/[0.06] px-4 py-1.5 text-xs tracking-[0.2em] text-text-muted"
          >
            ENGINEERING-FIRST STARTUP
          </motion.p>

          <motion.h1
            id="hero-heading"
            variants={fadeUp}
            transition={{ delay: 0.12, duration: 0.58 }}
            className="text-balance text-5xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-8xl"
          >
            We Build Intelligent <span className="text-gradient">Digital Systems</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="mt-7 max-w-2xl text-base text-text-muted sm:text-lg"
          >
            A startup focused on designing modern web platforms, AI-powered software, and scalable digital products.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ delay: 0.28, duration: 0.55 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link href="/#contact" className={buttonStyles({ size: "lg", variant: "primary" })}>
              Start a Project
            </Link>
            <Link href="/services" className={buttonStyles({ size: "lg", variant: "secondary" })}>
              Explore Services
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
