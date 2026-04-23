import { useState } from "react";
import { T } from "../utils/theme";

export default function Field({ label, type = "text", value, onChange, placeholder, required }) {
  const [f, setF] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && (
        <label
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: T.inkMid,
            letterSpacing: 0.3
          }}
        >
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        onFocus={() => setF(true)}
        onBlur={() => setF(false)}
        style={{
          background: f ? T.surface : T.bgDeep,
          border: `1.5px solid ${f ? T.sage : T.border}`,
          borderRadius: 9,
          padding: "10px 13px",
          fontSize: 13.5,
          color: T.ink,
          fontFamily: "inherit",
          outline: "none",
          width: "100%",
          transition: "all .2s"
        }}
      />
    </div>
  );
}