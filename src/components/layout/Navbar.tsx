import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, FileSearch, GitBranchPlus, Eye, Menu, X, ClipboardList } from "lucide-react";

const navItems = [
  { to: "/dashboard",    label: "Dashboard",        icon: BarChart3 },
  { to: "/responses",    label: "Respuestas",        icon: ClipboardList },
  { to: "/process",      label: "Process Flow",      icon: GitBranchPlus },
  { to: "/transparency", label: "AI Transparency",   icon: Eye },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg = isHome
    ? scrolled
      ? "rgba(5,10,20,0.88)"
      : "transparent"
    : "rgba(248,252,255,0.8)";

  const navBorder = isHome
    ? scrolled
      ? "1px solid rgba(255,255,255,0.07)"
      : "1px solid transparent"
    : "1px solid rgba(148,163,184,0.25)";

  const textCol    = isHome ? "rgba(203,213,225,0.9)" : undefined;
  const textActive = isHome ? "#60a5fa"               : undefined;
  const textHover  = isHome ? "rgba(255,255,255,0.95)" : undefined;

  return (
    <header
      role="banner"
      className="sticky top-0 z-50"
      style={{
        background:    navBg,
        borderBottom:  navBorder,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        transition: "background 0.35s ease, border-color 0.35s ease",
      }}
    >
      <div className="container flex h-16 items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight"
          aria-label="Workshop Canodrom — homepage"
          style={{ color: isHome ? "rgba(255,255,255,0.9)" : undefined, fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg,#2563eb,#0891b2)", boxShadow: "0 2px 12px rgba(37,99,235,0.4)" }}
          >
            WC
          </div>
          <span className="hidden sm:inline" style={{ fontSize: ".9rem", letterSpacing: "-.01em" }}>
            Workshop Canodrom
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? "page" : undefined}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200"
                style={{
                  color:      active ? textActive ?? "hsl(var(--primary))" : textCol ?? "hsl(var(--muted-foreground))",
                  background: active ? (isHome ? "rgba(59,130,246,0.1)" : "hsl(var(--primary)/0.1)") : "transparent",
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = textHover ?? "hsl(var(--foreground))"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = textCol ?? "hsl(var(--muted-foreground))"; }}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-2">
          <a
            href="https://tally.so/r/9qpyWG"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
            style={{
              background:  "linear-gradient(135deg,#2563eb,#0891b2)",
              boxShadow:   "0 2px 10px rgba(37,99,235,0.35)",
              fontFamily:  "'Space Grotesk', sans-serif",
            }}
          >
            Submit Input
          </a>
          <button
            className="md:hidden rounded-lg p-2 transition-colors"
            style={{ color: textCol ?? "hsl(var(--muted-foreground))" }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="md:hidden"
          style={{
            background:    isHome ? "rgba(5,10,20,0.96)" : "rgba(248,252,255,0.97)",
            borderTop:     isHome ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(148,163,184,0.2)",
            backdropFilter: "blur(20px)",
          }}
        >
          <nav className="container flex flex-col py-3" role="navigation">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors"
                  style={{
                    color:      active ? textActive ?? "hsl(var(--primary))" : textCol ?? "hsl(var(--muted-foreground))",
                    background: active ? (isHome ? "rgba(59,130,246,0.1)" : "hsl(var(--primary)/0.1)") : "transparent",
                  }}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
            <a
              href="https://tally.so/r/9qpyWG"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-2 mx-3 mb-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#2563eb,#0891b2)" }}
            >
              Submit Citizen Input
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
