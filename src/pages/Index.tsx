import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Users, Shield, Database, Lightbulb, FileText, CheckCircle, Webhook, Sparkles, Zap, Globe, ChevronRight } from "lucide-react";

/* ─────────────────────────────────────────────
   Premium Civic Voice AI — Landing Page
   Dark-first design, Space Grotesk headings,
   bento grid, glass morphism, marquee ticker
───────────────────────────────────────────── */

const TICKER_ITEMS = [
  "Participatory AI",
  "Open Source",
  "Democratic Accountability",
  "Canodrom Workshop",
  "Citizen-Centered",
  "Ethical Governance",
  "RAG Pipeline",
  "Civic Innovation",
  "Transparent AI",
  "Barcelona",
];

const ARCH_STEPS = [
  { num: "01", icon: Webhook,    color: "#3b82f6", title: "Intake & Consent",     desc: "Captures citizen input via Tally forms or webhooks. Validates consent before processing." },
  { num: "02", icon: FileText,   color: "#10b981", title: "Normalization",         desc: "Converts messy form responses into structured civic profiles with issues and priorities." },
  { num: "03", icon: Database,   color: "#8b5cf6", title: "Context Retrieval",     desc: "Queries vector database of planning documents to ground proposals in real policy." },
  { num: "04", icon: Lightbulb,  color: "#f59e0b", title: "Proposal Generation",   desc: "Creates multiple solution types and generates detailed, actionable proposal packages." },
  { num: "05", icon: Shield,     color: "#ef4444", title: "Ethical Review",         desc: "AI governance layer checks for bias, exclusion, accessibility issues, and social fairness." },
  { num: "06", icon: BarChart3,  color: "#06b6d4", title: "Impact Scoring",         desc: "Evaluates proposals across equity, sustainability, feasibility, and community support." },
  { num: "07", icon: CheckCircle,color: "#22c55e", title: "Storage & Transparency", desc: "Stores results in Supabase for dashboard display. Creates citizen-facing explanations." },
];

const PRINCIPLES = [
  { icon: Users,    title: "Citizen-Centered",   desc: "Begins with real participation, not institutional data", accent: "#3b82f6" },
  { icon: Lightbulb,title: "Plural Solutions",    desc: "Generates multiple pathways instead of single answers",   accent: "#f59e0b" },
  { icon: Shield,   title: "Ethical Governance",  desc: "Built-in AI accountability and bias detection",           accent: "#ef4444" },
  { icon: BarChart3,title: "Public Transparency", desc: "All outputs auditable and explainable",                   accent: "#10b981" },
];

