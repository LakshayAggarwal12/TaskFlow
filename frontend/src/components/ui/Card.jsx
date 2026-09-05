export default function Card({
  children,
  className = "",
  padding = true,
  header,
  footer,
  hoverable = false,
  as: Component = "div",
  ...props
}) {
  return (
    <Component
      className={`bg-surface1/80 backdrop-blur-sm border border-hairline rounded-xl shadow-card transition-all duration-fast ${
        hoverable ? "hover:border-accent/30 hover:shadow-card-hover hover:bg-surface1" : ""
      } ${padding ? "p-5" : ""} ${className}`}
      {...props}
    >
      {header && (
        <div
          className={`${
            padding
              ? "-mx-5 -mt-5 mb-5 px-5 py-3.5 border-b border-hairline bg-surface2/30 rounded-t-xl"
              : "mb-4 pb-3.5 border-b border-hairline"
          }`}
        >
          {header}
        </div>
      )}
      {children}
      {footer && (
        <div
          className={`${
            padding
              ? "-mx-5 -mb-5 mt-5 px-5 py-3.5 border-t border-hairline bg-surface2/20 rounded-b-xl"
              : "mt-4 pt-3.5 border-t border-hairline"
          }`}
        >
          {footer}
        </div>
      )}
    </Component>
  );
}
