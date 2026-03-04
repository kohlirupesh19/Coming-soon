"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonStyles } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/#technology", label: "Technology" },
  { href: "/#vision", label: "Vision" },
  { href: "/#contact", label: "Contact" }
] as const;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-white/10 transition-colors duration-300",
        scrolled ? "bg-black/75 backdrop-blur-xl" : "bg-black/35"
      )}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Akruit Labs
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link text-sm text-text-muted transition-colors hover:text-text">
              {link.label}
            </Link>
          ))}
          <Link href="/#contact" className={buttonStyles({ size: "md", variant: "primary" })}>
            Start a Project
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-text md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation panel"
              className="fixed inset-0 z-40 bg-black/70 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              id="mobile-nav"
              aria-label="Mobile"
              className="fixed right-0 top-0 z-50 flex h-screen w-[82%] max-w-sm flex-col gap-6 border-l border-white/12 bg-black p-8 md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-lg font-semibold">Akruit Labs</span>
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base text-text-muted transition-colors hover:text-text"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/#contact"
                className={buttonStyles({ size: "lg", variant: "primary", className: "mt-2" })}
                onClick={() => setMenuOpen(false)}
              >
                Start a Project
              </Link>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
