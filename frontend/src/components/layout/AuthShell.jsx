import SignalDot from "../ui/SignalDot";

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-0">
      {/* Brand panel — desktop side column, mobile compact strip */}
      <div className="lg:w-[42%] xl:w-[40%] shrink-0 flex flex-col justify-center px-6 py-8 sm:px-10 lg:px-12 lg:py-16 border-b lg:border-b-0 lg:border-r border-hairline bg-surface0/50">
        <div className="max-w-sm mx-auto lg:mx-0 w-full">
          <div className="flex items-center gap-2 mb-6 lg:mb-8">
            <SignalDot variant="ring" size={8} />
            <span className="text-caption text-secondary uppercase tracking-wide">TaskFlow</span>
          </div>
          <h2 className="text-h1 font-display text-primary mb-3 hidden lg:block">
            Work that moves,<br />without the noise.
          </h2>
          <p className="text-body text-secondary hidden lg:block max-w-xs">
            Organize projects, boards, and sprints in one workspace — with AI that stays out of your way until you need it.
          </p>
          <p className="text-body-sm text-secondary lg:hidden">
            Project management for teams that ship.
          </p>
        </div>
      </div>

      {/* Form area */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-h1 font-display text-primary mb-1">{title}</h1>
            {subtitle && <p className="text-body-sm text-secondary">{subtitle}</p>}
          </div>
          <div className="bg-surface1 border border-hairline rounded-lg p-6 sm:p-7 shadow-elevate">
            {children}
          </div>
          {footer}
        </div>
      </div>
    </div>
  );
}
