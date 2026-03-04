"use client";

import { motion } from "framer-motion";
import { CircleDot, GitBranch, Orbit } from "lucide-react";
import { useMemo, useState } from "react";
import TechStackGlobe from "@/components/three/TechStackGlobe";
import Card from "@/components/ui/Card";
import ContentContainer from "@/components/ui/Container";

type TechCategory = "Frontend" | "Backend" | "Cloud" | "AI";

type TechItem = {
  name: string;
  category: TechCategory;
  description: string;
};

const technologies: TechItem[] = [
  {
    name: "React",
    category: "Frontend",
    description: "Component-driven interfaces with predictable state architecture and reusable UI primitives."
  },
  {
    name: "Next.js",
    category: "Frontend",
    description: "App Router workflows for high-performance rendering, SEO, and structured deployment on Vercel."
  },
  {
    name: "TypeScript",
    category: "Frontend",
    description: "Strict typing for safer refactors, clearer contracts, and long-term maintainability."
  },
  {
    name: "Node.js",
    category: "Backend",
    description: "Event-driven API services with scalable I/O handling and modern JavaScript runtime ergonomics."
  },
  {
    name: "Python",
    category: "Backend",
    description: "Reliable backend services and data processing pipelines for intelligence-heavy workflows."
  },
  {
    name: "AWS",
    category: "Cloud",
    description: "Cloud-native hosting, networking, and managed services optimized for scale and resilience."
  },
  {
    name: "Docker",
    category: "Cloud",
    description: "Portable containers for consistent environments from local development to production."
  },
  {
    name: "PyTorch",
    category: "AI",
    description: "Flexible deep learning framework for custom model training and production experimentation."
  },
  {
    name: "TensorFlow",
    category: "AI",
    description: "End-to-end machine learning tooling for training, optimization, and cross-platform inference."
  }
];

const categoryOrder: TechCategory[] = ["Frontend", "Backend", "Cloud", "AI"];

export default function TechStack() {
  const [selectedTech, setSelectedTech] = useState<string>(technologies[0]?.name ?? "");
  const technologyNames = useMemo(() => technologies.map((technology) => technology.name), []);

  const selectedTechDetails = useMemo(
    () => technologies.find((technology) => technology.name === selectedTech) ?? technologies[0],
    [selectedTech]
  );

  const groupedTechnologies = useMemo(() => {
    return categoryOrder.map((category) => ({
      category,
      items: technologies.filter((technology) => technology.category === category)
    }));
  }, []);

  return (
    <section id="technology" className="section-divider py-24 md:py-28" aria-labelledby="technology-heading">
      <ContentContainer>
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="technology-heading" className="text-3xl font-semibold tracking-tight md:text-4xl">
            3D Technology Globe
          </h2>
          <p className="mt-4 text-text-muted">
            Explore our stack in an interactive cloud. Drag to rotate and click any technology to see how it fits our
            engineering workflow.
          </p>
        </div>

        <div className="mt-14 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
          >
            <TechStackGlobe
              technologies={technologyNames}
              selectedTechnology={selectedTechDetails.name}
              onSelectTechnology={setSelectedTech}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <Card className="h-full border border-white/12 bg-black/40">
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Selected Technology</p>

              <div className="mt-4 rounded-2xl border border-white/12 bg-black/30 p-4">
                <div className="flex items-center gap-2 text-accent-start">
                  <Orbit size={18} aria-hidden="true" />
                  <h3 className="text-2xl font-medium tracking-tight text-white">{selectedTechDetails.name}</h3>
                </div>
                <p className="mt-3 text-sm text-text-muted">{selectedTechDetails.description}</p>
                <p className="mt-4 inline-flex items-center rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.12em] text-text-muted">
                  {selectedTechDetails.category}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {groupedTechnologies.map((group) => (
                  <div key={group.category}>
                    <p className="mb-2 text-xs uppercase tracking-[0.2em] text-text-muted">{group.category}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((technology) => {
                        const isSelected = technology.name === selectedTechDetails.name;
                        return (
                          <button
                            key={technology.name}
                            type="button"
                            onClick={() => setSelectedTech(technology.name)}
                            className={`rounded-full border px-3 py-1 text-xs tracking-[0.08em] transition-colors ${
                              isSelected
                                ? "border-blue-200/55 bg-blue-400/15 text-blue-100"
                                : "border-white/20 bg-white/[0.03] text-text-muted hover:border-white/40 hover:text-white"
                            }`}
                            aria-pressed={isSelected}
                            aria-label={`View ${technology.name} details`}
                          >
                            {technology.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-text-muted">
          <CircleDot size={14} aria-hidden="true" />
          Three.js + TagCloud powered interactive stack explorer
        </p>
        <p className="mt-2 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-text-muted">
          <GitBranch size={14} aria-hidden="true" />
          Built for continuous delivery and long-term maintainability
        </p>
      </ContentContainer>
    </section>
  );
}
