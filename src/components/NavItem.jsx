import { T } from "../utils/theme";

export default function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        width: "100%",
        padding: "9px 11px",
        borderRadius: 8,
        border: "none",
        cursor: "none",
        background: active ? T.sageSoft : "transparent",
        color: active ? T.sage : T.inkMid,
        fontFamily: "inherit",
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        textAlign: "left",
        transition: "all .15s"
      }}
      onMouseEnter={e => {
        if (!active) e.currentTarget.style.background = T.bgDeep;
      }}
      onMouseLeave={e => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      <span style={{ fontSize: 14, opacity: 0.85 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span
          style={{
            background: T.sage,
            color: "#fff",
            fontSize: 9.5,
            fontWeight: 700,
            borderRadius: 100,
            padding: "1px 6px"
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}