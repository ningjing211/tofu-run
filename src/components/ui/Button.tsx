import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-brown-sugar text-cream hover:bg-brown-sugar/90 shadow-md shadow-brown-sugar/20",
  secondary:
    "bg-tofu-white text-brown-sugar border-2 border-brown-sugar/20 hover:border-brown-sugar/40",
  ghost: "text-brown-sugar/80 hover:text-brown-sugar hover:bg-tofu-white/60",
};

export function Button({
  children,
  variant = "primary",
  href,
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-medium transition-all active:scale-[0.98]";

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  );
}