export default function Index() {
  const heroArtworkUrl = `${import.meta.env.BASE_URL}og-image.svg`;

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", background: "#050a14" }}>

      {/* ════════════════════════════════════════
          INLINE KEYFRAMES
      ════════════════════════════════════════ */}
      <style>{`
        @keyframes orbit1   { from { transform: rotate(0deg) translateX(200px) rotate(0deg); }   to { transform: rotate(360deg) translateX(200px) rotate(-360deg); } }
        @keyframes orbit2   { from { transform: rotate(100deg) translateX(140px) rotate(-100deg); } to { transform: rotate(460deg) translateX(140px) rotate(-460deg); } }
        @keyframes orbit3   { from { transform: rotate(230deg) translateX(88px) rotate(-230deg); }  to { transform: rotate(590deg) translateX(88px) rotate(-590deg); } }
        @keyframes float    { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-22px); } }
        @keyframes fadeGrid { 0%,100% { opacity:.03; } 50% { opacity:.07; } }
        @keyframes glowPulse{ 0%,100% { opacity:.06; transform:scale(1); } 50% { opacity:.18; transform:scale(1.08); } }
        @keyframes nodeFloat{ 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(10px,-14px) scale(1.18); } 66% { transform:translate(-7px,9px) scale(.88); } }
        @keyframes shimmer  { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn  { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:scale(1); } }
        @keyframes lineGrow { from { width:0; } to { width:100%; } }
        .anim-orbit1  { animation: orbit1 22s linear infinite; }
        .anim-orbit2  { animation: orbit2 32s linear infinite; }
        .anim-orbit3  { animation: orbit3 18s linear infinite; }
        .anim-grid    { animation: fadeGrid 7s ease-in-out infinite; }
        .anim-glow    { animation: glowPulse 5s ease-in-out infinite; }
        .anim-glow2   { animation: glowPulse 7s ease-in-out infinite 1.5s; }
        .anim-float   { animation: float 6s ease-in-out infinite; }
        .anim-float2  { animation: float 8s ease-in-out infinite 1s; }
        .anim-node    { animation: nodeFloat 6s ease-in-out infinite; }
        .anim-node2   { animation: nodeFloat 5s ease-in-out infinite .9s; }
        .anim-node3   { animation: nodeFloat 7s ease-in-out infinite 1.8s; }
        .anim-fadein  { animation: fadeInUp .8s ease forwards; }
        .anim-fadein2 { animation: fadeInUp .8s ease .2s forwards; opacity:0; }
        .anim-fadein3 { animation: fadeInUp .8s ease .4s forwards; opacity:0; }
        .anim-fadein4 { animation: fadeInUp .8s ease .6s forwards; opacity:0; }
        .anim-scalein { animation: scaleIn .7s ease .3s forwards; opacity:0; }
        .shimmer-text {
          background: linear-gradient(90deg, #60a5fa 0%, #22d3ee 30%, #a78bfa 60%, #60a5fa 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .hero-dot1 { width:10px; height:10px; border-radius:9999px; background:rgba(6,182,212,.65); box-shadow:0 0 14px rgba(6,182,212,.55); }
        .hero-dot2 { width:7px;  height:7px;  border-radius:9999px; background:rgba(59,130,246,.5); box-shadow:0 0 10px rgba(59,130,246,.4); }
        .hero-dot3 { width:7px;  height:7px;  border-radius:9999px; background:rgba(147,197,253,.4);box-shadow:0 0 8px rgba(147,197,253,.35); }
        .card-premium {
          background: linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(10px);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .card-premium:hover {
          background: linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%);
          border-color: rgba(59,130,246,0.25);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(59,130,246,0.08);
        }
        .btn-primary {
          background: linear-gradient(135deg, #2563eb, #0891b2);
          border: 1px solid rgba(96,165,250,0.3);
          box-shadow: 0 4px 24px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.1);
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          box-shadow: 0 8px 36px rgba(37,99,235,0.5), inset 0 1px 0 rgba(255,255,255,0.15);
          transform: translateY(-2px);
        }
        .btn-ghost {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(96,165,250,0.35);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .step-line::after {
          content:'';
          position:absolute;
          left:50%;
          bottom:-24px;
          width:1px;
          height:24px;
          background:linear-gradient(180deg, rgba(59,130,246,0.4), transparent);
        }
        .nav-pill {
          position:relative;
          transition: color 0.2s ease;
        }
        .nav-pill::after {
          content:'';
          position:absolute;
          bottom:-2px;
          left:0;
          width:0;
          height:1px;
          background:linear-gradient(90deg,#3b82f6,#06b6d4);
          transition: width 0.3s ease;
        }
        .nav-pill:hover::after,
        .nav-pill[data-active='true']::after {
          width:100%;
        }
        .section-divider {
          height:1px;
          background:linear-gradient(90deg, transparent, rgba(59,130,246,0.2), rgba(6,182,212,0.2), transparent);
        }
        .stat-number {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          line-height: 1;
          background: linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.55));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-badge {
          background: linear-gradient(135deg, rgba(37,99,235,0.15), rgba(8,145,178,0.15));
          border: 1px solid rgba(59,130,246,0.25);
          box-shadow: 0 2px 12px rgba(37,99,235,0.12), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .gradient-border-card {
          position:relative;
          border-radius:1.25rem;
          overflow:hidden;
        }
        .gradient-border-card::before {
          content:'';
          position:absolute;
          inset:0;
          padding:1px;
          border-radius:1.25rem;
          background:linear-gradient(135deg, rgba(59,130,246,0.3), rgba(6,182,212,0.15), rgba(139,92,246,0.2));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events:none;
        }
      `}</style>

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden" style={{ background: "linear-gradient(160deg, #060d1e 0%, #071428 40%, #08152e 70%, #050a14 100%)" }}>

        {/* Background grid */}
        <svg className="anim-grid absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0"/>
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="1"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {[10,20,30,40,50,60,70,80,90].map(p => (
            <line key={`v${p}`} x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%" stroke="url(#vg)" strokeWidth=".4"/>
          ))}
          {[15,30,45,60,75].map(p => (
            <line key={`h${p}`} x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke="#3b82f6" strokeWidth=".4" opacity=".03"/>
          ))}
        </svg>

        {/* Ambient blobs */}
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 70%)", filter: "blur(40px)" }} />

        {/* Orbiting rings (desktop right) */}
        <div className="absolute right-[6%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] hidden xl:block pointer-events-none">
          <div className="anim-glow  absolute inset-0 rounded-full border border-blue-500/10"/>
          <div className="anim-glow2 absolute inset-[60px] rounded-full border border-cyan-400/10"/>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="anim-orbit1"><div className="hero-dot1"/></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="anim-orbit2"><div className="hero-dot2"/></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="anim-orbit3"><div className="hero-dot3"/></div>
          </div>
          {/* Center glow */}
          <div className="absolute inset-[140px] rounded-full" style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)" }}/>
        </div>

        {/* Floating nodes */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          <div className="anim-node  absolute top-[20%] left-[10%] w-2 h-2 rounded-full bg-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,.35)]"/>
          <div className="anim-node2 absolute top-[70%] left-[18%] w-1.5 h-1.5 rounded-full bg-blue-400/30 shadow-[0_0_10px_rgba(59,130,246,.3)]"/>
          <div className="anim-node3 absolute top-[35%] right-[35%] w-2.5 h-2.5 rounded-full bg-blue-300/20 shadow-[0_0_16px_rgba(147,197,253,.25)]"/>
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: .05 }}>
            <line x1="10%" y1="20%" x2="35%" y2="35%" stroke="#06b6d4" strokeWidth="1"/>
            <line x1="18%" y1="70%" x2="65%" y2="35%" stroke="#3b82f6" strokeWidth="1"/>
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 w-full">
          <div className="max-w-4xl mx-auto text-center">

            {/* Badge */}
            <div className="anim-fadein inline-flex items-center gap-2.5 hero-badge px-5 py-2 rounded-full text-sm font-medium text-blue-200 mb-10 cursor-default">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Workshop Canodrom</span>
              <span className="w-px h-3 bg-blue-400/30"/>
              <span className="text-blue-300/70 text-xs">Open Source</span>
            </div>

            {/* Headline */}
            <h1 className="anim-fadein2 mb-7 leading-[1.02] tracking-tight" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(3rem, 8vw, 6.5rem)", fontWeight: 700 }}>
              <span style={{ color: "rgba(255,255,255,0.92)" }}>Workshop</span>
              {" "}
              <span className="shimmer-text">Canodrom</span>
            </h1>

            {/* Sub */}
            <p className="anim-fadein3 max-w-2xl mx-auto mb-14 leading-relaxed" style={{ color: "rgba(148,163,184,0.9)", fontSize: "clamp(1.05rem, 2vw, 1.25rem)" }}>
              AI-assisted civic participation platform — transforming{" "}
              <span style={{ color: "#67e8f9", fontWeight: 500 }}>citizen input into actionable policy proposals</span>{" "}
              with full ethical oversight.
            </p>

            {/* CTAs */}
            <div className="anim-fadein4 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-primary text-white font-semibold text-base px-8 h-12 rounded-xl border-0" style={{ background: "linear-gradient(135deg,#2563eb,#0891b2)", boxShadow: "0 4px 24px rgba(37,99,235,.35),inset 0 1px 0 rgba(255,255,255,.1)" }}>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Explore Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="btn-ghost text-white font-semibold text-base px-8 h-12 rounded-xl" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.12)" }}>
                <a href="https://tally.so/r/9qpyWG" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-cyan-300" />
                  Submit Citizen Input
                  <Zap className="h-4 w-4 text-cyan-400" />
                </a>
              </Button>
            </div>

            {/* Social proof dots */}
            <div className="anim-fadein4 mt-16 flex items-center justify-center gap-8 text-xs tracking-widest uppercase" style={{ color: "rgba(100,116,139,0.7)" }}>
              {["Canodrom", "Open Source", "Participatory AI"].map((s, i) => (
                <span key={i} className="flex items-center gap-3">
                  {i !== 0 && <span className="w-1 h-1 rounded-full bg-slate-700"/>}
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Hero artwork */}
          <div className="anim-scalein mt-20 hidden lg:block max-w-2xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.1)" }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.05) 0%, transparent 60%, rgba(6,182,212,0.04) 100%)" }}/>
              <img src={heroArtworkUrl} alt="Civic Voice AI" className="w-full opacity-85 block rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 anim-float2 opacity-30 hidden md:block">
          <div className="w-5 h-8 rounded-full border border-slate-500 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-slate-400" style={{ animation: "float 1.5s ease-in-out infinite" }}/>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TICKER
      ════════════════════════════════════════ */}
      <div className="section-divider"/>
      <div className="overflow-hidden py-5 select-none" style={{ background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="marquee-track flex items-center gap-12">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-3 whitespace-nowrap text-sm font-medium tracking-widest uppercase" style={{ color: "rgba(100,116,139,0.6)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50"/>
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="section-divider"/>

      {/* ════════════════════════════════════════
          WHAT IT DOES — 3 feature cards
      ════════════════════════════════════════ */}
      <section className="relative py-32 px-6" style={{ background: "linear-gradient(180deg, #050a14 0%, #070e1e 100%)" }}>
        <div className="max-w-6xl mx-auto">

          {/* Section label */}
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-px" style={{ background: "linear-gradient(90deg,#3b82f6,transparent)" }}/>
            <span className="text-xs font-semibold tracking-widest uppercase text-blue-400">Platform Overview</span>
          </div>

          <h2 className="mb-6 tracking-tight" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, color: "rgba(255,255,255,0.92)", lineHeight: 1.1 }}>
            What this system does
          </h2>
          <p className="mb-16 max-w-2xl" style={{ color: "rgba(148,163,184,0.75)", fontSize: "1.1rem", lineHeight: 1.75 }}>
            A seven-stage AI pipeline that transforms raw citizen input into structured,
            accountable policy proposals — designed for democratic accountability.
          </p>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Main card — full width on mobile, 2 cols on md */}
            <a href="https://tally.so/r/9qpyWG" target="_blank" rel="noopener noreferrer"
               className="md:col-span-2 group card-premium gradient-border-card p-8 rounded-2xl block cursor-pointer">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.2),rgba(6,182,212,0.15))", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <Users className="h-6 w-6 text-emerald-400" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Citizen Participation</h3>
              <p style={{ color: "rgba(148,163,184,0.7)", lineHeight: 1.7 }}>
                Submit real citizen input through our Tally form. This triggers the full AI pipeline
                and generates proposals that appear in the dashboard — fully end-to-end.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
                Open Tally Form <ChevronRight className="h-4 w-4" />
              </div>
            </a>

            {/* Webhook card */}
            <Link to="/process" className="group card-premium gradient-border-card p-8 rounded-2xl block cursor-pointer">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.2),rgba(59,130,246,0.15))", border: "1px solid rgba(139,92,246,0.2)" }}>
                  <Webhook className="h-6 w-6 text-violet-400" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Webhook Integration</h3>
              <p style={{ color: "rgba(148,163,184,0.7)", lineHeight: 1.7 }}>
                Accepts webhook payloads from external forms or workshops. Configure your form
                to POST to the n8n endpoint.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-violet-400">
                View Process <ChevronRight className="h-4 w-4" />
              </div>
            </Link>

            {/* GitHub card */}
            <a href="https://github.com/espaifacto-code/civic-voice-ai" target="_blank" rel="noopener noreferrer"
               className="group card-premium gradient-border-card p-8 rounded-2xl block cursor-pointer">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,rgba(100,116,139,0.2),rgba(71,85,105,0.15))", border: "1px solid rgba(100,116,139,0.2)" }}>
                  <Globe className="h-6 w-6 text-slate-300" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>GitHub Repository</h3>
              <p style={{ color: "rgba(148,163,184,0.7)", lineHeight: 1.7 }}>
                Fully open-source under the civic AI initiative. Explore, fork, or contribute.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-300">
                View on GitHub <ChevronRight className="h-4 w-4" />
              </div>
            </a>

            {/* Dashboard card */}
            <Link to="/dashboard" className="md:col-span-2 group card-premium gradient-border-card p-8 rounded-2xl block cursor-pointer">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,rgba(59,130,246,0.2),rgba(6,182,212,0.15))", border: "1px solid rgba(59,130,246,0.2)" }}>
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Live Analytics Dashboard</h3>
              <p style={{ color: "rgba(148,163,184,0.7)", lineHeight: 1.7 }}>
                Real-time metrics and analytics from citizen participation — total submissions, approval rates,
                impact scores, ethical governance charts, and radar analytics across all civic proposals.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-400">
                Open Dashboard <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider"/>

      {/* ════════════════════════════════════════
          STATS ROW
      ════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: "linear-gradient(180deg,#070e1e 0%,#080f20 100%)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { num: "7",    label: "Pipeline Stages",      sub: "end-to-end AI" },
            { num: "100%", label: "Open Source",           sub: "MIT licensed" },
            { num: "RAG",  label: "Grounded Proposals",   sub: "real policy docs" },
            { num: "≤15s", label: "Data Refresh",          sub: "real-time sync" },
          ].map(({ num, label, sub }) => (
            <div key={label} className="text-center">
              <div className="stat-number mb-1">{num}</div>
              <div className="text-sm font-semibold text-white/70 mb-0.5">{label}</div>
              <div className="text-xs text-slate-500 tracking-wide">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider"/>

      {/* ════════════════════════════════════════
          ARCHITECTURE — numbered steps
      ════════════════════════════════════════ */}
      <section className="relative py-32 px-6 overflow-hidden" style={{ background: "linear-gradient(160deg,#060c1c 0%,#07101e 60%,#050a14 100%)" }}>

        {/* Ambient */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)", filter: "blur(60px)" }}/>

        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-px" style={{ background: "linear-gradient(90deg,#8b5cf6,transparent)" }}/>
            <span className="text-xs font-semibold tracking-widest uppercase text-violet-400">Architecture</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, color: "rgba(255,255,255,0.92)", lineHeight: 1.1 }}>
              End-to-end pipeline<br/>
              <span className="shimmer-text">built for democracy</span>
            </h2>
            <p className="max-w-xs md:text-right" style={{ color: "rgba(100,116,139,0.8)", fontSize: ".95rem", lineHeight: 1.7 }}>
              Seven stages of processing with ethical governance at every step.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ARCH_STEPS.map(({ num, icon: Icon, color, title, desc }, idx) => (
              <div key={num} className="card-premium rounded-2xl p-7 group relative overflow-hidden">
                {/* Step num background */}
                <div className="absolute top-3 right-4 text-6xl font-bold opacity-[0.04] select-none" style={{ fontFamily: "'Space Grotesk',sans-serif", color }}>
                  {num}
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: `${color}90` }}>{num}</div>
                <h3 className="text-sm font-semibold text-white mb-2 leading-snug" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(100,116,139,0.8)" }}>{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/process" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors">
              See full process diagram <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider"/>

      {/* ════════════════════════════════════════
          PRINCIPLES (Mozilla alignment)
      ════════════════════════════════════════ */}
      <section className="py-32 px-6" style={{ background: "linear-gradient(180deg,#050a14 0%,#060c1c 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-px" style={{ background: "linear-gradient(90deg,#06b6d4,transparent)" }}/>
            <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400">Principles</span>
          </div>

          <div className="mb-16">
            <h2 className="mb-4" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, color: "rgba(255,255,255,0.92)", lineHeight: 1.1 }}>
              Canodrom Workshop<br/>Principles
            </h2>
            <p style={{ color: "rgba(148,163,184,0.7)", fontSize: "1.05rem" }}>
              Built on participatory, accountable, transparent, and socially grounded AI — co-designed at Canodrom.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRINCIPLES.map(({ icon: Icon, title, desc, accent }) => (
              <div key={title} className="card-premium rounded-2xl p-8 group text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110" style={{ background: `${accent}18`, border: `1px solid ${accent}28` }}>
                  <Icon className="h-7 w-7" style={{ color: accent }} />
                </div>
                <h3 className="font-semibold text-white mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{title}</h3>
                <p className="text-sm" style={{ color: "rgba(100,116,139,0.8)", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider"/>

      {/* ════════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════════ */}
      <section className="py-32 px-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#060d1e 0%,#071428 50%,#08152e 100%)" }}>
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div style={{ width: "700px", height: "400px", background: "radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 70%)", filter: "blur(40px)" }}/>
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 hero-badge px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase text-blue-300 mb-8">
            <CheckCircle className="h-3.5 w-3.5" />
            Ready to explore
          </div>
          <h2 className="mb-6" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, color: "rgba(255,255,255,0.92)", lineHeight: 1.1 }}>
            Shape the future of<br/>
            <span className="shimmer-text">civic participation</span>
          </h2>
          <p className="mb-12 mx-auto" style={{ color: "rgba(148,163,184,0.7)", fontSize: "1.1rem", lineHeight: 1.75, maxWidth: "500px" }}>
            Join the Canodrom workshop. Your voice, your community, your proposals — powered by transparent AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-semibold text-base px-8 h-12 rounded-xl border-0 text-white" style={{ background: "linear-gradient(135deg,#2563eb,#0891b2)", boxShadow: "0 4px 24px rgba(37,99,235,.35)" }}>
              <Link to="/dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                View Live Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-semibold text-base px-8 h-12 rounded-xl text-white" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.12)" }}>
              <Link to="/transparency" className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-cyan-400" />
                Read AI Transparency Report
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer className="py-12 px-6" style={{ background: "#030710", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: "linear-gradient(135deg,#2563eb,#0891b2)" }}>
              CA
            </div>
            <span className="font-semibold text-white/70" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Civic Voice AI</span>
          </div>
          <p className="text-sm text-center" style={{ color: "rgba(100,116,139,0.6)" }}>
            Workshop Canodrom · Open-source civic participation infrastructure
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by AI for Democracy
          </div>
        </div>
      </footer>
    </div>
  );
}
