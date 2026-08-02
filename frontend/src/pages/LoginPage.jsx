import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LoginForm from "../features/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <h1 className="text-h1 font-display text-primary mb-1">Welcome back</h1>
          <p className="text-body-sm text-secondary">Log in to keep things moving.</p>
        </div>
        <LoginForm />
        <p className="text-body-sm text-secondary text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent hover:text-accent-hover transition-colors duration-fast">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
