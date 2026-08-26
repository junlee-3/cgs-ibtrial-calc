import Link from 'next/link';
import { CgsMark } from '@/components/brand/CgsMark';
import { IbMark } from '@/components/brand/IbMark';

export function SiteHeader() {
  return (
    <header className="border-b border-border/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="group flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <CgsMark className="size-10 shrink-0 transition-transform duration-300 group-hover:scale-[1.03]" />
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold tracking-tight text-primary sm:text-base">Canberra Grammar School</p>
            <p className="text-xs text-muted-foreground">IB Trial Grade Calculator</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-1 text-sm sm:flex">
            <Link href="/" className="rounded-lg px-3 py-1.5 text-foreground/80 transition-colors hover:bg-muted hover:text-foreground">
              Calculator
            </Link>
            <Link href="/boundaries" className="rounded-lg px-3 py-1.5 text-foreground/80 transition-colors hover:bg-muted hover:text-foreground">
              Boundaries
            </Link>
          </nav>
          <IbMark className="hidden h-8 w-auto opacity-90 sm:block" />
        </div>
      </div>
    </header>
  );
}
