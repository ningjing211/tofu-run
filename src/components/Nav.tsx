"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";

const links = [
  { href: "/", label: "首頁" },
  { href: "/lobby", label: "Lobby" },
  { href: "/passport", label: "護照" },
  ...(siteConfig.showLiveEntry ? [{ href: "/live", label: "LIVE" as const }] : []),
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-brown-sugar/10 bg-cream/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg justify-around px-4 py-3">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                active
                  ? "bg-brown-sugar text-cream"
                  : "text-brown-sugar/70 hover:text-brown-sugar"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
