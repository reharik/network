import{a as Q,r as S,j as s,h as m}from"./index-9bKELV1L.js";import{u as H}from"./useMutation-DOcVeEDd.js";import{u as K}from"./useContactListService-G9c6mWme.js";import{u as U}from"./useContactService-BPabvCE3.js";import{q as Z}from"./keys-kIXIRbY9.js";const J=m.section`
  background: #0e1220;
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 16px;
  padding: 20px;
  display: grid;
  gap: 16px;
`,X=m.label`
  border: 2px dashed ${({theme:e})=>e.colors.border};
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
`,L=m.button`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: #0f1424;
  color: ${({theme:e})=>e.colors.text};
  cursor: pointer;
`,Y=m.input`
  background: #0a0d17;
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  color: ${({theme:e})=>e.colors.text};
  width: 100%;
  margin-bottom: 16px;
`,_=m.div`
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 10px;
  background: #0a0d17;
`,ee=m.div`
  padding: 12px;
  border-bottom: 1px solid ${({theme:e})=>e.colors.border};
  background: ${({selected:e})=>e?"#1a2332":"transparent"};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;

  &:hover {
    background: #1a2332;
  }

  &:last-child {
    border-bottom: none;
  }
`,te=m.input`
  margin: 0;
`,se=m.div`
  flex: 1;
`,oe=m.div`
  font-weight: 500;
  color: ${({theme:e})=>e.colors.text};
`,ae=m.div`
  font-size: 0.9em;
  color: ${({theme:e})=>e.colors.subtext};
  margin-top: 2px;
`,ne=e=>{const h=e.split(/\r?\n/).filter(Boolean);if(!h.length)return[];const x=h[0].split(",").map(n=>n.trim());return h.slice(1).map(n=>{const l=n.split(","),o={};return x.forEach((u,f)=>{o[u]=(l[f]??"").trim()}),o})},re=e=>e.split("BEGIN:VCARD").filter(Boolean).map(x=>{const n=x.split(/\r?\n/).filter(Boolean),l={};return n.forEach(o=>{var u,f;if(o.startsWith("FN:")){const b=o.substring(3).trim().split(" ");l["Given Name"]=b[0]||"",l["Family Name"]=b.slice(1).join(" ")||""}else if(o.startsWith("N:")){const r=o.substring(2).split(";");l["Family Name"]=r[0]||"",l["Given Name"]=r[1]||""}else if(o.startsWith("TEL")||o.includes(".TEL")){const r=(u=o.split(":")[1])==null?void 0:u.trim();r&&(l["Phone 1 - Value"]=r)}else if(o.startsWith("EMAIL")||o.includes(".EMAIL")){const r=(f=o.split(":")[1])==null?void 0:f.trim();r&&(l["E-mail 1 - Value"]=r)}else if(o.startsWith("ORG:")){const r=o.substring(4).trim();r&&(l.Notes=`Organization: ${r}`)}else if(o.startsWith("CATEGORIES:")){const r=o.substring(11).trim();r&&(l.Tags=r)}}),l}),C=e=>{const h=e["Given Name"]||e["First Name"]||e.firstName||"",x=e["Family Name"]||e["Last Name"]||e.lastName||"",n=e["E-mail 1 - Value"]||e.Email||e.email||void 0,l=e["Phone 1 - Value"]||e.Phone||e.phone||void 0,o=e.Notes||e.notes||void 0,u=e.tags||e.Tags||e.Groups||"";return{firstName:h.trim(),lastName:x.trim(),email:(n==null?void 0:n.trim())||void 0,phone:(l==null?void 0:l.trim())||void 0,notes:(o==null?void 0:o.trim())||void 0,tags:u||void 0}},me=()=>{const e=Q(),{importContacts:h}=U(),{fetchContacts:x}=K(),[n,l]=S.useState([]),[o,u]=S.useState(""),[f,r]=S.useState(new Set),[b,B]=S.useState(""),[I,O]=S.useState(new Set),E=H({mutationFn:t=>h(t),onSuccess:()=>{e.invalidateQueries({queryKey:Z.contacts}),alert("Import complete")}}),$=async t=>{if(!t)return;u(t.name);const i=await t.text(),a=i.includes("BEGIN:VCARD")?re(i):ne(i);l(a);const c=new Set;try{const d=await x();if(!d.success)throw new Error("Failed to fetch existing contacts: "+d.errors.join(", "));const N=d.data.contacts;a.forEach((v,k)=>{const j=C(v);N.some(y=>{var D,R,T,G,P,A;return((D=y.firstName)==null?void 0:D.toLowerCase())===((R=j.firstName)==null?void 0:R.toLowerCase())&&((T=y.lastName)==null?void 0:T.toLowerCase())===((G=j.lastName)==null?void 0:G.toLowerCase())&&(((P=y.email)==null?void 0:P.toLowerCase())===((A=j.email)==null?void 0:A.toLowerCase())||y.phone===j.phone)})&&c.add(k)})}catch(d){console.error("Error checking for duplicates:",d)}O(c);const p=new Set;a.forEach((d,N)=>{const v=C(d),k=v.firstName&&v.lastName,j=v.email||v.phone,F=c.has(N);k&&j&&!F&&p.add(N)}),r(p)},M=t=>{var a;t.preventDefault();const i=(a=t.dataTransfer.files)==null?void 0:a[0];$(i??null)},W=n.map(C).filter(t=>t.firstName&&t.lastName),g=n.filter((t,i)=>{var N;const a=C(t),c=a.firstName&&a.lastName,p=a.email||a.phone;if(!c||!p||I.has(i))return!1;const d=((N=a.email)==null?void 0:N.toLowerCase())||"";return d.includes("@sale.craigslist")||d.includes("@reply.craigslist")||d.includes("noreply@")||d.includes("no-reply@")?!1:b?`${a.firstName} ${a.lastName} ${a.email||""} ${a.phone||""}`.toLowerCase().includes(b.toLowerCase()):!0}),w=g.map((t,i)=>{const a=n.indexOf(t);return{row:t,originalIndex:a}}).filter(({originalIndex:t})=>f.has(t)).map(({row:t})=>C(t)).filter(t=>t.firstName&&t.lastName),V=t=>{const i=new Set(f);i.has(t)?i.delete(t):i.add(t),r(i)},q=()=>{const t=new Set;g.forEach((i,a)=>{const c=n.indexOf(i),p=C(i);p.firstName&&p.lastName&&t.add(c)}),r(t)},z=()=>{r(new Set)};return s.jsxs(J,{children:[s.jsx("h2",{children:"Import Contacts"}),s.jsxs("p",{children:["Supports Google Takeout vCard (.vcf) files and CSV files.",s.jsx("br",{}),s.jsx("strong",{children:"Google Takeout:"})," Upload the .vcf file directly",s.jsx("br",{}),s.jsx("strong",{children:"CSV format:"})," Headers like"," ",s.jsx("code",{children:"Given Name, Family Name, E-mail 1 - Value, Phone 1 - Value, Notes"}),s.jsx("br",{}),s.jsx("strong",{children:"Custom CSV:"})," ",s.jsx("code",{children:"firstName,lastName,email,phone,notes,tags"})," (use"," ",s.jsx("code",{children:"|"})," to separate multiple tags)"]}),s.jsxs(X,{onDrop:M,onDragOver:t=>t.preventDefault(),children:[s.jsx("input",{type:"file",accept:".csv,.vcf,text/csv,text/vcard",style:{display:"none"},onChange:t=>{var i;return void $(((i=t.target.files)==null?void 0:i[0])??null)}}),"Drag & drop vCard (.vcf) or CSV file here, or click to select"]}),o&&s.jsxs("div",{children:[s.jsx("strong",{children:"Selected:"})," ",o," — ",n.length," rows parsed, ",W.length," valid contacts",n.length>g.length&&s.jsxs("span",{style:{color:"#666"},children:[" ","(",n.length-g.length," hidden: ",I.size," duplicates,"," ",n.length-g.length-I.size," incomplete/spam)"]})]}),n.length>0&&s.jsxs(s.Fragment,{children:[s.jsx("div",{children:s.jsx(Y,{type:"text",placeholder:"Filter contacts by name, email, or phone...",value:b,onChange:t=>B(t.target.value)})}),s.jsxs("div",{style:{display:"flex",gap:"8px",marginBottom:"16px"},children:[s.jsx(L,{onClick:q,children:"Select All"}),s.jsx(L,{onClick:z,children:"Select None"}),s.jsxs("div",{style:{marginLeft:"auto",color:"#666"},children:[w.length," of ",g.length," selected"]})]}),s.jsx(_,{children:g.map((t,i)=>{const a=n.indexOf(t),c=C(t),p=f.has(a);return c.firstName&&c.lastName?s.jsxs(ee,{selected:p,onClick:()=>V(a),children:[s.jsx(te,{type:"checkbox",checked:p,onChange:()=>V(a)}),s.jsxs(se,{children:[s.jsxs(oe,{children:[c.firstName," ",c.lastName]}),s.jsxs(ae,{children:[c.email&&s.jsxs("div",{children:["📧 ",c.email]}),c.phone&&s.jsxs("div",{children:["📞 ",c.phone]}),c.notes&&s.jsxs("div",{children:["📝 ",c.notes]})]})]})]},a):null})})]}),s.jsx(L,{disabled:!w.length||E.isPending,onClick:()=>E.mutate(w),children:E.isPending?"Importing…":`Import ${w.length} selected contacts`})]})};export{me as ImportPage};
