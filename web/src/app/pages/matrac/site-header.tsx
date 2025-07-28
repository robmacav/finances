import { LayoutGrid } from "lucide-react";

export function SiteHeader() {
  return (
<header className="sticky top-0 z-50 w-full border-border/40 border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
  <div className="container flex h-14 items-center">
    <div className="flex items-center space-x-6">
      <a href="/" className="flex items-center space-x-2">
        <LayoutGrid className="size-4" aria-hidden="true" />
        <span className="font-bold">MATRAC</span>
      </a>
    </div>
  </div>
</header>
  );
}
