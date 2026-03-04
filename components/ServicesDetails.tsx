"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import { SERVICES } from "@/lib/services";

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 }
};

export default function ServicesDetails() {
  return (
    <section className="pb-24 pt-32 md:pb-28 md:pt-36" aria-labelledby="services-page-heading">
      <Container>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-accent-start">Services</p>
          <h1 id="services-page-heading" className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Engineering Services Built for Product Scale
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base text-text-muted md:text-lg">
            We partner with startup teams to design and deliver modern digital systems across web, mobile, cloud, and AI.
            Each engagement is tailored to business goals, technical constraints, and growth timelines.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/#contact" className={buttonStyles({ size: "lg", variant: "primary" })}>
              Start a Project
            </Link>
            <Link href="/" className={buttonStyles({ size: "lg", variant: "secondary" })}>
              Back to Home
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="mt-14 grid gap-5 lg:grid-cols-2"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <motion.article key={service.slug} id={service.slug} variants={cardVariants} className="scroll-mt-28">
                <Card className="h-full">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-accent-start">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight">{service.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">{service.description}</p>
                  <p className="mt-4 text-sm leading-relaxed text-text-muted">{service.details}</p>

                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <div>
                      <h3 className="text-xs uppercase tracking-[0.2em] text-accent-start">Capabilities</h3>
                      <ul className="mt-3 space-y-2 text-sm text-text-muted">
                        {service.capabilities.map((capability) => (
                          <li key={capability} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-start" aria-hidden="true" />
                            <span>{capability}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xs uppercase tracking-[0.2em] text-accent-start">Deliverables</h3>
                      <ul className="mt-3 space-y-2 text-sm text-text-muted">
                        {service.deliverables.map((deliverable) => (
                          <li key={deliverable} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-start" aria-hidden="true" />
                            <span>{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.article>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="mt-12"
        >
          <Card className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Need a custom engagement model?</h2>
              <p className="mt-2 text-sm text-text-muted">
                We can support discovery, MVP delivery, or long-term product engineering partnerships.
              </p>
            </div>
            <Link href="/#contact" className={buttonStyles({ size: "md", variant: "primary" })}>
              Talk to Akruit Labs
              <ArrowRight size={16} className="ml-2" aria-hidden="true" />
            </Link>
          </Card>
        </motion.div>
      </Container>
    </section>
  );
}
