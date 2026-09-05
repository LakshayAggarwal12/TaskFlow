import { Link, useLocation } from "react-router-dom";
import SignalDot from "../ui/SignalDot";
import Button from "../ui/Button";

export default function PublicNav() {
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
<header className="sticky top-0 z-30 border-b border-hairline/80 bg-canvas/80 backdrop-blur-xl transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent to-indigo-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-accent/20 group-hover:scale-105 transition-transform duration-fast">
            T
          </div>
          <span className="text-h3 font-display font-bold tracking-tight text-white group-hover:text-accent transition-colors duration-fast">
            TaskFlow
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {!isAuthPage && (
            <Link
              to="/login"
              className="hidden sm:inline-flex text-body-sm font-medium text-slate-300 hover:text-white transition-colors duration-fast px-3.5 py-2 rounded-lg hover:bg-surface2/60"
            >
              Log in
            </Link>
          )}
          {pathname !== "/register" && (
            <Link to="/register">
              <Button size="sm" className="shadow-accent/25">Get started</Button>
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
