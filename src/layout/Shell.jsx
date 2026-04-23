import { T } from "../utils/theme";
import Cursor from "../components/Cursor";
import NavItem from "../components/NavItem";

export default function Shell({user,active,setActive,onLogout,children}) {
  const sNav=[{id:"dashboard",icon:"⌂",label:"Dashboard"},{id:"resume",icon:"◎",label:"Resume AI",badge:"AI"},{id:"jobs",icon:"◈",label:"Jobs & Internships",badge:"47"},{id:"scraper",icon:"⊕",label:"Live Job Scraper"},{id:"applications",icon:"◉",label:"My Applications"},{id:"explore",icon:"◌",label:"Career Explorer"}];
  const rNav=[{id:"dashboard",icon:"⌂",label:"Dashboard"},{id:"post-job",icon:"◈",label:"Post a Job"},{id:"candidates",icon:"◉",label:"Candidate Pool"},{id:"analytics",icon:"◌",label:"Analytics"}];
  const nav=user.role==="recruiter"?rNav:sNav;

  return (
    <div style={{display:"flex",minHeight:"100vh",background:T.bg,fontFamily:"'DM Sans',sans-serif",cursor:"none"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&display=swap');*{box-sizing:border-box;cursor:none!important;}::selection{background:${T.sageSoft};color:${T.sage};}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${T.border};border-radius:4px}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes pulseDot{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      <Cursor/>

      <aside style={{width:216,minHeight:"100vh",background:T.surface,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",padding:"22px 10px",position:"fixed",top:0,left:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"4px 8px 18px"}}>
          <div style={{width:28,height:28,background:T.ink,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 13L8 3L13 13M5.5 9H10.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </div>
          <span style={{fontSize:15,fontWeight:700,color:T.ink,letterSpacing:"-.3px"}}>LaunchPad</span>
        </div>

        <p style={{fontSize:10,fontWeight:700,color:T.inkLight,letterSpacing:.7,textTransform:"uppercase",padding:"0 11px",margin:"0 0 6px"}}>Menu</p>
        <div style={{display:"flex",flexDirection:"column",gap:2,flex:1}}>
          {nav.map(n=><NavItem key={n.id} {...n} active={active===n.id} onClick={()=>setActive(n.id)}/>)}
        </div>

        <div style={{borderTop:`1px solid ${T.border}`,paddingTop:14}}>
          <div style={{display:"flex",alignItems:"center",gap:9,padding:"8px 10px 10px"}}>
            <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${T.sage},${T.amber})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:12,flexShrink:0}}>{user.name?.[0]?.toUpperCase()}</div>
            <div style={{minWidth:0}}>
              <p style={{margin:0,fontSize:12.5,fontWeight:600,color:T.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</p>
              <p style={{margin:0,fontSize:11,color:T.inkLight,textTransform:"capitalize"}}>{user.role}</p>
            </div>
          </div>
          <button onClick={onLogout} style={{width:"100%",padding:"7px 11px",borderRadius:8,border:`1px solid ${T.border}`,background:"transparent",color:T.inkMid,fontSize:12,fontWeight:500,cursor:"none",fontFamily:"inherit",transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=T.bgDeep} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>Sign out</button>
        </div>
      </aside>

      <main style={{marginLeft:216,flex:1,padding:"38px 46px",maxWidth:1080}}>{children}</main>
    </div>
  );
}