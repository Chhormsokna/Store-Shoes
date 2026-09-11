/**
 * Tiny inline icon set (stroke based, 24x24 grid) so we ship no icon library.
 * Every icon forwards className and inherits currentColor.
 */

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
};

const Svg = ({ children, className = "w-5 h-5", ...rest }) => (
  <svg {...base} className={className} aria-hidden="true" {...rest}>
    {children}
  </svg>
);

export const Search = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);

export const Heart = ({ filled, className, ...p }) => (
  <svg
    {...base}
    className={className}
    fill={filled ? "currentColor" : "none"}
    aria-hidden="true"
    {...p}
  >
    <path d="M12 20s-7.5-4.6-7.5-9.5A4.5 4.5 0 0 1 12 7.4a4.5 4.5 0 0 1 7.5 3.1C19.5 15.4 12 20 12 20z" />
  </svg>
);

export const Bag = (p) => (
  <Svg {...p}>
    <path d="M5.5 8h13l1 12h-15l1-12Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </Svg>
);

export const User = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.8 20c.8-3.6 3.8-5.6 7.2-5.6S18.4 16.4 19.2 20" />
  </Svg>
);

export const Menu = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const X = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const Star = ({ half, className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    {half ? (
      <>
        <defs>
          <linearGradient id="halfstar">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="m12 3 2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3z"
          fill="url(#halfstar)"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </>
    ) : (
      <path
        d="m12 3 2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3z"
        fill="currentColor"
      />
    )}
  </svg>
);

export const Chevron = ({ className = "w-4 h-4", direction = "down" }) => {
  const rot = { down: 0, up: 180, left: 90, right: -90 }[direction];
  return (
    <svg
      {...base}
      className={className}
      style={{ transform: `rotate(${rot}deg)` }}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
};

export const ArrowRight = (p) => (
  <Svg {...p}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </Svg>
);

export const Plus = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const Minus = (p) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
);

export const Trash = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
    <path d="M10 11v6M14 11v6" />
  </Svg>
);

export const Truck = (p) => (
  <Svg {...p}>
    <path d="M3 7h11v9H3zM14 11h4l3 3v2h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </Svg>
);

export const Shield = (p) => (
  <Svg {...p}>
    <path d="M12 3.5 19 6v6c0 4-3 7-7 8.5C8 19 5 16 5 12V6l7-2.5Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);

export const Repeat = (p) => (
  <Svg {...p}>
    <path d="M4 9a6 6 0 0 1 6-6h6l-2.5-2.5M20 15a6 6 0 0 1-6 6H8l2.5 2.5" />
    <path d="M16 3h4v4M8 21H4v-4" />
  </Svg>
);

export const Check = (p) => (
  <Svg {...p}>
    <path d="m5 13 4 4L19 7" />
  </Svg>
);

export const Filter = (p) => (
  <Svg {...p}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </Svg>
);

export const Sparkle = (p) => (
  <Svg {...p}>
    <path d="M12 4v5M12 15v5M4.5 12h5M14.5 12h5" />
    <path d="m7 7 2.5 2.5M14.5 14.5 17 17M17 7l-2.5 2.5M9.5 14.5 7 17" />
  </Svg>
);

export const Ruler = (p) => (
  <Svg {...p}>
    <path d="M3 15 15 3l6 6L9 21l-6-6Z" />
    <path d="m7 11 2 2M10 8l2 2M13 5l2 2" />
  </Svg>
);

export const Lock = (p) => (
  <Svg {...p}>
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" />
  </Svg>
);

export const Mail = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Svg>
);

export const Eye = (p) => (
  <Svg {...p}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);

export const EyeOff = (p) => (
  <Svg {...p}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </Svg>
);

export const Google = ({ className = "w-5 h-5", ...p }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...p}>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const Apple = ({ className = "w-5 h-5", ...p }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" {...p}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.66c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.61.71-1.14 1.86-1 2.97 1.07.08 2.15-.57 2.81-1.37z" />
  </svg>
);

export const Social = {
  Instagram: (p) => (
    <Svg {...p}>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="16.8" cy="7.2" r="0.9" fill="currentColor" />
    </Svg>
  ),
  Twitter: (p) => (
    <Svg {...p}>
      <path d="M4 4h3.6l11 16H15L4 4Z" />
      <path d="M20 4 12.8 12.6M9.6 20 7 16.6" />
    </Svg>
  ),
  Youtube: (p) => (
    <Svg {...p}>
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="m11 9.5 4 2.5-4 2.5v-5Z" />
    </Svg>
  ),
};

