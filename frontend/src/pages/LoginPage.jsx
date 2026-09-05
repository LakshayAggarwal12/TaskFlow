import { Link } from "react-router-dom";
import LoginForm from "../features/auth/LoginForm";
import AuthShell from "../components/layout/AuthShell";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to keep things moving."
      footer={
        <p className="text-body-sm text-secondary text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-accent hover:text-accent-hover transition-colors duration-fast">
            Create one
          </Link>
        </p>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
