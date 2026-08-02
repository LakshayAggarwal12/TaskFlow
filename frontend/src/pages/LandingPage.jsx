import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import SignalDot from "../components/ui/SignalDot";
import Button from "../components/ui/Button";

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/workspaces" replace />;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, ease: [0, 0, 0.2, 1] }}
        className="max-w-lg"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <SignalDot variant="ring" size={8} />
          <span className="text-caption text-secondary uppercase tracking-wide">
            AI-assisted project management
          </span>
        </div>
        <h1 className="text-display-xl font-display text-primary mb-4">
          Work that moves,<br />without the noise.
        </h1>
        <p className="text-body text-secondary mb-8 max-w-md mx-auto">
          Boards, sprints, and an AI layer that stays out of your way until you need it —
          nothing writes to your project without your review.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/register">
            <Button size="lg">
              Get started <ArrowRight size={16} />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="secondary">
              Log in
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
