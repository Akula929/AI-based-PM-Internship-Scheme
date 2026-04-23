import Groq from "groq-sdk";
import fs from "fs";
import multer from "multer";
import Application from "./models/Application.js";
import Job from "./models/Job.js";
import mongoose from "mongoose";
import User from "./models/User.js";
import express from "express";
import cors from "cors";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const app = express();
app.use("/uploads", express.static("uploads"));

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/uploads", express.static("uploads"));

// ✅ GROQ
const groq = new Groq({
  apiKey:  " ...Api _key"
});

// ✅ DB
mongoose.connect("... mongo db url")
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log("DB Error:", err));

// ✅ MULTER
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// ✅ UPLOAD + AI
app.post("/apply", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `uploads/${req.file.filename}`;
    const dataBuffer = fs.readFileSync(filePath);

    const uint8Array = new Uint8Array(dataBuffer);
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdf = await loadingTask.promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(" ") + "\n";
    }

    console.log("Extracted text length:", text.length);

    app.put("/applications/:id/status", async (req, res) => {
      try {
        console.log("API HIT", req.params.id, req.body.status);
        const { status } = req.body;

        const updated = await Application.findByIdAndUpdate(
          req.params.id,
          { status },
          { new: true }
        );

        res.json(updated);

      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to update status" });
      }
    });

    // 🔥 GROQ AI
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert ATS resume analyzer. Return only JSON."
        },
        {
          role: "user",
          content: `
          You are a strict ATS (Applicant Tracking System) evaluator.
Analyze the resume carefully and score based on:

1. ATS compatibility (format, keywords)
2. Content quality (clarity, relevance)
3. Structure (sections, readability)
4. Skills match
5. Experience impact

RULES:
- Score must be realistic and consistent
- Overall score = average of all sections
- Weak resume → low score (10-40)
- Average → 40-70
- Strong → 70-90

Return ONLY JSON:

{
  "score": number,
  "ats": number,
  "content": number,
  "structure": number,
  "skills": number,
  "experience": number,
  "suggestions": ["Give 3-5 strong improvement suggestions"]
}
  Resume :
${text}
   `
        }
      ],
      temperature: 0.3
    });

    let aiText = completion.choices[0].message.content;

    // 🔥 CLEAN JSON
    aiText = aiText.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;

    try {
      parsed = JSON.parse(aiText);
    } catch (e) {
      console.log("AI RAW RESPONSE:", aiText);

      parsed = {
        score: 50,
        ats: 50,
        content: 50,
        structure: 50,
        skills: 50,
        experience: 50,
        suggestions: ["AI parsing issue"]
      };
    }

    // 🔥 EXTRA SAFETY (IMPORTANT)
    if (!parsed) {
      parsed = {
        score: 50,
        ats: 50,
        content: 50,
        structure: 50,
        skills: 50,
        experience: 50,
        suggestions: ["AI returned empty result"]
      };
    }

    // ✅ RESPONSE
    console.log("FINAL DATA:", parsed);
    res.json({
      message: "AI analysis complete",
      fileUrl: `http://localhost:5000/uploads/${req.file.filename}`,
      score: Number(parsed.score) || 0,
      analysis: {
        ats: Number(parsed.ats) || 0,
        content: Number(parsed.content) || 0,
        structure: Number(parsed.structure) || 0,
        skills: Number(parsed.skills) || 0,
        experience: Number(parsed.experience) || 0
      },
      suggestions: parsed.suggestions || []
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);

    res.status(500).json({
      message: "Analysis failed",
      error: err.message
    });
  }
});

