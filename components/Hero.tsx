"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { buttonStyles } from "@/components/ui/Button";
import Container from "@/components/ui/Container";

const ParticleBackground = dynamic(() => import("@/components/three/ParticleBackground"), {
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
      className="relative flex min-h-screen items-center overflow-hidden border-b border-white/10 pt-28"
      aria-labelledby="hero-heading"
    >
      <ParticleBackground />
      <div className="pointer-events-none absolute inset-0 bg-hero-radial" aria-hidden="true" />

      <Container className="relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          <motion.p
            variants={fadeUp}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="mb-5 rounded-full border border-white/15 bg-surface/70 px-4 py-1.5 text-xs tracking-[0.2em] text-text-muted"
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
