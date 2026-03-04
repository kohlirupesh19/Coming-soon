"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import { SERVICES } from "@/lib/services";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 }
};

export default function Services() {
  return (
    <section id="services-overview" className="section-divider py-24 md:py-28" aria-labelledby="services-heading">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="services-heading" className="text-3xl font-semibold tracking-tight md:text-4xl">
            What We Build
          </h2>
          <p className="mt-4 text-text-muted">
            Akruit Labs helps teams create digital products that are scalable, intelligent, and ready for long-term growth.
          </p>
        </div>

        <motion.div
          className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={itemVariants}
                whileHover={{ y: -8, rotate: -0.35, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 240, damping: 20 }}
              >
                <Card className="group h-full border border-white/14 bg-black/35">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-accent-start transition-colors duration-300 group-hover:border-white/45 group-hover:bg-white/10">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-medium tracking-tight">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">{service.description}</p>
                  <Link
                    href={`/services#${service.slug}`}
                    className="mt-5 inline-flex text-sm font-medium text-accent-start transition-opacity hover:opacity-85"
                  >
                    View details
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
