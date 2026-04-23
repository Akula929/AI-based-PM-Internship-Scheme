import { useEffect, useRef } from "react";
import { T } from "../utils/theme";

export default function Cursor() {
  const dot = useRef(null), ring = useRef(null), pos = useRef({x:0,y:0}), lp = useRef({x:0,y:0});

  useEffect(() => {
    const m = e => { pos.current = {x:e.clientX,y:e.clientY}; };
    window.addEventListener("mousemove", m);

    let raf;
    const loop = () => {
      lp.current.x += (pos.current.x - lp.current.x) * .12;
      lp.current.y += (pos.current.y - lp.current.y) * .12;

      if(dot.current)
        dot.current.style.transform = `translate(${pos.current.x-4}px,${pos.current.y-4}px)`;

      if(ring.current)
        ring.current.style.transform = `translate(${lp.current.x-18}px,${lp.current.y-18}px)`;

      raf = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("mousemove", m);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        style={{
          position:"fixed",
          top:0,
          left:0,
          width:8,
          height:8,
          borderRadius:"50%",
          background:T.sage,
          zIndex:9999,
          pointerEvents:"none"
        }}
      />
      <div
        ref={ring}
        style={{
          position:"fixed",
          top:0,
          left:0,
          width:36,
          height:36,
          borderRadius:"50%",
          border:`1.5px solid ${T.sage}`,
          zIndex:9998,
          pointerEvents:"none",
          opacity:.45
        }}
      />
    </>
  );
}