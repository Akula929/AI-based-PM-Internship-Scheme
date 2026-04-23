/* ─── LOGIN ─── */
import { useState } from "react";
import { T } from "../utils/theme";
import Cursor from "../components/Cursor";
import Fade from "../components/Fade";
import Pill from "../components/Pill";
import Field from "../components/Field";

export default function LoginPage({ onLogin }) {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [mode, setMode] = useState("signin");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 NEW BACKEND CONNECTED SUBMIT FUNCTION
  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const url = mode === "signup"
        ? "http://localhost:5000/register"
        : "http://localhost:5000/login";

      const body = mode === "signup"
        ? { name, email, password: pw, role }
        : { email, password: pw };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      setLoading(false);

      if (mode === "signup") {
        setMode("signin");
        setErr("Account created! Please sign in.");
      } else {
        onLogin(data.user);
      }

    } catch (error) {
      setErr("Server error. Try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", fontFamily: "'DM Sans',sans-serif", cursor: "none" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&display=swap');
        *{box-sizing:border-box;cursor:none!important;}
        ::selection{background:${T.sageSoft};color:${T.sage};}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.7)}}
      `}</style>
      <Cursor />

      {/* Left */}
      <div style={{ flex: 1, padding: "56px 64px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: `1px solid ${T.border}` }}>
        <Fade delay={0}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 30, height: 30, background: T.ink, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 13L8 3L13 13M5.5 9H10.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: T.ink, letterSpacing: "-.3px" }}>LaunchPad</span>
          </div>
        </Fade>

        <div>
          <Fade delay={.1}>
            <Pill color={T.sage} bg={T.sageSoft}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.sage, display: "inline-block", animation: "pulseDot 2s ease infinite" }} />
              AI-Powered Career Platform
            </Pill>
          </Fade>
          <Fade delay={.2}>
            <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 50, fontWeight: 400, color: T.ink, lineHeight: 1.1, margin: "18px 0 0", letterSpacing: "-.6px" }}>
              Your next<br />chapter starts<br /><em style={{ color: T.sage }}>here.</em>
            </h1>
          </Fade>
          <Fade delay={.32}>
            <p style={{ color: T.inkMid, fontSize: 15.5, lineHeight: 1.7, margin: "18px 0 36px", maxWidth: 380 }}>
              AI-matched internships, resume scoring, career roadmaps, and live job scraping — built for ambitious PM candidates.
            </p>
          </Fade>
          <Fade delay={.42}>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {[["◈", "Resume scored & improved by AI in seconds"], ["◉", "Smart job matching from 50+ live sources"], ["◌", "PM & Full Stack career roadmaps"], ["◎", "One-click apply with eligibility check"]].map(([ic, t], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <span style={{ color: T.sage, fontSize: 15 }}>{ic}</span>
                  <span style={{ color: T.inkMid, fontSize: 13.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </Fade>
        </div>

        <Fade delay={.55}>
          <div>
            <p style={{ color: T.inkLight, fontSize: 11, fontWeight: 700, letterSpacing: .7, textTransform: "uppercase", marginBottom: 14 }}>Trusted by students at</p>
            <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
              {["IIT Delhi", "BITS Pilani", "NSIT", "VIT", "DTU", "Manipal"].map(s => <span key={s} style={{ color: T.inkLight, fontSize: 12.5, fontWeight: 500 }}>{s}</span>)}
            </div>
          </div>
        </Fade>
      </div>

      {/* Right */}
      <div style={{ width: 460, display: "flex", alignItems: "center", justifyContent: "center", padding: "56px 56px" }}>
        <Fade delay={.15}>
          <div style={{ width: "100%" }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 26, fontWeight: 400, color: T.ink, margin: "0 0 5px", letterSpacing: "-.3px" }}>
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h2>
              <p style={{ color: T.inkLight, fontSize: 13.5, margin: 0 }}>
                {mode === "signin" ? "Sign in to continue to LaunchPad" : "Join thousands of students on LaunchPad"}
              </p>
            </div>

            <div style={{ display: "flex", background: T.bgDeep, borderRadius: 11, padding: 4, marginBottom: 22, border: `1px solid ${T.border}` }}>
              {["student", "recruiter"].map(r => (
                <button key={r} onClick={() => setRole(r)} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", cursor: "none", fontFamily: "inherit", fontWeight: 600, fontSize: 13, background: role === r ? T.surface : "transparent", color: role === r ? T.ink : T.inkLight, boxShadow: role === r ? "0 1px 4px rgba(0,0,0,.07)" : "none", transition: "all .18s" }}>
                  {r === "student" ? "Student" : "Recruiter"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {mode === "signup" && <Field label="Full name" value={name} onChange={e => setName(e.target.value)} placeholder="Priya Sharma" required />}
              <Field label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              <Field label="Password" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" required />

              {err && <div style={{ background: T.redSoft, border: `1px solid ${T.red}30`, borderRadius: 8, padding: "9px 13px", color: T.red, fontSize: 13 }}>{err}</div>}

              <button type="submit" style={{ marginTop: 4, padding: "12px 0", borderRadius: 10, border: "none", background: loading ? "#78716C" : T.ink, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "none", fontFamily: "inherit", transition: "background .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading && <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} />}
                {loading ? "Signing in…" : mode === "signin" ? "Continue →" : "Create account →"}
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
              <div style={{ flex: 1, height: 1, background: T.border }} />
              <span style={{ color: T.inkLight, fontSize: 12 }}>or</span>
              <div style={{ flex: 1, height: 1, background: T.border }} />
            </div>

            <button onClick={() => { setErr(""); setMode(mode === "signin" ? "signup" : "signin"); }} style={{ width: "100%", padding: "11px 0", borderRadius: 10, border: `1px solid ${T.border}`, background: "transparent", color: T.inkMid, fontSize: 13.5, fontWeight: 500, cursor: "none", fontFamily: "inherit", transition: "background .15s" }} onMouseEnter={e => e.currentTarget.style.background = T.bgDeep} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>

            <p style={{ color: T.inkLight, fontSize: 11.5, textAlign: "center", marginTop: 18, lineHeight: 1.6 }}>By continuing you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </Fade>
      </div>
    </div>
  );
}