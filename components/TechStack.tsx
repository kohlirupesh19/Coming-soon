"use client";

import { motion } from "framer-motion";
import {
  Atom,
  Cloud,
  Code2,
  Container,
  FileCode2,
  GitBranch,
  Layers,
  Server,
  SquareSigma,
  Workflow
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Card from "@/components/ui/Card";
import ContentContainer from "@/components/ui/Container";

type TechItem = {
  name: string;
  icon: LucideIcon;
};

type TechGroup = {
  group: string;
  items: TechItem[];
};

const techGroups: TechGroup[] = [
  {
    group: "Frontend",
    items: [
      { name: "React", icon: Atom },
      { name: "Next.js", icon: Layers },
      { name: "TypeScript", icon: FileCode2 }
    ]
  },
  {
    group: "Backend",
    items: [
      { name: "Node.js", icon: Server },
      { name: "Python", icon: Code2 }
    ]
  },
  {
    group: "Cloud",
    items: [
      { name: "AWS", icon: Cloud },
      { name: "Docker", icon: Container }
    ]
  },
  {
    group: "AI",
    items: [
      { name: "PyTorch", icon: Workflow },
      { name: "TensorFlow", icon: SquareSigma }
    ]
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function TechStack() {
  return (
    <section id="technology" className="section-divider py-24 md:py-28" aria-labelledby="technology-heading">
      <ContentContainer>
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="technology-heading" className="text-3xl font-semibold tracking-tight md:text-4xl">
            Technology Stack
          </h2>
          <p className="mt-4 text-text-muted">
            We choose proven technologies and modern tooling to build systems that are robust, maintainable, and fast.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {techGroups.map((group, index) => (
            <motion.div
              key={group.group}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              whileHover={{ y: -6, rotate: 0.25 }}
            >
              <Card className="h-full border border-white/12 bg-black/35">
                <h3 className="text-xl font-medium">{group.group}</h3>
                <ul className="mt-5 grid grid-cols-2 gap-3" aria-label={`${group.group} technologies`}>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li
                        key={item.name}
                        className="flex items-center gap-2 rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-sm text-text-muted"
                      >
                        <Icon size={16} className="text-accent-start" aria-hidden="true" />
                        <span>{item.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-text-muted">
          <GitBranch size={14} aria-hidden="true" />
          Built for continuous delivery and long-term maintainability
        </p>
      </ContentContainer>
    </section>
  );
}
