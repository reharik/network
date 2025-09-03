import{u as g,r as u,j as o,f as m}from"./index-BhI8Pxlq.js";import{u as h}from"./useMutation-DexDYsTq.js";import{i as f,q as b}from"./keys-D9GUwjRo.js";import"./api-Qa43F_vh.js";const v=m.section`
  background: #0e1220;
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 16px;
  padding: 20px;
  display: grid;
  gap: 16px;
`,j=m.label`
  border: 2px dashed ${({theme:e})=>e.colors.border};
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
`,y=m.button`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: #0f1424;
  color: ${({theme:e})=>e.colors.text};
  cursor: pointer;
`,C=e=>{const s=e.split(/\r?\n/).filter(Boolean);if(!s.length)return[];const l=s[0].split(",").map(r=>r.trim());return s.slice(1).map(r=>{const p=r.split(","),n={};return l.forEach((i,d)=>{n[i]=(p[d]??"").trim()}),n})},N=e=>({firstName:e.firstName,lastName:e.lastName,email:e.email||void 0,phone:e.phone||void 0,notes:e.notes||void 0,tags:e.tags?e.tags.split("|").map(s=>s.trim()).filter(Boolean):[]}),I=()=>{const e=g(),[s,l]=u.useState([]),[r,p]=u.useState(""),n=h({mutationFn:t=>f(t),onSuccess:()=>{e.invalidateQueries({queryKey:b.contacts}),alert("Import complete")}}),i=async t=>{if(!t)return;p(t.name);const a=await t.text(),c=C(a);l(c)},d=t=>{var c;t.preventDefault();const a=(c=t.dataTransfer.files)==null?void 0:c[0];i(a??null)},x=s.map(N);return o.jsxs(v,{children:[o.jsx("h2",{children:"Import Contacts (CSV)"}),o.jsxs("p",{children:["Headers: ",o.jsx("code",{children:"firstName,lastName,email,phone,notes,tags"})," (use"," ",o.jsx("code",{children:"|"})," to separate multiple tags)"]}),o.jsxs(j,{onDrop:d,onDragOver:t=>t.preventDefault(),children:[o.jsx("input",{type:"file",accept:".csv,text/csv",style:{display:"none"},onChange:t=>{var a;return void i(((a=t.target.files)==null?void 0:a[0])??null)}}),"Drag & drop CSV here, or click to select"]}),r&&o.jsxs("div",{children:[o.jsx("strong",{children:"Selected:"})," ",r," — ",s.length," rows parsed"]}),o.jsx(y,{disabled:!s.length||n.isPending,onClick:()=>n.mutate(x),children:n.isPending?"Importing…":`Import ${s.length} contacts`})]})};export{I as ImportPage};
