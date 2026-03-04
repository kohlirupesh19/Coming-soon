"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";

const visionPoints = [
  "Drive innovation through practical, engineering-led execution.",
  "Design scalable digital products built for long-term evolution.",
  "Combine product thinking with modern web, cloud, and AI capabilities.",
  "Build durable technology partnerships grounded in measurable outcomes."
] as const;

export default function Vision() {
  return (
    <section id="vision" className="section-divider bg-surface/45 py-24 md:py-28" aria-labelledby="vision-heading">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <h2 id="vision-heading" className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              Engineering the Next Generation of Digital Products
            </h2>
            <p className="mt-5 max-w-2xl text-text-muted">
              Akruit Labs was started with one focus: to build high-impact digital systems using modern engineering, not legacy assumptions.
              We collaborate with ambitious teams to turn ideas into resilient products that can scale over time.
            </p>
            <ul className="mt-7 space-y-3">
              {visionPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-text-muted">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-start" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            <Card className="relative overflow-hidden border border-white/12 bg-black/35 p-0">
              <Image
                src="/vision-grid.svg"
                alt="Abstract technical grid visualization"
                width={760}
                height={600}
                loading="lazy"
                className="h-auto w-full"
              />
            </Card>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
