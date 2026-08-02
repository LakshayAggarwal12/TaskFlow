import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import RegisterForm from "../features/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <h1 className="text-h1 font-display text-primary mb-1">Create your account</h1>
          <p className="text-body-sm text-secondary">Start organizing work in minutes.</p>
        </div>
        <RegisterForm />
        <p className="text-body-sm text-secondary text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-accent hover:text-accent-hover transition-colors duration-fast">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
