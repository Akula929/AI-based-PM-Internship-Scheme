import { T } from "../utils/theme";
import Fade from "../components/Fade";
import Card from "../components/Card";
import { useEffect, useState } from "react";

export default function RecruiterDashboard({ user }) {

  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/applications")
      .then(res => res.json())
      .then(data => setApps(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>

      {/* ANIMATION STYLE */}
      <style>{`
        @keyframes rotateChart {
          from {
            transform: rotate(-90deg);
            opacity: 0;
          }
          to {
            transform: rotate(0deg);
            opacity: 1;
          }
        }
      `}</style>

      {/* HEADER */}
      <Fade>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontFamily: "'DM Serif Display',serif",
            fontSize: 32,
            fontWeight: 400,
            color: T.ink,
            margin: "0 0 5px"
          }}>
            Recruiter Dashboard
          </h1>
          <p style={{ color: T.inkLight, fontSize: 14 }}>
            Manage your job postings and candidates.
          </p>
        </div>
      </Fade>

      {/* CARDS */}
      <Fade delay={.1}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14
        }}>

          <Card style={{ padding: 18 }}>
            <p style={{ color: T.inkLight, fontSize: 11 }}>Jobs Posted</p>
            <p style={{ fontSize: 28, fontWeight: 600 }}>1</p>
          </Card>

          <Card style={{ padding: 18 }}>
            <p style={{ color: T.inkLight, fontSize: 11 }}>Applications</p>
            <p style={{ fontSize: 28, fontWeight: 600 }}>{apps.length}</p>
          </Card>

          <Card style={{ padding: 18 }}>
            <p style={{ color: T.inkLight, fontSize: 11 }}>Shortlisted</p>
            <p style={{ fontSize: 28, fontWeight: 600 }}>
              {apps.filter(a => a.status === "Shortlisted").length}
            </p>
          </Card>

          <Card style={{ padding: 18 }}>
            <p style={{ color: T.inkLight, fontSize: 11 }}>Interviews</p>
            <p style={{ fontSize: 28, fontWeight: 600 }}>
              {apps.filter(a => a.status === "Interview").length}
            </p>
          </Card>

        </div>
      </Fade>

      {/* CHART + ACTIONS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        gap: 20,
        marginTop: 20
      }}>

        {/* LEFT → DONUT CHART */}
        <Fade delay={.2}>
          <Card style={{ padding: 24, borderRadius: 18 }}>

            <h3 style={{ marginBottom: 20 }}>Hiring Insights</h3>

            {(() => {

              const total = apps.length;

              const shortlisted = apps.filter(a => a.status === "Shortlisted").length;
              const interview = apps.filter(a => a.status === "Interview").length;
              const rejected = apps.filter(a => a.status === "Rejected").length;

              const sPercent = total ? (shortlisted / total) * 100 : 0;
              const iPercent = total ? (interview / total) * 100 : 0;

              const gradient = `conic-gradient(
                #4F46E5 0% ${sPercent}%,
                #F59E0B ${sPercent}% ${sPercent + iPercent}%,
                #EF4444 ${sPercent + iPercent}% 100%
              )`;

              return (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 40
                }}>

                  {/* DONUT */}
                  <div style={{
                    width: 160,
                    height: 160,
                    borderRadius: "50%",
                    background: gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    animation: "rotateChart 1s ease"
                  }}>

                    <div style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      background: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "inset 0 2px 6px rgba(0,0,0,0.08)"
                    }}>
                      <span style={{ fontSize: 18, fontWeight: 700 }}>
                        {total}
                      </span>
                      <span style={{ fontSize: 11, color: "#888" }}>
                        Applications
                      </span>
                    </div>

                  </div>

                  {/* LEGEND */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 12,
                        height: 12,
                        borderRadius: 4,
                        background: "#4F46E5"
                      }}></div>
                      <span>Shortlisted ({shortlisted})</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 12,
                        height: 12,
                        borderRadius: 4,
                        background: "#F59E0B"
                      }}></div>
                      <span>Interview ({interview})</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 12,
                        height: 12,
                        borderRadius: 4,
                        background: "#EF4444"
                      }}></div>
                      <span>Rejected ({rejected})</span>
                    </div>

                  </div>

                </div>
              );
            })()}

          </Card>
        </Fade>

        {/* RIGHT → MODERN ACTIONS */}
        <Fade delay={.3}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            <Card hover style={{ padding: 16, borderRadius: 14, cursor: "pointer" }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#EEF2FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>➕</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>Post Job</p>
                  <p style={{ margin: 0, fontSize: 12, color: T.inkLight }}>
                    Create new listing
                  </p>
                </div>
              </div>
            </Card>

            <Card hover style={{ padding: 16, borderRadius: 14, cursor: "pointer" }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#ECFEFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>📄</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>Applications</p>
                  <p style={{ margin: 0, fontSize: 12, color: T.inkLight }}>
                    Review candidates
                  </p>
                </div>
              </div>
            </Card>

            <Card hover style={{ padding: 16, borderRadius: 14, cursor: "pointer" }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#FEF3C7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>👥</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>Candidate Pool</p>
                  <p style={{ margin: 0, fontSize: 12, color: T.inkLight }}>
                    AI ranked talent
                  </p>
                </div>
              </div>
            </Card>

          </div>
        </Fade>

      </div>

    </div>
  );
}