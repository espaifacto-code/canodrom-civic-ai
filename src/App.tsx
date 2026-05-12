import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Dashboard from "@/pages/Dashboard";
import Explorer from "@/pages/Explorer";
import ProcessDiagram from "@/pages/ProcessDiagram";
import Index from "@/pages/Index";
import NotFound from "./pages/NotFound";
import { Skeleton } from "@/components/ui/skeleton";

// Lszy load the Transparency page for better performance
const Transparency = lazy(() => import("@/pages/Transparency"));

// Loading component for lazy-loaded pages
const PageSkeleton = () => (
  <main className="min-h-screen bg-background">
    <div className="container py-10">
      <div className="mb-10 text-center">
        <Skeleton className="h-8 w-96 mx-auto mb-3" />
        <Skeleton className="h-4 w-128 mx-auto" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
      </div>
    </div>
  </main>
);

const queryClient = new QueryClient();

const AppShell = () => {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";

  return (
    <div className={isLanding ? "min-h-screen" : "subpage-theme subpage-shell min-h-screen"}>
      {!isLanding && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(37,99,235,0.12),transparent_34%),radial-gradient(circle_at_85%_12%,rgba(14,165,233,0.1),transparent_24%),radial-gradient(circle_at_80%_84%,rgba(59,130,246,0.08),transparent_30%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.5),rgba(244,249,255,0.72))]" />
        </>
      )}

      <div className="relative z-10">
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/process" element={<ProcessDiagram />} />
          <Route
            path="/transparency"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <Transparency />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <AppShell />
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

