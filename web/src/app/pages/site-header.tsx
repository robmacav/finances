import { LayoutGrid } from "lucide-react";

import { Icons } from "@/components/icons";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center">
        <a href="/" className="mr-2 flex items-center md:mr-6 md:space-x-2">
          <LayoutGrid className="size-4 me-2" aria-hidden="true" />
          <span className="font-bold">
            {siteConfig.name}
          </span>
        </a>
        <nav className="flex w-full items-center gap-6 text-sm">
          <a
            href="https://diceui.com/docs/components/data-table"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex text-foreground/60 transition-colors hover:text-foreground"
          >
            Docs
          </a>
        </nav>
        <nav className="flex flex-1 items-center md:justify-end">
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
