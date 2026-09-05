import { Outlet } from "react-router-dom";
import PublicNav from "../components/layout/PublicNav";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <PublicNav />
      <Outlet />
      <footer className="border-t border-hairline mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-body-sm text-tertiary">
          <span>© {new Date().getFullYear()} TaskFlow</span>
          <div className="flex items-center gap-4">
            <a href="/login" className="hover:text-secondary transition-colors duration-fast">
              Log in
            </a>
            <a href="/register" className="hover:text-secondary transition-colors duration-fast">
              Create account
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
