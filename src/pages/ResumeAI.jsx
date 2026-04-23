import jsPDF from "jspdf";
import { useState, useRef } from "react";
import { T } from "../utils/theme";
import Fade from "../components/Fade";
import Card from "../components/Card";
import Btn from "../components/Btn";
import Pill from "../components/Pill";
import Field from "../components/Field";

export default function ResumeAI() {
  const [stage, setStage] = useState("upload");
  const [tab, setTab] = useState("score");
  const [prog, setProg] = useState(0);
  const [score, setScore] = useState(0);
  const [resumeFile, setResumeFile] = useState(null);
  const [savedResume, setSavedResume] = useState("");
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [analysis, setAnalysis] = useState({
    ats: 0,
    content: 0,
    structure: 0,
    skills: 0,
    experience: 0
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    skills: "",
    experience: "",
    education: "",
    projects: "",
    certifications: ""
  });


  const generateResume = async () => {
    try {
      const res = await fetch("http://localhost:5000/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      console.log("AI RESPONSE:", data);

      setAiResume(data.resume || "");  // ✅ ADD THIS

      alert("AI Resume Generated");

    } catch (err) {
      console.error(err);
      alert("Error sending data");
    }
  };

  const [suggestions, setSuggestions] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  const [aiResume, setAiResume] = useState("");

  const fileRef = useRef(null); // ✅ added

  const downloadPDF = () => {
    const doc = new jsPDF();

    const lines = aiResume.split("\n");

    let y = 15;

    lines.forEach((line, index) => {

      // 👉 NAME (first line)
      if (index === 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text(line, 10, y);
        y += 10;
      }

      // 👉 HEADINGS
      else if (
        line.toLowerCase().includes("contact") ||
        line.toLowerCase().includes("summary") ||
        line.toLowerCase().includes("skills") ||
        line.toLowerCase().includes("experience") ||
        line.toLowerCase().includes("education") ||
        line.toLowerCase().includes("projects") ||
        line.toLowerCase().includes("certifications")
      ) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        y += 5;
        doc.text(line, 10, y);
        y += 7;
      }

      // 👉 NORMAL TEXT
      else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);

        const split = doc.splitTextToSize(line, 180);
        split.forEach((l) => {
          doc.text(l, 10, y);
          y += 6;
        });
      }

      // 👉 PAGE BREAK
      if (y > 280) {
        doc.addPage();
        y = 15;
      }

    });

    doc.save("resume.pdf");
  };
  const saveResume = async () => {
    if (!resumeFile) {
      alert("Please select a file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      // ⚠️ For now use dummy userId (we fix later)
      formData.append("userId", "123456");

      const res = await fetch("http://localhost:5000/save-resume", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      console.log("SAVE RESPONSE:", data);
      setSavedResume("");  // clear old before updating
      setSavedResume(data.resume || "");

      alert("Resume saved!");

    } catch (err) {
      console.error(err);
      alert("Error saving resume");
    }
  };

  const matchJobs = async () => {
    try {
      if (!savedResume) {
        alert("Please upload resume first");
        return;
      }

      // fetch resume text from file (simple way for now)
      const resFile = await fetch(savedResume);
      const blob = await resFile.blob();
      const text = await blob.text();

      const res = await fetch("http://localhost:5000/match-jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ resumeUrl: savedResume })                             
      });

      const data = await res.json();

      console.log("MATCHED JOBS:", data);

      setMatchedJobs(data.jobs || []);

    } catch (err) {
      console.error(err);
      alert("Matching failed");
    }
  };

  // ✅ FIXED upload function
  const handleUpload = async (file) => {
    if (file.type !== "application/pdf") {
      alert("Only PDF allowed");
      return;
    }

    console.log("Selected file:", file);

    const formData = new FormData();
    formData.append("resume", file);

    formData.append("name", "Student");
    formData.append("email", "student@test.com");
    formData.append("jobId", "AI_ANALYSIS");
    formData.append("company", "AI");
    formData.append("role", "Resume");
    try {
      const res = await fetch("http://localhost:5000/apply", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      console.log("BACKEND RESPONSE:", data);
      setScore(data.score || 0);
      localStorage.setItem("resumeScore", data.score || 0);
      setAnalysis(data.analysis);
      setSuggestions(data.suggestions || []);
      setFileUrl(data.fileUrl || "");
      console.log("Response:", data);

      alert(data.message);

      go(); // ✅ move to loading

    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  };

  const go = () => {
    console.log("SETTING STAGE TO LOADING");

    setStage("loading");
    setProg(0);

    const iv = setInterval(() => {
      setProg(p => {
        if (p >= 100) {
          clearInterval(iv);

          console.log("SETTING STAGE TO RESULTS"); // 👈 ADD THIS

          setStage("results");
          return 100;
        }
        return p + 2;
      });
    }, 40);
  };

  // const score = 78;
  const sc = score >= 85 ? T.sage : score >= 65 ? T.amber : T.red;

  const baseScore = score || 0;

  const subs = [
    { l: "ATS Compatibility", v: Math.min(Number(analysis?.ats) || 0, 100) },
    { l: "Content Quality", v: Math.min(Number(analysis?.content) || 0, 100) },
    { l: "Format & Structure", v: Math.min(Number(analysis?.structure) || 0, 100) },
    { l: "Skills Relevance", v: Math.min(Number(analysis?.skills) || 0, 100) },
    { l: "Experience Impact", v: Math.min(Number(analysis?.experience) || 0, 100) }
  ];

  const suggs = [{ p: "High", c: T.red, bg: T.redSoft, title: "Quantify every achievement", body: "Change 'improved engagement' → 'increased DAU by 32% in 6 weeks'. Numbers build instant credibility with recruiters." }, { p: "High", c: T.red, bg: T.redSoft, title: "Weak opening verbs", body: "Replace 'helped', 'assisted' with Led, Architected, Spearheaded, Orchestrated, Scaled." }, { p: "Medium", c: T.amber, bg: T.amberSoft, title: "Missing professional summary", body: "A 2–3 line tailored summary dramatically improves ATS match and recruiter attention." }, { p: "Medium", c: T.amber, bg: T.amberSoft, title: "Add PM toolset", body: "List Jira, Confluence, Figma, Mixpanel, Amplitude — they appear in 90% of PM JDs." }, { p: "Low", c: T.sage, bg: T.sageSoft, title: "Education section ✓", body: "Well formatted with relevant coursework. No changes needed." }];

  const sample = `PRIYA SHARMA
Product Manager ...`;

  const tabs = [["score", "Score"], ["suggestions", "Suggestions"], ["view", "View Resume"], ["builder", "Build New"]];

  return (
    <div>
      <Fade>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 32, color: T.ink }}>Resume AI</h1>
          <p style={{ color: T.inkLight }}>Upload your resume for instant AI scoring.</p>
        </div>
      </Fade>

      {stage === "upload" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
          <Fade delay={.1}>
            <Card style={{ padding: 34, textAlign: "center" }}>

              {/* ✅ hidden file input */}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                ref={fileRef}
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  handleUpload(file);
                }}
              />

              <div style={{ width: 60, height: 60, background: T.sageSoft }}>◎</div>

              <h3>Upload your resume</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* ✅ FIXED BUTTON */}
                <Btn variant="sage" onClick={() => fileRef.current.click()}>
                  ◈ Choose file & analyse
                </Btn>

                <Btn variant="ghost" onClick={go}>
                  Use sample resume
                </Btn>
              </div>

            </Card>
          </Fade>

          <Fade delay={.18}>
            <Card style={{ padding: 26 }}>
              <h3>What we analyse</h3>
              <p>ATS, Keywords, Skills, Grammar...</p>
            </Card>
          </Fade>
        </div>
      )}

      {stage === "loading" && (
        <Fade>
          <Card style={{ padding: 60, textAlign: "center" }}>
            <p>Analysing... {prog}%</p>
          </Card>
        </Fade>
      )}

      {stage === "results" && <div>
        <div style={{ display: "flex", gap: 4, marginBottom: 22, background: T.bgDeep, borderRadius: 10, padding: 4, width: "fit-content", border: `1px solid ${T.border}` }}>
          {tabs.map(([id, label]) =>
            <button key={id} onClick={() => {
              console.log("TAB CLICKED:", id);
              setTab(id);
            }} style={{
              padding: "7px 16px",
              borderRadius: 7,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 12.5,
              fontWeight: 500,
              background: tab === id ? T.surface : "transparent",
              color: tab === id ? T.ink : T.inkLight,
              boxShadow: tab === id ? "0 1px 3px rgba(0,0,0,.06)" : "none",
              transition: "all .15s"
            }}>
              {label}
            </button>
          )}
        </div>

        {tab === "score" && (
          <Fade>
            <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 22 }}>

              <Card style={{ padding: 26, textAlign: "center" }}>
                <div style={{ position: "relative", width: 110, height: 110, margin: "0 auto 18px" }}>
                  <svg viewBox="0 0 110 110" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="55" cy="55" r="46" fill="none" stroke={T.bgDeep} strokeWidth="7" />
                    <circle
                      cx="55"
                      cy="55"
                      r="46"
                      fill="none"
                      stroke={sc}
                      strokeWidth="7"
                      strokeDasharray={`${2 * Math.PI * 46 * score / 100} ${2 * Math.PI * 46}`}
                      strokeLinecap="round"
                    />
                  </svg>

                  <div style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <span style={{ fontSize: 28, color: sc }}>{score}</span>
                    <span style={{ fontSize: 10.5, color: T.inkLight }}>/ 100</span>
                  </div>
                </div>

                <Pill color={sc} bg={score >= 85 ? T.sageSoft : score >= 65 ? T.amberSoft : T.redSoft}>
                  {score >= 85 ? "Excellent" : score >= 65 ? "Good — improve it" : "Needs work"}
                </Pill>

                <Btn variant="ghost" small onClick={() => setStage("upload")} style={{ marginTop: 14, width: "100%" }}>
                  Upload another
                </Btn>
              </Card>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {subs.map((s, i) => (
                  <Card key={i} style={{ padding: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span>{s.l}</span>
                      <span>{s.v}%</span>
                    </div>

                    <div style={{ height: 4, background: T.bgDeep, borderRadius: 4 }}>
                      <div style={{ height: "100%", width: `${s.v}%`, background: T.sage }} />
                    </div>

                    <p style={{ fontSize: 12 }}>💡 Improve this section</p>
                  </Card>
                ))}
              </div>

            </div>
          </Fade>
        )}

        {tab === "suggestions" && (
          <Fade>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Card style={{ padding: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {suggestions.length === 0 ? (
                    <p>No suggestions available</p>
                  ) : (
                    suggestions.map((s, i) => (
                      <Card key={i} style={{ padding: 18, borderLeft: `4px solid ${T.amber}` }}>

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <h4 style={{ margin: 0 }}>Suggestion {i + 1}</h4>
                          <span style={{
                            fontSize: 11,
                            padding: "2px 8px",
                            borderRadius: 6,
                            background: T.amberSoft,
                            color: T.amber
                          }}>
                            AI Tip
                          </span>
                        </div>

                        <p style={{ fontSize: 13, color: T.inkLight }}>
                          {s}
                        </p>

                      </Card>
                    ))
                  )}
                </div>

              </Card>
            </div>
          </Fade>
        )}
        {tab === "view" && (
          <Fade>
            <div style={{ height: "600px", border: `1px solid ${T.border}`, borderRadius: 10 }}>

              {fileUrl ? (
                <iframe
                  src={fileUrl}
                  title="Resume Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    borderRadius: 10
                  }}
                />
              ) : (
                <p style={{ padding: 20 }}>No resume uploaded</p>
              )}

            </div>
          </Fade>
        )}
        {tab === "view" && (
          <Fade>
            <div style={{ height: "600px", border: `1px solid ${T.border}`, borderRadius: 10 }}>

              {fileUrl ? (
                <iframe
                  src={fileUrl}
                  title="Resume Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    borderRadius: 10
                  }}
                />
              ) : (
                <p style={{ padding: 20 }}>No resume uploaded</p>
              )}

            </div>
          </Fade>
        )}
        {tab === "builder" && (
          <Fade>
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Card style={{ padding: 18, marginTop: 20 }}>

                  <h2>{form.name || "Your Name"}</h2>

                  <p>{form.email || "your@email.com"}</p>

                  <hr />

                  <h3>Skills</h3>
                  <p>{form.skills || "Your skills will appear here"}</p>
                  <h3>Experience</h3>
                  <p>{form.experience || "Your experience will appear here"}</p>
                  <h3>Education</h3>
                  <p>{form.education || "Your education will appear here"}</p>

                  <h3>Projects</h3>
                  <p>{form.projects || "Your projects will appear here"}</p>

                  <h3>Certifications</h3>
                  <p>{form.certifications || "Your certifications will appear here"}</p>

                </Card>

                <Field
                  label="Full Name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Field
                  label="Email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Field
                  label="Skills"
                  placeholder="e.g. React, Node, Python"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                />
                <Field
                  label="Experience"
                  placeholder="e.g. Developed a web app using React"
                  value={form.experience || ""}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                />
                <Field
                  label="Education"
                  placeholder="e.g. B.E Computer Science - 2026"
                  value={form.education}
                  onChange={(e) => setForm({ ...form, education: e.target.value })}
                />

                <Field
                  label="Projects"
                  placeholder="e.g. Built AI resume analyzer"
                  value={form.projects}
                  onChange={(e) => setForm({ ...form, projects: e.target.value })}
                />

                <Field
                  label="Certifications"
                  placeholder="e.g. AWS Certified, Google Data Analytics"
                  value={form.certifications}
                  onChange={(e) => setForm({ ...form, certifications: e.target.value })}
                />
                <p>{form.name}</p>
                <Btn
                  variant="sage"
                  onClick={generateResume}

                >
                  Generate AI Resume
                </Btn>
                {aiResume && (
                  <Card style={{ padding: 20, marginTop: 20 }}>
                    <Btn variant="sage" onClick={downloadPDF}>
                      Download PDF
                    </Btn>
                    <h3>AI Generated Resume</h3>

                    <pre style={{
                      whiteSpace: "pre-wrap",
                      fontFamily: "inherit",
                      fontSize: 13,
                      color: T.inkLight
                    }}>
                      {aiResume}
                    </pre>

                  </Card>
                )}


              </div>
            </div>
          </Fade>
        )}
        {tab === "myresume" && (
          <Fade>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              <h3>{savedResume ? "Replace Your Resume" : "Upload Your Resume"}</h3>

              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResumeFile(e.target.files[0])}
              />

              <Btn variant="sage" onClick={saveResume}>
                Save Resume
              </Btn>
              <Btn variant="sage" onClick={matchJobs}>
                Match Jobs with My Resume
              </Btn>
              {savedResume && (
                <Card style={{ padding: 20, marginTop: 20 }}>
                  <h3>Your Saved Resume</h3>

                  <iframe
                    src={savedResume}
                    title="Saved Resume"
                    style={{
                      width: "100%",
                      height: "500px",
                      border: "none",
                      borderRadius: 10
                    }}
                  />
                </Card>
              )}

            </div>
          </Fade>
        )}
      </div>}
    </div>
  );
}