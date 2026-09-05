import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FolderKanban,
  KanbanSquare,
  ListTodo,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import SignalDot from "../components/ui/SignalDot";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const FEATURES = [
  {
    icon: Users,
    title: "Workspaces & projects",
    description: "Organize work by team. Create projects and keep everything scoped to the right context.",
  },
  {
    icon: KanbanSquare,
    title: "Kanban boards",
    description: "Visualize tasks on drag-and-drop boards with lists tailored to your workflow.",
  },
  {
    icon: ListTodo,
    title: "Sprints & backlog",
    description: "Plan iterations, manage your backlog, and track sprint progress with burndown charts.",
  },
  {
    icon: Sparkles,
    title: "AI assist",
    description: "Search and summarize with AI that never writes to your project without your review.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.36, ease: [0, 0, 0.2, 1] },
};

function ProductPreview() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:mx-0">
      <div className="absolute -inset-4 bg-gradient-to-tr from-accent/20 to-indigo-500/10 rounded-2xl blur-3xl pointer-events-none" />
      <Card padding={false} className="relative overflow-hidden shadow-2xl border-hairlineBright bg-surface1/90 backdrop-blur-xl">
        <div className="flex border-b border-hairline">
          <div className="w-14 shrink-0 bg-surface0/80 border-r border-hairline py-5 flex flex-col items-center gap-4">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-accent to-indigo-500 flex items-center justify-center text-slate-950 text-xs font-black shadow-md shadow-accent/25">
              T
            </span>
            <div className="w-5 h-5 rounded-md bg-accent/20 border border-accent/40" />
            <div className="w-5 h-5 rounded-md bg-surface3/60" />
            <div className="w-5 h-5 rounded-md bg-surface3/60" />
          </div>
          <div className="flex-1 p-5 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-5">
              <div className="flex items-center gap-2">
                <SignalDot variant="ring" size={7} />
                <span className="text-caption font-mono font-semibold text-slate-300 uppercase tracking-widest">Active Workspace</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-accent/10 text-accent font-semibold border border-accent/20">Live Sync</span>
            </div>
            <div className="space-y-3">
              {[
                { name: "Platform rebuild v2", badge: "In Progress", count: "8 tasks" },
                { name: "Mobile responsive UI", badge: "Design Review", count: "5 tasks" },
                { name: "Core API migration", badge: "Completed", count: "12 tasks" },
              ].map((item, i) => (
                <div
                  key={item.name}
                  className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                    i === 0
                      ? "bg-surface2/90 border-accent/30 shadow-md shadow-accent/5"
                      : "bg-surface2/40 border-hairline hover:border-hairlineBright"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-surface3/80 flex items-center justify-center shrink-0 border border-hairline">
                      <FolderKanban size={15} className="text-accent" />
                    </div>
                    <div className="truncate">
                      <p className="text-body-sm font-semibold text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{item.count} · active sprint</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium font-mono px-2 py-0.5 rounded-md bg-surface3 text-slate-300 border border-hairline whitespace-nowrap">
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/workspaces" replace />;
  }

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-accent/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-72 right-10 w-[400px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-caption font-medium mb-6 shadow-sm">
              <Sparkles size={13} className="text-accent" />
              <span>Next-Gen Engineering & Task Management</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-display font-extrabold tracking-tight text-white leading-[1.12] mb-5">
              Work that moves, <br />
              <span className="bg-gradient-to-r from-accent via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                without the friction.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-normal mb-9 max-w-lg leading-relaxed">
              High-performance Kanban boards, velocity sprints, real-time workload analytics, and an integrated AI layer engineered for modern development teams.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto font-semibold shadow-lg shadow-accent/25">
                  Get started free <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto font-medium">
                  Sign in to workspace
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProductPreview />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-hairline bg-surface0/50 backdrop-blur-xs relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35 }}
            className="mb-12 sm:mb-16 text-center sm:text-left"
          >
            <span className="text-caption font-mono uppercase tracking-widest text-accent font-semibold mb-2 block">
              Core Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white mb-3">
              Precision tools built for high-velocity teams
            </h2>
            <p className="text-body sm:text-base text-slate-400 max-w-xl">
              TaskFlow merges tactical execution with strategic visibility across your whole project lifecycle.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <Card hoverable className="h-full bg-surface1/60 p-6 flex flex-col justify-start">
                  <div className="w-11 h-11 rounded-xl bg-surface2/90 border border-hairlineBright flex items-center justify-center mb-4 shadow-sm">
                    <feature.icon size={20} className="text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-body-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-hairline relative py-20 sm:py-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Accelerate your team's workflow today
            </h2>
            <p className="text-base text-slate-400 mb-8 max-w-md mx-auto">
              Create a workspace in seconds and experience clarity without cumbersome overhead.
            </p>
            <Link to="/register">
              <Button size="lg" className="px-8 font-semibold shadow-xl shadow-accent/25">
                Launch your workspace <ArrowRight size={16} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
