import { T } from "../utils/theme";

export default function Btn({ children, onClick, variant = "primary", small, style: sx = {} }) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    cursor: "none",
    border: "none",
    fontFamily: "inherit",
    fontWeight: 600,
    padding: small ? "8px 16px" : "12px 22px",
    fontSize: small ? 12.5 : 13.5,
    borderRadius: 9,
    transition: "all .18s ease",
    ...sx
  };

  const v = {
    primary: { background: T.ink, color: "#fff" },
    sage: { background: T.sage, color: "#fff" },
    ghost: {
      background: "transparent",
      color: T.inkMid,
      border: `1px solid ${T.border}`,
      padding: small ? "7px 15px" : "11px 21px"
    },
    outline: {
      background: "transparent",
      color: T.sage,
      border: `1px solid ${T.sage}`,
      padding: small ? "7px 15px" : "11px 21px"
    }
  };

  return (
    <button
      onClick={onClick}
      style={{ ...base, ...v[variant] }}
      onMouseEnter={e => {
        e.currentTarget.style.opacity = ".82";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.opacity = "1";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {children}
    </button>
  );
}