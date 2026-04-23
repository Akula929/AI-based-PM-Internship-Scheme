import { useEffect, useState } from "react";
import { T } from "../utils/theme";
import Fade from "../components/Fade";
import Card from "../components/Card";
import Btn from "../components/Btn";

export default function RecruiterApplications() {

  const [apps, setApps] = useState([]);

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/applications/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      const res = await fetch("http://localhost:5000/applications");
      const data = await res.json();
      setApps(data);

    } catch (err) {
      console.log(err);
    }
  };

  // FETCH DATA
  useEffect(() => {
    fetch("http://localhost:5000/applications")
      .then(res => res.json())
      .then(data => setApps(data))
      .catch(err => console.log(err));
  }, []);

  const ss = {
    Pending: { c: "#6B7280", bg: "#F3F4F6" },
    Shortlisted: { c: T.blue, bg: T.blueSoft },
    Interview: { c: T.amber, bg: T.amberSoft },
    Rejected: { c: "#EF4444", bg: "#FEE2E2" }
  };

  return (
    <div>

      {/* HEADER */}
      <Fade>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontFamily: "'DM Serif Display',serif",
            fontSize: 32,
            fontWeight: 400,
            color: T.ink
          }}>
            Applications
          </h1>
        </div>
      </Fade>

      {/* GRID UI */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2,1fr)",
        gap: 16
      }}>

        {apps.map((a, i) => (

          <Fade key={i} delay={i * 0.05}>
            <Card hover style={{ padding: 22 }}>

              {/* TOP */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>

                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
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
                    {a.name?.[0]}
                  </div>

                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>
                      {a.name}
                    </p>
                    <p style={{ fontSize: 12, color: T.inkLight, margin: 0 }}>
                      {a.role || "Role"} · {a.company || "Company"}
                    </p>
                  </div>
                </div>

              </div>

              {/* COVER NOTE */}
              <p style={{ fontSize: 12, color: T.inkLight, marginBottom: 10 }}>
                {a.coverNote}
              </p>

              {/* STATUS */}
              <div style={{ marginBottom: 14 }}>
                <span style={{
                  background: ss[a.status || "Pending"]?.bg,
                  color: ss[a.status || "Pending"]?.c,
                  padding: "4px 10px",
                  borderRadius: 100,
                  fontSize: 11
                }}>
                  {a.status || "Pending"}
                </span>
              </div>

              {/* ACTIONS */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>

                {/* RESUME BUTTON */}
                <Btn
                  variant="outline"
                  small
                  onClick={() => {
                    if (!a.resume) return alert("No resume");
                    window.open(a.resume, "_blank");
                  }}
                >
                  Resume
                </Btn>

                {/* STATUS BUTTONS (NOW SAME STYLE) */}
                <div style={{ display: "flex", gap: 6 }}>

                  <Btn
                    variant="outline"
                    small
                    onClick={() => updateStatus(a._id, "Shortlisted")}
                  >
                    Shortlist
                  </Btn>

                  <Btn
                    variant="outline"
                    small
                    onClick={() => updateStatus(a._id, "Interview")}
                  >
                    Interview
                  </Btn>

                  <Btn
                    variant="outline"
                    small
                    onClick={() => updateStatus(a._id, "Rejected")}
                  >
                    Reject
                  </Btn>

                </div>

              </div>

            </Card>
          </Fade>

        ))}

      </div>

    </div>
  );
}