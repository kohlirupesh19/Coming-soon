import type { LucideIcon } from "lucide-react";
import { Bot, CloudCog, Laptop, Palette, Smartphone, Wrench } from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  description: string;
  details: string;
  icon: LucideIcon;
  capabilities: readonly string[];
  deliverables: readonly string[];
};

export const SERVICES: readonly Service[] = [
  {
    slug: "web-application-development",
    title: "Web Application Development",
    description: "High-performance web products with resilient architecture and seamless user experiences.",
    details:
      "We design and build modern web applications that prioritize performance, maintainability, and product velocity from day one.",
    icon: Laptop,
    capabilities: [
      "Next.js and React architecture",
      "Scalable component systems",
      "API and data-layer integration",
      "Performance and accessibility optimization"
    ],
    deliverables: [
      "Production-ready web app",
      "Reusable design system foundation",
      "Deployment pipeline and monitoring"
    ]
  },
  {
    slug: "ai-machine-learning-solutions",
    title: "AI & Machine Learning Solutions",
    description: "Applied AI systems that automate workflows, uncover insights, and enable smarter products.",
    details:
      "We ship practical AI features that integrate into real products, from model-assisted workflows to domain-specific intelligent automation.",
    icon: Bot,
    capabilities: [
      "Prompt and LLM workflow design",
      "Model integration and orchestration",
      "Evaluation and safety guardrails",
      "Data pipelines for AI-driven features"
    ],
    deliverables: [
      "AI-enabled product capabilities",
      "Inference and monitoring setup",
      "Operational playbook for iteration"
    ]
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    description: "Cross-platform and native mobile applications optimized for reliability and speed.",
    details:
      "We create mobile experiences with robust architecture, polished UI, and release-ready engineering workflows for iOS and Android.",
    icon: Smartphone,
    capabilities: [
      "Cross-platform app architecture",
      "Native API integration",
      "Offline-first and sync patterns",
      "Store readiness and release process"
    ],
    deliverables: [
      "Mobile app for iOS and Android",
      "Release and QA checklist",
      "Telemetry and crash monitoring"
    ]
  },
  {
    slug: "cloud-infrastructure",
    title: "Cloud Infrastructure",
    description: "Scalable cloud foundations with strong observability, security, and deployment workflows.",
    details:
      "We build cloud environments that support reliable product growth, secure operations, and continuous delivery.",
    icon: CloudCog,
    capabilities: [
      "Infrastructure-as-code setup",
      "Containerized services and orchestration",
      "CI/CD pipeline design",
      "Security and observability controls"
    ],
    deliverables: [
      "Cloud architecture blueprint",
      "Automated deployment workflow",
      "Dashboards and alerting baseline"
    ]
  },
  {
    slug: "ui-ux-design",
    title: "UI / UX Design",
    description: "Interface systems that balance usability, accessibility, and modern product aesthetics.",
    details:
      "We craft user interfaces and interaction systems that improve clarity, reduce friction, and support product scale.",
    icon: Palette,
    capabilities: [
      "Product UX strategy",
      "Wireframes and interactive prototypes",
      "Visual system and component design",
      "Accessibility-first interaction patterns"
    ],
    deliverables: [
      "Validated UI/UX direction",
      "Design assets and documentation",
      "Handoff-ready component specs"
    ]
  },
  {
    slug: "product-engineering",
    title: "Product Engineering",
    description: "From concept to launch with robust engineering standards and modular product architecture.",
    details:
      "We partner from idea to launch, combining strategy, implementation, and technical leadership to ship durable products.",
    icon: Wrench,
    capabilities: [
      "Product roadmap to execution mapping",
      "MVP and iterative release planning",
      "Code quality and architecture standards",
      "Team enablement and technical guidance"
    ],
    deliverables: [
      "Launch-ready product increment",
      "Engineering standards and playbooks",
      "Post-launch optimization backlog"
    ]
  }
] as const;
