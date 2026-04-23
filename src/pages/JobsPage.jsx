import { useState, useEffect } from "react";
import { T } from "../utils/theme";
import Fade from "../components/Fade";
import Card from "../components/Card";
import Btn from "../components/Btn";
import Pill from "../components/Pill";
import Field from "../components/Field";

export default function JobsPage() {
    const [filter, setFilter] = useState("all");
    const [sel, setSel] = useState(null);
    const [applying, setApplying] = useState(false);
    const [done, setDone] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [resumeFile, setResumeFile] = useState(null);
    const [savedResume, setSavedResume] = useState("");

    useEffect(() => {
        // fetch jobs
        fetch("http://localhost:5000/jobs")
            .then(res => res.json())
            .then(data => setJobs(data))
            .catch(err => console.log(err));

        // ✅ load saved resume automatically
        const saved = localStorage.getItem("savedResume");
        if (saved) {
            setSavedResume(saved);
        }

    }, []);

    // ✅ ADD HERE (exactly below useEffect)
    const saveResume = async () => {
        if (!resumeFile) {
            alert("Please select a file");
            return;
        }

        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("userId", "123456");

        try {
            const res = await fetch("http://localhost:5000/save-resume", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            localStorage.setItem("savedResume", data.resume);

            alert("Resume saved!");

        } catch (err) {
            console.log(err);
        }
    };

    const matchJobs = async () => {
        try {


            if (!savedResume) {
                alert("Upload resume first");
                return;
            }



            const res = await fetch("http://localhost:5000/match-jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ resumeUrl: savedResume })
            });

            const data = await res.json();

            // 🔥 THIS LINE IS IMPORTANT
            setJobs(data.jobs || []);
            setSel(null); // reset selected job

        } catch (err) {
            console.log(err);
            alert("Matching failed");
        }
    };


    const lc = { G: "#4285F4", M: "#00A4EF", S: "#FC8019", R: "#3395FF" };
    const filtered = filter === "all" ? jobs : jobs.filter(j => j.type === filter);

    const user = JSON.parse(localStorage.getItem("user")) || {
        name: "Manjunath",
        email: "manjunath@gmail.com"
    };

    return (                                                                                                           
        <div>
            <Fade>
                <div style={{ marginBottom: 26 }}>
                    <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 32, fontWeight: 400, color: T.ink, margin: "0 0 5px", letterSpacing: "-.3px" }}>
                        Jobs & Internships
                    </h1>
                    <p style={{ color: T.inkLight, fontSize: 14, margin: 0 }}>
                        AI-matched opportunities based on your resume and profile.
                    </p>
                </div>
            </Fade>
            <Card style={{ padding: 20, marginBottom: 20 }}>
                <h3>Upload Resume for Matching</h3>

                <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                />

                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <Btn variant="sage" onClick={saveResume}>
                        Save Resume
                    </Btn>

                    <Btn variant="sage" onClick={matchJobs}>
                        Match Jobs with My Resume
                    </Btn>
                </div>
            </Card>

            <Fade delay={.08}>
                <div style={{ display: "flex", gap: 4, marginBottom: 22, background: T.bgDeep, borderRadius: 10, padding: 4, width: "fit-content", border: `1px solid ${T.border}` }}>
                    {[["all", "All"], ["internship", "Internships"], ["fulltime", "Full-time"]].map(([v, l]) => (
                        <button key={v} onClick={() => setFilter(v)} style={{
                            padding: "7px 16px",
                            borderRadius: 7,
                            border: "none",
                            cursor: "none",
                            fontFamily: "inherit",
                            fontSize: 12.5,
                            fontWeight: 500,
                            background: filter === v ? T.surface : "transparent",
                            color: filter === v ? T.ink : T.inkLight,
                            boxShadow: filter === v ? "0 1px 3px rgba(0,0,0,.06)" : "none",
                            transition: "all .15s"
                        }}>{l}</button>
                    ))}
                </div>
            </Fade>

            <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr 400px" : "1fr 1fr", gap: 18 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                    {filtered.map((j, i) => (
                        <Fade key={j._id || i} delay={i * .05}>
                            <Card hover style={{
                                padding: 22,
                                cursor: "none",
                                border: sel?._id === j._id ? `1.5px solid ${T.sage}` : undefined
                            }}
                                onClick={() => {
                                    localStorage.setItem("jobId", j._id); // 🔥 important
                                    setSel(j);
                                    setApplying(false);
                                    setDone(false);
                                }}>

                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                                    <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: 10,
                                            background: `${lc[j.logo] || "#999"}16`,
                                            border: `1px solid ${lc[j.logo] || "#999"}28`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontWeight: 800, color: lc[j.logo] || "#999", fontSize: 15
                                        }}>
                                            {j.logo || "J"}
                                        </div>

                                        <div>
                                            <p style={{ color: T.ink, fontWeight: 600, fontSize: 14, margin: "0 0 3px" }}>
                                                {j.title}
                                            </p>
                                            <p style={{ color: T.inkLight, fontSize: 12, margin: 0 }}>
                                                {j.company} · {j.location}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ background: T.sageSoft, borderRadius: 7, padding: "3px 9px", marginBottom: 4, display: "inline-block" }}>
                                            <span style={{ color: T.sage, fontSize: 12.5, fontWeight: 700 }}>
                                                {j.m || 90}% match
                                            </span>
                                        </div>
                                        <p style={{ color: T.inkLight, fontSize: 11, margin: 0 }}>
                                            {j.salary}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                                    {(j.skills || []).map(s => (
                                        <Pill key={s} color={T.blue} bg={T.blueSoft}>{s}</Pill>
                                    ))}
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Pill color={j.type === "internship" ? T.amber : T.sage}
                                        bg={j.type === "internship" ? T.amberSoft : T.sageSoft}>
                                        {j.type === "internship" ? "Internship" : "Full-time"}
                                    </Pill>
                                    <span style={{ color: T.inkLight, fontSize: 11.5 }}>
                                        Deadline: {j.deadline || "N/A"}
                                    </span>
                                </div>

                            </Card>
                        </Fade>
                    ))}

                </div>

                {sel && (
                    <Fade>
                        <Card style={{ padding: 26, position: "sticky", top: 20, maxHeight: "88vh", overflowY: "auto" }}>

                            <div style={{ display: "flex", gap: 11, alignItems: "center", marginBottom: 18 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 11,
                                    background: `${lc[sel.logo] || "#999"}16`,
                                    border: `1px solid ${lc[sel.logo] || "#999"}28`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontWeight: 800, color: lc[sel.logo] || "#999", fontSize: 18
                                }}>
                                    {sel.logo || "J"}
                                </div>

                                <div>
                                    <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 19, fontWeight: 400, color: T.ink, margin: "0 0 3px" }}>
                                        {sel.title}
                                    </h2>
                                    <p style={{ color: T.inkLight, fontSize: 12.5, margin: 0 }}>
                                        {sel.company} · {sel.location}
                                    </p>
                                </div>
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <p style={{ color: T.inkMid, fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>
                                    {sel.description}
                                </p>
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <p style={{ color: T.inkLight, fontSize: 12 }}><b>Salary:</b> {sel.salary}</p>
                                <p style={{ color: T.inkLight, fontSize: 12 }}><b>Type:</b> {sel.type}</p>
                                <p style={{ color: T.inkLight, fontSize: 12 }}><b>Deadline:</b> {sel.deadline || "N/A"}</p>
                                <p style={{ color: T.inkLight, fontSize: 12 }}><b>Eligibility:</b> {sel.eligibility || "Not specified"}</p>
                            </div>

                            <div style={{ marginBottom: 18 }}>
                                {(sel.skills || []).map((s, i) => (
                                    <Pill key={i} color={T.blue} bg={T.blueSoft}>{s}</Pill>
                                ))}
                            </div>

                            {!applying && !done && <Btn variant="sage" onClick={() => setApplying(true)} style={{ width: "100%", justifyContent: "center" }}>Apply Now →</Btn>}

                            {applying && !done && <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                                <Field label="Cover note (optional)" placeholder="Why you're a great fit…" />
                                <div style={{ display: "flex", gap: 9 }}>
                                    <Btn variant="ghost" onClick={() => setApplying(false)} style={{ flex: 1 }}>Cancel</Btn>

                                    {/* 🔥 ONLY CHANGE HERE */}
                                    <Btn variant="sage"
                                        onClick={async () => {
                                            try {
                                                const formData = new FormData();

                                                formData.append("jobId", sel._id);
                                                formData.append("name", user.name);
                                                formData.append("email", user.email);
                                                formData.append("coverNote", "Applied via portal");
                                                formData.append("company", sel.company);
                                                formData.append("role", sel.title);
                                                formData.append("resume", resumeFile); // 🔥 important

                                                const res = await fetch("http://localhost:5000/apply", {
                                                    method: "POST",
                                                    body: formData
                                                });

                                                const data = await res.json();
                                                alert(data.message);

                                                setDone(true);
                                                setApplying(false);

                                            } catch (err) {
                                                console.log(err);
                                            }
                                        }}
                                        style={{ flex: 2 }}
                                    >
                                        Submit
                                    </Btn>
                                </div>
                            </div>}

                            {done && <div style={{ textAlign: "center" }}>
                                <p style={{ color: T.sage }}>Application submitted!</p>
                            </div>}

                        </Card>
                    </Fade>
                )}

            </div>
        </div>
    );
}