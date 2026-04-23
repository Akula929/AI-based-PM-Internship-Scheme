import { useState, useEffect, useRef } from "react";
import { T } from "./utils/theme";
import Cursor from "./components/Cursor";
import Fade from "./components/Fade";
import Pill from "./components/Pill";
import Btn from "./components/Btn";
import Field from "./components/Field";
import Card from "./components/Card";
import RecruiterApplications from "./pages/RecruiterApplications";
import NavItem from "./components/NavItem";
import LoginPage from "./pages/LoginPage";
import Shell from "./layout/Shell";
import Dashboard from "./pages/Dashboard";
import ResumeAI from "./pages/ResumeAI";
import JobsPage from "./pages/JobsPage";
import Applications from "./pages/Applications";
import Explorer from "./pages/Explorer";
import JobScraper from "./pages/JobScraper";
import PostJob from "./pages/PostJob";
import Candidates from "./pages/Candidates";
import RecruiterDashboard from "./pages/RecruiterDashboard";


export default function App() {
  const [user,setUser]=useState(null);
  const [active,setActive]=useState("dashboard");

  if(!user) return <LoginPage onLogin={u=>{setUser(u);setActive("dashboard");}}/>;

  const pages={
    dashboard: user?.role === "recruiter"
  ? <RecruiterDashboard user={user} />
  : <Dashboard user={user} setActive={setActive}/>,
    resume:<ResumeAI/>,
    jobs:<JobsPage/>,
    applications:<Applications user={user}/>,
    explore:<Explorer/>,
    scraper:<JobScraper/>,
    "post-job":<PostJob/>,
    candidates:<Candidates/>,
    analytics:<RecruiterApplications />,
  };

  return (
    <Shell user={user} active={active} setActive={setActive} onLogout={()=>setUser(null)}>
      {pages[active]||pages.dashboard}
    </Shell>
  );
}