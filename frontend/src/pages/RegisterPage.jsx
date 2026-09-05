import { Link } from "react-router-dom";
import RegisterForm from "../features/auth/RegisterForm";
import AuthShell from "../components/layout/AuthShell";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start organizing work in minutes."
      footer={
        <p className="text-body-sm text-secondary text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-accent hover:text-accent-hover transition-colors duration-fast">
            Log in
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
