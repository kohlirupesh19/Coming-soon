import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import Container from "@/components/ui/Container";

const footerNav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/#technology", label: "Technology" },
  { href: "/#vision", label: "Vision" },
  { href: "/#contact", label: "Contact" }
] as const;

const socialLinks = [
  { href: "https://github.com", label: "GitHub", icon: Github },
  { href: "https://linkedin.com", label: "LinkedIn", icon: Linkedin },
  { href: "https://twitter.com", label: "Twitter", icon: Twitter }
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10" aria-label="Footer">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-lg font-semibold">Akruit Labs</p>
            <p className="mt-2 text-sm text-text-muted">Engineering-first digital systems for modern products.</p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-4 text-sm text-text-muted">
            {footerNav.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-text">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-text-muted transition-colors hover:border-accent-start/50 hover:text-text"
                >
                  <Icon size={16} aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </footer>
  );
}
