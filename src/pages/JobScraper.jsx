import { useState } from "react";
import { T } from "../utils/theme";
import Fade from "../components/Fade";
import Card from "../components/Card";
import Btn from "../components/Btn";

export default function JobScraper() {
  const [q, setQ] = useState("Product Manager Intern");
  const [phase, setPhase] = useState("idle");
  const [res, setRes] = useState([]);

  const scrape = async () => {
    if (!q.trim()) return;

    setPhase("loading");

    try {
      const res = await fetch(`http://localhost:5000/scrape-jobs?q=${q}`);
      const data = await res.json();

      setRes(data.jobs || []);
      setPhase("done");

    } catch (err) {
      console.log(err);
      setPhase("idle");
      alert("Failed to fetch jobs");
    }
  };

  const sc = { LinkedIn: "#0077B5", Internshala: "#FF6B35", Glassdoor: "#0CAA41", Naukri: "#EF4444", Wellfound: "#1A1A1A" };

  return (
    <div>
      <Fade><div style={{ marginBottom: 26 }}><h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 32, fontWeight: 400, color: T.ink, margin: "0 0 5px" }}>Live Job Scraper</h1><p style={{ color: T.inkLight, fontSize: 14, margin: 0 }}>Real-time scraping from LinkedIn, Internshala, Glassdoor, Naukri, Wellfound & more.</p></div></Fade>
      <Fade delay={.08}><Card style={{ padding: 22, marginBottom: 22 }}>
        <div style={{ display: "flex", gap: 11, marginBottom: 12 }}>
          <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && scrape()} placeholder="e.g. Product Manager Intern · APM · Strategy Intern" style={{ flex: 1, background: T.bgDeep, border: `1.5px solid ${T.border}`, borderRadius: 9, padding: "10px 14px", fontSize: 13.5, color: T.ink, fontFamily: "inherit", outline: "none", transition: "border-color .2s" }} onFocus={e => e.target.style.borderColor = T.sage} onBlur={e => e.target.style.borderColor = T.border} />
          <Btn variant="sage" onClick={scrape} style={{ whiteSpace: "nowrap" }}>⊕ Scrape Jobs</Btn>
        </div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {["LinkedIn", "Internshala", "Glassdoor", "Naukri", "Wellfound", "Unstop", "AngelList"].map(s => <span key={s} style={{ background: T.bgDeep, color: T.inkLight, fontSize: 11, padding: "3px 10px", borderRadius: 100, border: `1px solid ${T.border}`, fontWeight: 500 }}>{s}</span>)}
        </div>
      </Card></Fade>

      {phase === "loading" && <Fade><Card style={{ padding: 54, textAlign: "center" }}>
        <div style={{ width: 44, height: 44, border: `3px solid ${T.border}`, borderTopColor: T.sage, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" }} />
        <p style={{ color: T.ink, fontSize: 15, fontWeight: 600, margin: "0 0 6px" }}>Scraping live jobs…</p>
        <p style={{ color: T.inkLight, fontSize: 13.5, margin: 0 }}>Searching LinkedIn, Internshala, Glassdoor, Naukri…</p>
      </Card></Fade>}

      {phase === "done" && <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        <Fade><p style={{ color: T.sage, fontSize: 13.5, fontWeight: 600, margin: 0 }}>✓ Found {res.length} live opportunities for "{q}"</p></Fade>
        {res.map((j, i) => <Fade key={i} delay={i * .06}><Card hover style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 11 }}>
            <div><p style={{ color: T.ink, fontWeight: 600, fontSize: 14.5, margin: "0 0 4px" }}>{j.title}</p><p style={{ color: T.inkLight, fontSize: 12.5, margin: 0 }}>{j.co} · {j.loc}</p></div>
            <div style={{ textAlign: "right" }}>
              <div style={{ background: `${sc[j.src] || "#666"}16`, border: `1px solid ${sc[j.src] || "#666"}28`, borderRadius: 7, padding: "3px 10px", marginBottom: 5, display: "inline-block" }}><span style={{ color: sc[j.src] || T.inkMid, fontSize: 11.5, fontWeight: 600 }}>via {j.src}</span></div>
              <p style={{ color: T.inkLight, fontSize: 11, margin: 0 }}>{j.age}</p>
            </div>
          </div>
          <div style={{ background: T.bgDeep, borderRadius: 9, padding: "11px 14px", marginBottom: 12, border: `1px solid ${T.border}` }}>
            <p style={{ color: T.inkMid, fontSize: 13, margin: 0 }}><span style={{ color: T.sage, fontWeight: 600 }}>How to apply: </span>{j.how}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: T.sage, fontWeight: 700, fontSize: 14 }}>{j.sal}</span>
            <div style={{ display: "flex", gap: 9 }}><Btn
              variant="ghost"
              small
              onClick={() => window.open(j.url, "_blank")}
            >
              View original ↗
            </Btn></div>
          </div>
        </Card></Fade>)}
      </div>}

      {phase === "idle" && <div style={{ textAlign: "center", padding: 56, color: T.inkLight }}>
        <p style={{ fontSize: 30, margin: "0 0 10px" }}>⊕</p>
        <p style={{ fontSize: 14 }}>Enter a role above and click Scrape Jobs to see live opportunities.</p>
      </div>}
    </div>
  );
}
