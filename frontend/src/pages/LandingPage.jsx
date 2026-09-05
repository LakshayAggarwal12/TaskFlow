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
    <div className="relative w-full max-w-md mx-auto lg:mx-0">
      <div className="absolute -inset-4 bg-accent/5 rounded-xl blur-2xl pointer-events-none" />
      <Card padding={false} className="overflow-hidden shadow-elevate">
        <div className="flex border-b border-hairline">
          <div className="w-12 sm:w-14 shrink-0 bg-surface0 border-r border-hairline py-4 flex flex-col items-center gap-3">
            <span className="w-6 h-6 rounded-sm bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-canvas text-[10px] font-bold">
              T
            </span>
            <div className="w-5 h-5 rounded bg-accent-muted" />
            <div className="w-5 h-5 rounded bg-surface3" />
            <div className="w-5 h-5 rounded bg-surface3" />
          </div>
          <div className="flex-1 p-4 sm:p-5 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <SignalDot variant="static" size={6} />
              <span className="text-caption text-secondary uppercase tracking-wide">Dashboard</span>
            </div>
            <div className="space-y-2.5">
              {["Platform rebuild", "Mobile app v2", "API migration"].map((name, i) => (
                <div
                  key={name}
                  className={`flex items-center gap-3 p-3 rounded-md border border-hairline ${
                    i === 0 ? "bg-surface2" : "bg-surface1"
                  }`}
                >
                  <div className="w-7 h-7 rounded-md bg-surface3 flex items-center justify-center shrink-0">
                    <FolderKanban size={12} className="text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm text-primary truncate">{name}</p>
                    <p className="text-caption text-tertiary">3 boards · active sprint</p>
                  </div>
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
    <div className="flex-1">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div {...fadeUp}>
            <div className="flex items-center gap-2 mb-5">
              <SignalDot variant="ring" size={8} />
              <span className="text-caption text-secondary uppercase tracking-wide">
                AI-assisted project management
              </span>
            </div>
            <h1 className="text-display-xl font-display text-primary mb-4 text-left">
              Work that moves,<br />without the noise.
            </h1>
            <p className="text-body text-secondary mb-8 max-w-md">
              Boards, sprints, and an AI layer that stays out of your way until you need it —
              nothing writes to your project without your review.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Get started <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Log in
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0, 0, 0.2, 1] }}
          >
            <ProductPreview />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-hairline bg-surface0/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.3 }}
            className="mb-10 sm:mb-12"
          >
            <h2 className="text-h1 font-display text-primary mb-2">
              Everything your team needs to ship
            </h2>
            <p className="text-body text-secondary max-w-lg">
              TaskFlow covers the full project lifecycle — from backlog to sprint — in one focused workspace.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.28, delay: i * 0.05 }}
              >
                <Card className="h-full hover:border-strong transition-colors duration-fast">
                  <div className="w-9 h-9 rounded-md bg-surface2 border border-hairline flex items-center justify-center mb-4">
                    <feature.icon size={16} className="text-accent" />
                  </div>
                  <h3 className="text-h3 text-primary mb-1.5">{feature.title}</h3>
                  <p className="text-body-sm text-secondary">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-hairline">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-h1 font-display text-primary mb-3">Ready to get organized?</h2>
            <p className="text-body text-secondary mb-8 max-w-md mx-auto">
              Create a free account and set up your first workspace in minutes.
            </p>
            <Link to="/register">
              <Button size="lg">
                Create your account <ArrowRight size={16} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
