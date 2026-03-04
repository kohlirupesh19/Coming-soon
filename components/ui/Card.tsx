import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;

export default function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-start/45 hover:shadow-[0_14px_40px_rgba(168,224,99,0.16)]",
        className
      )}
      {...props}
    />
  );
}
