import { useEffect, useRef } from "react";

export default function Fade({ children, delay = 0 }) {
  const r = useRef(null);

  useEffect(() => {
    const el = r.current;
    if (!el) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(14px)";
    el.style.transition = `opacity .55s ease ${delay}s, transform .55s ease ${delay}s`;

    const t = setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 20);

    return () => clearTimeout(t);
  }, [delay]);

  return <div ref={r}>{children}</div>;
}