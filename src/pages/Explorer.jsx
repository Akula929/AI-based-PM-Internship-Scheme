import { useState } from "react";
import { T } from "../utils/theme";
import Fade from "../components/Fade";
import Card from "../components/Card";
import Pill from "../components/Pill";

export default function Explorer() {
  const [act,setAct]=useState("pm");
  const maps={
    pm:{title:"Product Manager",phases:[
      {n:"01",title:"Foundation",dur:"4–6 weeks",c:T.sage,items:["Product Thinking & Mental Models","User Research & Interviews","Market & Competitive Analysis","Basic SQL for PMs","Design Thinking"]},
      {n:"02",title:"Core Skills",dur:"6–8 weeks",c:T.blue,items:["Writing PRDs & User Stories","Agile / Scrum Ceremonies","Roadmapping & Prioritisation","A/B Testing Fundamentals","Stakeholder Management"]},
      {n:"03",title:"Tooling",dur:"3–4 weeks",c:T.amber,items:["Jira & Confluence","Figma Basics","Mixpanel / Amplitude","Google Analytics","Notion for PMs"]},
      {n:"04",title:"Advanced",dur:"Ongoing",c:"#7C3AED",items:["Go-to-Market Strategy","Pricing & Revenue Models","API Literacy","0→1 Product Building","Leadership & Dynamics"]},
    ]},
    fs:{title:"Full Stack Developer",phases:[
      {n:"01",title:"Frontend",dur:"8–10 weeks",c:T.sage,items:["HTML5, CSS3, JS ES6+","React.js & Hooks","Tailwind CSS","TypeScript","State Management"]},
      {n:"02",title:"Backend",dur:"8–10 weeks",c:T.blue,items:["Node.js & Express","REST API Design","JWT Authentication","PostgreSQL & MongoDB","Prisma ORM"]},
      {n:"03",title:"DevOps",dur:"4–5 weeks",c:T.amber,items:["Git & GitHub","Docker & Compose","CI/CD Pipelines","AWS / Vercel","Nginx & SSL"]},
      {n:"04",title:"Advanced",dur:"Ongoing",c:"#7C3AED",items:["System Design","Microservices","GraphQL","Testing (Jest, Playwright)","Performance & Caching"]},
    ]},
  };
  const m=maps[act];

  return (
    <div>
      <Fade><div style={{marginBottom:26}}><h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:32,fontWeight:400,color:T.ink,margin:"0 0 5px"}}>Career Explorer</h1><p style={{color:T.inkLight,fontSize:14,margin:0}}>Structured roadmaps to take you from zero to offer.</p></div></Fade>
      <Fade delay={.06}><div style={{display:"flex",gap:4,marginBottom:34,background:T.bgDeep,borderRadius:10,padding:4,width:"fit-content",border:`1px solid ${T.border}`}}>
        {[["pm","Product Manager"],["fs","Full Stack Dev"]].map(([k,l])=><button key={k} onClick={()=>setAct(k)} style={{padding:"7px 18px",borderRadius:7,border:"none",cursor:"none",fontFamily:"inherit",fontSize:12.5,fontWeight:500,background:act===k?T.surface:"transparent",color:act===k?T.ink:T.inkLight,boxShadow:act===k?"0 1px 3px rgba(0,0,0,.06)":"none",transition:"all .15s"}}>{l}</button>)}
      </div></Fade>
      <div style={{display:"flex",flexDirection:"column"}}>
        {m.phases.map((p,i)=>(
          <Fade key={i} delay={i*.09}>
            <div style={{display:"flex",gap:22,marginBottom:30}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:46}}>
                <div style={{width:46,height:46,borderRadius:"50%",border:`2px solid ${p.c}`,background:`${p.c}12`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Serif Display',serif",fontWeight:400,color:p.c,fontSize:14,flexShrink:0}}>{p.n}</div>
                {i<m.phases.length-1&&<div style={{width:1,flex:1,minHeight:28,background:`linear-gradient(${p.c},${m.phases[i+1].c})`,marginTop:6,opacity:.35}}/>}
              </div>
              <div style={{flex:1,paddingTop:8}}>
                <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:14}}>
                  <h3 style={{fontFamily:"'DM Serif Display',serif",fontSize:19,fontWeight:400,color:T.ink,margin:0}}>{p.title}</h3>
                  <Pill color={p.c} bg={`${p.c}14`}>{p.dur}</Pill>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9}}>
                  {p.items.map((item,j)=><Card key={j} hover style={{padding:"13px 15px",display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:p.c,flexShrink:0}}/><span style={{color:T.inkMid,fontSize:13}}>{item}</span>
                  </Card>)}
                </div>
              </div>
            </div>
          </Fade>
        ))}
      </div>
    </div>
  );
}