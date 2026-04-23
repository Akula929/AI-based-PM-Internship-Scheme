import { T } from "../utils/theme";
import { useEffect, useState } from "react";
import Fade from "../components/Fade";
import Card from "../components/Card";
import Btn from "../components/Btn";

export default function Dashboard({ user, setActive }) {
  const [appCount, setAppCount] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [resumeScore, setResumeScore] = useState(0);

  useEffect(() => {
    // Applications count
    fetch("http://localhost:5000/applications")
      .then(res => res.json())
      .then(data => setAppCount(data.length || 0))
      .catch(err => console.log(err));

    // Matched jobs count
    fetch("http://localhost:5000/jobs")
      .then(res => res.json())
      .then(data => setMatchCount(data.length || 0))
      .catch(err => console.log(err));

    fetch("http://localhost:5000/jobs")
      .then(res => res.json())
      .then(data => {
        const top3 = data.slice(0, 3).map(j => ({
          role: j.title,
          co: j.company,
          loc: j.location,
          m: j.m || 80,
          salary: j.salary || "N/A"
        }));
        setMatches(top3);
      })
      .catch(err => console.log(err));

    const score = localStorage.getItem("resumeScore");
    if (score) {
      setResumeScore(score);
    }

  }, []);

  const h = new Date().getHours();
  const g = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  const stats = [{ l: "Resume Score", v:resumeScore, u: "%", d: "+5 pts", c: T.sage, bg: T.sageSoft }, { l: "AI Matches", v: matchCount, u: "", d: "today", c: T.blue, bg: T.blueSoft }, { l: "Applications", v: appCount, u: "", d: "+3 this week", c: T.amber, bg: T.amberSoft }, { l: "Profile Views", v: "234", u: "", d: "by recruiters", c: T.inkMid, bg: T.bgDeep }];
  const [matches, setMatches] = useState([]);
  return (
    <div>
      <Fade><div style={{ marginBottom: 28 }}><p style={{ color: T.inkLight, fontSize: 12.5, fontWeight: 500, margin: "0 0 4px", letterSpacing: .2 }}>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p><h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 34, fontWeight: 400, color: T.ink, margin: 0, letterSpacing: "-.4px" }}>{g}, {user.name?.split(" ")[0]} 👋</h1></div></Fade>
      <Fade delay={.1}><div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
        {stats.map((s, i) => <Card key={i} style={{ padding: 20 }}><p style={{ color: T.inkLight, fontSize: 10.5, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase", margin: "0 0 10px" }}>{s.l}</p><div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 6 }}><span style={{ fontFamily: "'DM Serif Display',serif", fontSize: 30, fontWeight: 400, color: s.c }}>{s.v}</span><span style={{ fontSize: 13, color: s.c }}>{s.u}</span></div><span style={{ background: s.bg, color: s.c, fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 100 }}>{s.d}</span></Card>)}
      </div></Fade>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 22 }}>
        <Fade delay={.18}><Card style={{ padding: 26 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}><h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 19, fontWeight: 400, color: T.ink, margin: 0 }}>AI Matched Jobs</h2><Btn variant="ghost" small onClick={() => setActive("jobs")}>View all →</Btn></div>
          {matches.map((m, i) => <div key={i} style={{ padding: "15px 0", borderBottom: i < matches.length - 1 ? `1px solid ${T.borderSoft}` : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}><div><p style={{ color: T.ink, fontWeight: 600, fontSize: 13.5, margin: "0 0 3px" }}>{m.role}</p><p style={{ color: T.inkLight, fontSize: 12, margin: 0 }}>{m.co} · {m.loc}</p></div><div style={{ textAlign: "right" }}><div style={{ background: T.sageSoft, borderRadius: 7, padding: "3px 9px", marginBottom: 4, display: "inline-block" }}><span style={{ color: T.sage, fontSize: 12.5, fontWeight: 700 }}>{m.m}%</span></div><p style={{ color: T.inkLight, fontSize: 11, margin: 0 }}>{m.salary}</p></div></div>
          </div>)}
        </Card></Fade>
        <Fade delay={.26}><div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[{ id: "resume", ic: "◎", t: "Check Resume Score", s: "AI analysis in 30s", c: T.sage }, { id: "scraper", ic: "⊕", t: "Scrape Live Jobs", s: "100+ fresh listings", c: T.blue }, { id: "explore", ic: "◌", t: "Career Roadmap", s: "PM & Dev paths", c: T.amber }, { id: "applications", ic: "◉", t: "Track Applications", s: "12 active", c: T.inkMid }].map((a, i) => (
            <Card key={i} hover style={{ padding: 16, cursor: "none" }} onClick={() => setActive(a.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: a.c === "sage" ? T.sageSoft : a.c === T.sage ? T.sageSoft : a.c === T.blue ? T.blueSoft : a.c === T.amber ? T.amberSoft : T.bgDeep, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: a.c, flexShrink: 0 }}>{a.ic}</div>
                <div><p style={{ color: T.ink, fontWeight: 600, fontSize: 13, margin: "0 0 2px" }}>{a.t}</p><p style={{ color: T.inkLight, fontSize: 11.5, margin: 0 }}>{a.s}</p></div>
                <span style={{ marginLeft: "auto", color: T.inkLight }}>›</span>
              </div>
            </Card>
          ))}
        </div></Fade>
      </div>
    </div>
  );
}
