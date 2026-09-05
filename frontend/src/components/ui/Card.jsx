export default function Card({
  children,
  className = "",
  padding = true,
  header,
  footer,
  as: Component = "div",
  ...props
}) {
  return (
    <Component
      className={`bg-surface1 border border-hairline rounded-lg ${padding ? "p-5" : ""} ${className}`}
      {...props}
    >
      {header && (
        <div className={`${padding ? "-mx-5 -mt-5 mb-5 px-5 py-4 border-b border-hairline" : "mb-4 pb-4 border-b border-hairline"}`}>
          {header}
        </div>
      )}
      {children}
      {footer && (
        <div className={`${padding ? "-mx-5 -mb-5 mt-5 px-5 py-4 border-t border-hairline" : "mt-4 pt-4 border-t border-hairline"}`}>
          {footer}
        </div>
      )}
    </Component>
  );
}
