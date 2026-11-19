export default function Icon({ name, size = 20 }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  if (name === "search") {
    return (
      <svg {...props}>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16l5 5" />
      </svg>
    );
  }
  if (name === "user") {
    return (
      <svg {...props}>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 19.2c1.4-3 3.8-4.4 7-4.4s5.6 1.4 7 4.4" />
      </svg>
    );
  }
  if (name === "heart") {
    return (
      <svg {...props}>
        <path d="M12 19s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" />
      </svg>
    );
  }
  if (name === "bag") {
    return (
      <svg {...props}>
        <path d="M6.5 8h11l-.8 11h-9.4L6.5 8z" />
        <path d="M9 8V6.8A3 3 0 0 1 12 4a3 3 0 0 1 3 2.8V8" />
      </svg>
    );
  }
  if (name === "menu") {
    return (
      <svg {...props}>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    );
  }
  if (name === "close") {
    return (
      <svg {...props}>
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    );
  }
  if (name === "plus") {
    return (
      <svg {...props}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }
  if (name === "minus") {
    return (
      <svg {...props}>
        <path d="M5 12h14" />
      </svg>
    );
  }
  if (name === "star") {
    return (
      <svg {...props}>
        <path d="M12 3.5l2.4 5 5.6.7-4.1 3.8 1.1 5.5L12 16.8 7 18.5l1.1-5.5L4 9.2l5.6-.7L12 3.5z" />
      </svg>
    );
  }
  return null;
}

export function SocialIcon({ name }) {
  const props = { width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" };
  if (name === "facebook") {
    return <svg {...props}><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1z" /></svg>;
  }
  if (name === "instagram") {
    return (
      <svg {...props}>
        <path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm8 2H8a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3zm-4 3.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 2A1.8 1.8 0 1 0 13.8 12 1.8 1.8 0 0 0 12 10.2zM17.4 6.4a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
      </svg>
    );
  }
  if (name === "x") {
    return <svg {...props}><path d="M14.5 4h3.2l-7 8 8.3 8h-5.2l-4.2-5.1L6.2 20H3l7.5-8.6L2.7 4h5.3l3.8 4.7L14.5 4zm-1.1 14.4h1.8L7.7 5.5H5.8l7.6 12.9z" /></svg>;
  }
  return (
    <svg {...props}>
      <path d="M23 12.2a10.7 10.7 0 0 1-10.8 10.6A10.7 10.7 0 0 1 1.2 12.2 10.7 10.7 0 0 1 12.2 1.6 10.7 10.7 0 0 1 23 12.2zM10 8.2v8l6.4-4z" />
    </svg>
  );
}

export function Mark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 50c-9-7-16-14-16-23a9 9 0 0 1 16-5 9 9 0 0 1 16 5c0 9-7 16-16 23z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="32" cy="27" r="3" fill="currentColor" />
    </svg>
  );
}
