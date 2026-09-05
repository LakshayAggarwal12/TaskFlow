import SignalDot from "../ui/SignalDot";

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-0">
      {/* Brand panel — desktop side column, mobile compact strip */}
      <div className="lg:w-[45%] xl:w-[42%] shrink-0 flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16 lg:py-20 border-b lg:border-b-0 lg:border-r border-hairline bg-surface0/70 backdrop-blur-lg relative overflow-hidden">
        {/* Glow orb */}
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-sm mx-auto lg:mx-0 w-full relative z-10">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent to-indigo-500 flex items-center justify-center text-slate-950 text-xs font-black shadow-md shadow-accent/20">
              T
            </div>
            <span className="text-h3 font-bold font-display text-white">TaskFlow</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4 leading-tight hidden lg:block">
            Architected for velocity. <br />
            <span className="bg-gradient-to-r from-accent to-indigo-400 bg-clip-text text-transparent">Engineered for focus.</span>
          </h2>
          <p className="text-body text-slate-400 hidden lg:block max-w-xs leading-relaxed">
            Consolidate your backlogs, sprints, and task workflows with a distraction-free experience.
          </p>
          <p className="text-body-sm text-slate-400 lg:hidden font-medium">
            Next-generation task management for modern engineering.
          </p>
        </div>
      </div>

      {/* Form area */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-12 relative">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">{title}</h1>
            {subtitle && <p className="text-body-sm text-slate-400">{subtitle}</p>}
          </div>
          <div className="bg-surface1/90 border border-hairlineBright rounded-2xl p-6 sm:p-8 shadow-modal backdrop-blur-xl">
            {children}
          </div>
          <div className="mt-6 text-center text-body-sm text-slate-400">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
