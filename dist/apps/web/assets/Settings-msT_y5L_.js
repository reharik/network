import{r as c,j as t,h as s}from"./index-BFw5mKhb.js";const x=s.section`
  background: #0e1220;
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 16px;
  padding: 20px;
  display: grid;
  gap: 18px;
`,n=s.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`,d=s.label`
  color: ${({theme:e})=>e.colors.subtext};
`,a=s.input`
  background: #0a0d17;
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  color: ${({theme:e})=>e.colors.text};
  min-width: 260px;
`,p=s.button`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: #0f1424;
  color: ${({theme:e})=>e.colors.text};
  cursor: pointer;
`,m=()=>{const[e,i]=c.useState({reminderHour:"09:00",tz:Intl.DateTimeFormat().resolvedOptions().timeZone,weeklyDigest:!0});c.useEffect(()=>{const o=localStorage.getItem("settings");if(o)try{const r=JSON.parse(o);i(l=>({reminderHour:r.reminderHour??l.reminderHour,tz:r.tz??l.tz,weeklyDigest:typeof r.weeklyDigest=="boolean"?r.weeklyDigest:l.weeklyDigest}))}catch(r){console.log("************err************"),console.log(r),console.log("********END err************")}},[]);const g=()=>{localStorage.setItem("settings",JSON.stringify(e)),alert("Settings saved")};return t.jsxs(x,{children:[t.jsx("h2",{children:"Settings"}),t.jsxs(n,{children:[t.jsx(d,{htmlFor:"reminderHour",children:"Daily reminder time"}),t.jsx(a,{id:"reminderHour",type:"time",value:e.reminderHour,onChange:o=>i(r=>({...r,reminderHour:o.target.value}))})]}),t.jsxs(n,{children:[t.jsx(d,{htmlFor:"tz",children:"Time zone"}),t.jsx(a,{id:"tz",value:e.tz,onChange:o=>i(r=>({...r,tz:o.target.value}))})]}),t.jsxs(n,{children:[t.jsx(d,{htmlFor:"weeklyDigest",children:"Weekly email digest"}),t.jsx("input",{id:"weeklyDigest",type:"checkbox",checked:e.weeklyDigest,onChange:o=>i(r=>({...r,weeklyDigest:o.target.checked}))})]}),t.jsx(n,{children:t.jsx(p,{onClick:g,children:"Save"})})]})};export{m as Settings};
