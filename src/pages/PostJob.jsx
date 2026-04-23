import { useState } from "react";
import { T } from "../utils/theme";
import Fade from "../components/Fade";
import Card from "../components/Card";
import Field from "../components/Field";
import Btn from "../components/Btn";

export default function PostJob() {

  const [title,setTitle]=useState("");
  const [company,setCompany]=useState("");
  const [location,setLocation]=useState("");
  const [salary,setSalary]=useState("");
  const [description,setDescription]=useState("");
  const [deadline,setDeadline]=useState("");
  const [type,setType]=useState("Internship");
  const [eligibility,setEligibility]=useState("");
  const [skills,setSkills]=useState("");

  const submit = async () => {
    try {
      const res = await fetch("http://localhost:5000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          company,
          location,
          salary,
          description,
          role: "student",
          deadline,
          type,
          eligibility,
          skills: skills.split(",") // convert to array
        })
      });

      const data = await res.json();
      alert(data.message);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Fade>
        <div style={{marginBottom:28}}>
          <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:32,fontWeight:400,color:T.ink}}>
            Post a Job Profile
          </h1>
        </div>
      </Fade>

      <Fade delay={.08}>
        <Card style={{padding:32,maxWidth:640}}>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>

            <Field label="Job Title" value={title} onChange={e=>setTitle(e.target.value)} />
            <Field label="Company Name" value={company} onChange={e=>setCompany(e.target.value)} />
            <Field label="Location" value={location} onChange={e=>setLocation(e.target.value)} />
            <Field label="Salary / Stipend" value={salary} onChange={e=>setSalary(e.target.value)} />

            {/* NEW */}
            <div>
              <label style={{fontSize:11.5,color:T.inkMid}}>APPLICATION DEADLINE</label>
              <input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)}
                style={{width:"100%",padding:"10px",borderRadius:8}} />
            </div>

            <div>
              <label style={{fontSize:11.5,color:T.inkMid}}>EMPLOYMENT TYPE</label>
              <select value={type} onChange={e=>setType(e.target.value)}
                style={{width:"100%",padding:"10px",borderRadius:8}}>
                <option>Internship</option>
                <option>Full-time</option>
                <option>Part-time</option>
              </select>
            </div>

          </div>

          <Field label="Eligibility" value={eligibility} onChange={e=>setEligibility(e.target.value)} />
          <Field label="Skills (comma separated)" value={skills} onChange={e=>setSkills(e.target.value)} />

          <div style={{marginTop:12}}>
            <label style={{fontSize:11.5,color:T.inkMid}}>JOB DESCRIPTION</label>
            <textarea rows={4} value={description} onChange={e=>setDescription(e.target.value)}
              style={{width:"100%",padding:"10px",borderRadius:8}} />
          </div>

          <Btn variant="sage" onClick={submit} style={{marginTop:16}}>
            Publish Job Profile →
          </Btn>

        </Card>
      </Fade>
    </div>
  );
}