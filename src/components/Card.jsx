import { useState } from "react";
import { T } from "../utils/theme";

export default function Card({ children, style: sx = {}, hover, onClick }) {
  const [h, setH] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => hover && setH(false)}
      style={{
        background: T.surface,
        borderRadius: 14,
        border: `1px solid ${T.border}`,
        transition: "box-shadow .2s, transform .2s",
        boxShadow: h ? "0 6px 28px rgba(0,0,0,.08)" : "0 1px 2px rgba(0,0,0,.04)",
        transform: h ? "translateY(-2px)" : "none",
        ...sx
      }}
    >
      {children}
    </div>
  );
}