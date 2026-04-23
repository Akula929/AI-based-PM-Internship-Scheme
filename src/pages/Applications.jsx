import { useEffect, useState } from "react";
import { T } from "../utils/theme";
import Fade from "../components/Fade";
import Card from "../components/Card";
import Btn from "../components/Btn";

export default function Applications({user}) {

  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/applications?email=${user.email}`)
      .then(res => res.json())
      .then(data => setApps(data))
      .catch(err => console.log(err));
  }, []);

  const ss = {
    Pending: { c: "#6B7280", bg: "#F3F4F6" },
    Applied: { c: "#6B7280", bg: "#F3F4F6" },
    Shortlisted: { c: T.blue, bg: T.blueSoft },
    Interview: { c: T.amber, bg: T.amberSoft },
    Offer: { c: T.sage, bg: T.sageSoft },
    Rejected: { c: T.red, bg: T.redSoft }
  };

  const lc = { G: "#4285F4", M: "#00A4EF", S: "#FC8019", R: "#3395FF", C: "#1A1A2E" };
  const stages = ["Pending", "Shortlisted", "Interview", "Offer"];

  console.log(apps);

  return (
    <div>

      <Fade>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 32, fontWeight: 400, color: T.ink, margin: "0 0 5px" }}>
            Application Tracker
          </h1>
          <p style={{ color: T.inkLight, fontSize: 14, margin: 0 }}>
            Track every application and its current stage.
          </p>
        </div>
      </Fade>

      {/* COUNTS */}
      <Fade delay={.08}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
          {stages.map(s => {
            const n = apps.filter(a => (a.status || "Pending") === s).length;
            return (
              <Card key={s} style={{ padding: 18 }}>
                <p style={{ color: T.inkLight, fontSize: 10.5, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase", margin: "0 0 8px" }}>
                  {s}
                </p>
                <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: 32, fontWeight: 400, color: ss[s].c, margin: "0 0 3px" }}>
                  {n}
                </p>
                <p style={{ color: T.inkLight, fontSize: 12, margin: 0 }}>
                  applications
                </p>
              </Card>
            );
          })}
        </div>
      </Fade>

      {/* TABLE */}
      <Fade delay={.14}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {apps.map((a, i) => (
            <Card key={i} style={{ padding: 18 }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                {/* LEFT SIDE */}
                <div>
                  <p style={{ color: T.ink, fontWeight: 600, fontSize: 14, margin: "0 0 4px" }}>
                    {a.company ? a.company : "Unknown Company"}
                  </p>
                  <p style={{ color: T.inkLight, fontSize: 12.5, margin: 0 }}>
                    {a.role ? a.role : "Unknown Role"}· Applied on {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* RIGHT SIDE (STATUS) */}
                <div style={{
                  background: ss[a.status || "Pending"]?.bg,
                  color: ss[a.status || "Pending"]?.c,
                  padding: "5px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600
                }}>
                  {(a.status || "Pending")}
                </div>

              </div>

            </Card>
          ))}

        </div>
      </Fade>

    </div>
  );
}