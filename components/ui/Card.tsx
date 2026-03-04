import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;

export default function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/35 hover:shadow-card",
        className
      )}
      {...props}
    />
  );
}