// ✅ TEST
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ REGISTER
app.post("/register", async (req, res) => {
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const newUser = new User(req.body);
    await newUser.save();

    res.json({ message: "User registered successfully" });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ LOGIN
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.password !== req.body.password) return res.status(400).json({ message: "Wrong password" });

    res.json({ message: "Login successful", user });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ JOBS
app.post("/jobs", async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.json({ message: "Job created successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ APPLY
app.post("/apply", async (req, res) => {
  try {
    const { jobId, name, email, coverNote, company, role } = req.body;

    const appData = new Application({
      jobId,
      name,
      email,
      coverNote,
      company,
      role,
      resume: req.file
        ? `http://localhost:5000/uploads/${req.file.filename}`
        : "",// ✅ store resume per job
    });

    await appData.save();
    res.json({ message: "Application submitted successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ APPLICATIONS
app.get("/applications", async (req, res) => {
  try {
    const apps = req.query.jobId
      ? await Application.find({ jobId: req.query.jobId })
      : await Application.find();

    res.json(apps);

  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/generate-resume", async (req, res) => {
  try {
    const { name, email, skills, experience, education, projects, certifications } = req.body;

    const prompt = `
Create a clean, professional ATS-optimized resume.

IMPORTANT RULES:
- Do NOT use markdown symbols like **, *, #, []
- Do NOT use bullet symbols like *
- Use plain text only
- Use proper headings like:

Name
Contact Information
Summary
Skills
Experience
Education
Projects
Certifications

Make it clean and readable like a real resume with ATS compatiability.

Data:
Name: ${name}
Email: ${email}
Skills: ${skills}
Experience: ${experience}
Education: ${education}
Projects: ${projects}
Certifications: ${certifications}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer. Create ATS-optimized resumes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5
    });

    const aiResume = completion.choices[0].message.content;

    res.json({
      resume: aiResume
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate resume" });
  }
});
app.post("/match-jobs", async (req, res) => {
  try {
    const { resumeUrl } = req.body;
    const filePath = resumeUrl.replace("http://localhost:5000/", "");
    const dataBuffer = fs.readFileSync(filePath);

    const uint8Array = new Uint8Array(dataBuffer);
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdf = await loadingTask.promise;

    let resumeText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      resumeText += content.items.map(item => item.str).join(" ") + "\n";
    }

    // Dummy jobs (later we make dynamic)
    const jobs = await Job.find();

    // Simple matching logic
    const matchedJobs = [];

    for (const job of jobs) {
      const prompt = `
You are an AI job matcher.

Compare this resume and job.

Resume:
${resumeText}

Job:
Title: ${job.title}
Skills: ${(job.skills || []).join(", ")}
Description: ${job.description || ""}

Give ONLY a number (0-100) for match percentage.
`;

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3
      });

      let aiText = completion.choices[0].message.content;

      // extract number from text
      let match = aiText.match(/\d+/);
      let score = match ? parseInt(match[0]) : 50;

      matchedJobs.push({
        _id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        skills: job.skills || [],
        type: job.type,
        salary: job.salary,
        deadline: job.deadline,
        m: Math.min(score, 100)
      });
    }

    res.json({ jobs: matchedJobs });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Matching failed" });
  }
});

// ✅ START SERVER
app.post("/save-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    res.json({
      message: "Resume saved successfully",
      resume: fileUrl
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save resume" });
  }
});
app.get("/scrape-jobs", async (req, res) => {
  try {
    const q = req.query.q?.toLowerCase() || "";
    const response = await fetch("https://remotive.com/api/remote-jobs");
    const data = await response.json();

    const filtered = data.jobs.filter(job => {
      const title = job.title.toLowerCase();
      const queryWords = q.split(" ");

      return queryWords.some(word => title.includes(word));
    });

    const jobs = filtered.slice(0, 10).map(job => ({
      title: job.title,
      co: job.company_name,
      loc: job.candidate_required_location,
      sal: job.salary || "N/A",
      src: "Remotive",
      age: "recent",
      how: "Apply on official site",
      url: job.url
    }));

    res.json({ jobs });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Scraping failed" });
  }
});

app.get("/applications", async (req, res) => {
  try {
    const email = req.query.email;

    let apps;

    if (email) {
      apps = await Application.find({ email: email });
    } else {
      apps = await Application.find();
    }

    res.json(apps);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "error" });
  }
});
app.put("/applications/:id/status", async (req, res) => {
  try {
    
    console.log("API HIT", req.params.id, req.body.status);

    const { status } = req.body;

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});