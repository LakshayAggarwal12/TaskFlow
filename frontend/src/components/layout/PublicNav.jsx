import { Link, useLocation } from "react-router-dom";
import SignalDot from "../ui/SignalDot";
import Button from "../ui/Button";

export default function PublicNav() {
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-canvas/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="w-7 h-7 rounded-md bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center text-canvas text-caption font-bold">
            T
          </span>
          <span className="text-h3 font-display text-primary group-hover:text-accent transition-colors duration-fast">
            TaskFlow
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {!isAuthPage && (
            <Link
              to="/login"
              className="hidden sm:inline-flex text-body-sm text-secondary hover:text-primary transition-colors duration-fast px-3 py-2"
            >
              Log in
            </Link>
          )}
          {pathname !== "/register" && (
            <Link to="/register">
              <Button size="sm">Get started</Button>
            </Link>
          )}
          {pathname === "/register" && (
            <Link to="/login">
              <Button size="sm" variant="secondary">
                Log in
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
