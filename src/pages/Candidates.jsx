import { useEffect, useState } from "react";
import { T } from "../utils/theme";
import Fade from "../components/Fade";
import Card from "../components/Card";
import Pill from "../components/Pill";
import Btn from "../components/Btn";

export default function Candidates() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/applications")
      .then(res => res.json())
      .then(apps => {

        const transformed = apps.map(a => {

          // AI SCORE
          let score = 0;

          if (a.resume) score += 40;
          if (a.coverNote) score += 20;

          if (a.status === "Shortlisted") score += 30;
          else if (a.status === "Interview") score += 20;
          else score += 10;

          return {
            n: a.name,
            col: "Student",
            sc: score,
            sk: ["AI", "ML"],
            role: a.role || "Role",
            st: a.status || "Applied",
            resume: a.resume,
            email: a.email
          };
        });

        transformed.sort((a, b) => b.sc - a.sc);

        setData(transformed);

      })
      .catch(err => console.log(err));
  }, []);

  const ss = {
    Applied: { c: "#6B7280", bg: "#F3F4F6" },
    Shortlisted: { c: T.blue, bg: T.blueSoft },
    Interview: { c: T.amber, bg: T.amberSoft },
    Offer: { c: T.sage, bg: T.sageSoft },
    Rejected: { c: "#EF4444", bg: "#FEE2E2" }
  };

  return (
    <div>

      <Fade>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontFamily: "'DM Serif Display',serif",
            fontSize: 32,
            fontWeight: 400,
            color: T.ink,
            margin: "0 0 5px"
          }}>
            Candidate Pool
          </h1>
          <p style={{ color: T.inkLight, fontSize: 14 }}>
            AI-ranked candidates based on resume match score.
          </p>
        </div>
      </Fade>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2,1fr)",
        gap: 16
      }}>

        {data.map((c, i) => (
          <Fade key={i} delay={i * .05}>
            <Card hover style={{ padding: 22 }}>

              {/* TOP */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 13 }}>

                <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg,${T.sage},${T.amber})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700
                  }}>
                    {c.n?.[0]}
                  </div>

                  <div>
                    <p style={{ color: T.ink, fontWeight: 600, margin: 0 }}>
                      {c.n}
                    </p>
                    <p style={{ color: T.inkLight, fontSize: 12, margin: 0 }}>
                      {c.col}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <p style={{
                    fontFamily: "'DM Serif Display',serif",
                    fontSize: 26,
                    color: T.sage,
                    margin: 0
                  }}>
                    {c.sc}
                  </p>
                  <p style={{ fontSize: 11, color: T.inkLight }}>
                    AI score
                  </p>
                </div>

              </div>

              {/* SKILLS */}
              <div style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginBottom: 13
              }}>
                {c.sk.map(s => (
                  <Pill key={s} color={T.blue} bg={T.blueSoft}>
                    {s}
                  </Pill>
                ))}
              </div>

              {/* BOTTOM */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>

                <span style={{
                  background: ss[c.st]?.bg,
                  color: ss[c.st]?.c,
                  fontSize: 11.5,
                  padding: "4px 10px",
                  borderRadius: 100
                }}>
                  {c.st}
                </span>

                {/* ONLY RESUME BUTTON (outline style) */}
                <Btn
                  variant="outline"
                  small
                  onClick={() => window.open(c.resume, "_blank")}
                >
                  Resume
                </Btn>

              </div>

            </Card>
          </Fade>
        ))}

      </div>

    </div>
  );
}