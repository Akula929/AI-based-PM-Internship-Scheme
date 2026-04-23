import { T } from "../utils/theme";

export default function Pill({ children, color = T.sage, bg = T.sageSoft }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: bg,
        color: color,
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: 0.5,
        padding: "3px 9px",
        borderRadius: 100,
        textTransform: "uppercase"
      }}
    >
      {children}
    </span>
  );
}