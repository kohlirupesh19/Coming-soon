"use client";

import { motion } from "framer-motion";
import { Compass, Lightbulb, Rocket, Wrench } from "lucide-react";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";

const steps = [
  {
    number: "01",
    title: "Idea",
    description: "We shape clear product goals, user outcomes, and technical direction.",
    icon: Lightbulb
  },
  {
    number: "02",
    title: "Design",
    description: "We design architecture and interfaces to support long-term product velocity.",
    icon: Compass
  },
  {
    number: "03",
    title: "Build",
    description: "We implement with scalable code standards, testing discipline, and maintainability.",
    icon: Wrench
  },
  {
    number: "04",
    title: "Launch",
    description: "We ship production-ready systems and continuously optimize post-launch performance.",
    icon: Rocket
  }
] as const;

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

export default function Process() {
  return (
    <section className="section-divider bg-surface/45 py-24 md:py-28" aria-labelledby="process-heading">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="process-heading" className="text-3xl font-semibold tracking-tight md:text-4xl">
            How We Work
          </h2>
          <p className="mt-4 text-text-muted">
            Our engineering process aligns product vision with execution speed and system reliability.
          </p>
        </div>

        <div className="relative mt-14">
          <div className="absolute left-1/2 top-5 hidden h-[1px] w-[82%] -translate-x-1/2 bg-white/15 lg:block" aria-hidden="true" />
          <motion.ol
            className="grid gap-5 lg:grid-cols-4"
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <motion.li
                  key={step.title}
                  variants={itemVariants}
                  className="relative"
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 250, damping: 22 }}
                >
                  <Card className="h-full border border-white/12 bg-black/35">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-[0.2em] text-accent-start/85">{step.number}</span>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-accent-start">
                        <Icon size={20} aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="text-xl font-medium">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-muted">{step.description}</p>
                  </Card>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
      </Container>
    </section>
  );
}
