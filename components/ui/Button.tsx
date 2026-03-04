import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

type ButtonStyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className
}: ButtonStyleProps): string {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-start/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      "bg-accent-gradient text-black shadow-[0_0_0_rgba(168,224,99,0)] hover:shadow-glow hover:-translate-y-0.5",
    secondary:
      "border border-white/20 bg-surface/70 text-text hover:border-accent-start/70 hover:-translate-y-0.5",
    ghost: "text-text hover:bg-white/8"
  };

  const sizeClasses: Record<ButtonSize, string> = {
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base"
  };

  return cn(base, variantClasses[variant], sizeClasses[size], className);
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonStyleProps & {
    type?: "button" | "submit" | "reset";
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonStyles({ variant, size, className })}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
