import{a as Q,r as S,j as s,h}from"./index-BFw5mKhb.js";import{u as H}from"./mappers-Et_TSE1t.js";import{u as K}from"./useContactListService-BXRVcd0O.js";import{u as U}from"./useContactService-BUIZEp1O.js";import{q as Z}from"./keys-kIXIRbY9.js";const J=h.section`
  background: #0e1220;
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 16px;
  padding: 20px;
  display: grid;
  gap: 16px;
`,X=h.label`
  border: 2px dashed ${({theme:e})=>e.colors.border};
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
`,L=h.button`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid ${({theme:e})=>e.colors.border};
  background: #0f1424;
  color: ${({theme:e})=>e.colors.text};
  cursor: pointer;
`,Y=h.input`
  background: #0a0d17;
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  color: ${({theme:e})=>e.colors.text};
  width: 100%;
  margin-bottom: 16px;
`,_=h.div`
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid ${({theme:e})=>e.colors.border};
  border-radius: 10px;
  background: #0a0d17;
`,ee=h.div`
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
`,te=h.input`
  margin: 0;
`,se=h.div`
  flex: 1;
`,oe=h.div`
  font-weight: 500;
  color: ${({theme:e})=>e.colors.text};
`,ae=h.div`
  font-size: 0.9em;
  color: ${({theme:e})=>e.colors.subtext};
  margin-top: 2px;
`,ne=e=>{const f=e.split(/\r?\n/).filter(Boolean);if(!f.length)return[];const x=f[0].split(",").map(n=>n.trim());return f.slice(1).map(n=>{const c=n.split(","),o={};return x.forEach((u,d)=>{o[u]=(c[d]??"").trim()}),o})},re=e=>e.split("BEGIN:VCARD").filter(Boolean).map(x=>{const n=x.split(/\r?\n/).filter(Boolean),c={};return n.forEach(o=>{var u,d;if(o.startsWith("FN:")){const b=o.substring(3).trim().split(" ");c["Given Name"]=b[0]||"",c["Family Name"]=b.slice(1).join(" ")||""}else if(o.startsWith("N:")){const r=o.substring(2).split(";");c["Family Name"]=r[0]||"",c["Given Name"]=r[1]||""}else if(o.startsWith("TEL")||o.includes(".TEL")){const r=(u=o.split(":")[1])==null?void 0:u.trim();r&&(c["Phone 1 - Value"]=r)}else if(o.startsWith("EMAIL")||o.includes(".EMAIL")){const r=(d=o.split(":")[1])==null?void 0:d.trim();r&&(c["E-mail 1 - Value"]=r)}else if(o.startsWith("ORG:")){const r=o.substring(4).trim();r&&(c.Notes=`Organization: ${r}`)}else if(o.startsWith("CATEGORIES:")){const r=o.substring(11).trim();r&&(c.Tags=r)}}),c}),C=e=>{const f=e["Given Name"]||e["First Name"]||e.firstName||"",x=e["Family Name"]||e["Last Name"]||e.lastName||"",n=e["E-mail 1 - Value"]||e.Email||e.email||void 0,c=e["Phone 1 - Value"]||e.Phone||e.phone||void 0,o=e.Notes||e.notes||void 0,u=e.tags||e.Tags||e.Groups||"";return{firstName:f.trim(),lastName:x.trim(),email:(n==null?void 0:n.trim())||void 0,phone:(c==null?void 0:c.trim())||void 0,notes:(o==null?void 0:o.trim())||void 0,tags:u?u.split("|").map(d=>d.trim()).filter(Boolean):[]}},me=()=>{const e=Q(),{importContacts:f}=U(),{fetchContacts:x}=K(),[n,c]=S.useState([]),[o,u]=S.useState(""),[d,r]=S.useState(new Set),[b,A]=S.useState(""),[I,O]=S.useState(new Set),E=H({mutationFn:t=>f(t),onSuccess:()=>{e.invalidateQueries({queryKey:Z.contacts}),alert("Import complete")}}),$=async t=>{if(!t)return;u(t.name);const i=await t.text(),a=i.includes("BEGIN:VCARD")?re(i):ne(i);c(a);const l=new Set;try{const N=(await x()).contacts;a.forEach((v,k)=>{const j=C(v);N.some(y=>{var D,F,T,G,P,B;return((D=y.firstName)==null?void 0:D.toLowerCase())===((F=j.firstName)==null?void 0:F.toLowerCase())&&((T=y.lastName)==null?void 0:T.toLowerCase())===((G=j.lastName)==null?void 0:G.toLowerCase())&&(((P=y.email)==null?void 0:P.toLowerCase())===((B=j.email)==null?void 0:B.toLowerCase())||y.phone===j.phone)})&&l.add(k)})}catch(m){console.error("Error checking for duplicates:",m)}O(l);const p=new Set;a.forEach((m,N)=>{const v=C(m),k=v.firstName&&v.lastName,j=v.email||v.phone,R=l.has(N);k&&j&&!R&&p.add(N)}),r(p)},M=t=>{var a;t.preventDefault();const i=(a=t.dataTransfer.files)==null?void 0:a[0];$(i??null)},W=n.map(C).filter(t=>t.firstName&&t.lastName),g=n.filter((t,i)=>{var N;const a=C(t),l=a.firstName&&a.lastName,p=a.email||a.phone;if(!l||!p||I.has(i))return!1;const m=((N=a.email)==null?void 0:N.toLowerCase())||"";return m.includes("@sale.craigslist")||m.includes("@reply.craigslist")||m.includes("noreply@")||m.includes("no-reply@")?!1:b?`${a.firstName} ${a.lastName} ${a.email||""} ${a.phone||""}`.toLowerCase().includes(b.toLowerCase()):!0}),w=g.map((t,i)=>{const a=n.indexOf(t);return{row:t,originalIndex:a}}).filter(({originalIndex:t})=>d.has(t)).map(({row:t})=>C(t)).filter(t=>t.firstName&&t.lastName),V=t=>{const i=new Set(d);i.has(t)?i.delete(t):i.add(t),r(i)},q=()=>{const t=new Set;g.forEach((i,a)=>{const l=n.indexOf(i),p=C(i);p.firstName&&p.lastName&&t.add(l)}),r(t)},z=()=>{r(new Set)};return s.jsxs(J,{children:[s.jsx("h2",{children:"Import Contacts"}),s.jsxs("p",{children:["Supports Google Takeout vCard (.vcf) files and CSV files.",s.jsx("br",{}),s.jsx("strong",{children:"Google Takeout:"})," Upload the .vcf file directly",s.jsx("br",{}),s.jsx("strong",{children:"CSV format:"})," Headers like"," ",s.jsx("code",{children:"Given Name, Family Name, E-mail 1 - Value, Phone 1 - Value, Notes"}),s.jsx("br",{}),s.jsx("strong",{children:"Custom CSV:"})," ",s.jsx("code",{children:"firstName,lastName,email,phone,notes,tags"})," (use"," ",s.jsx("code",{children:"|"})," to separate multiple tags)"]}),s.jsxs(X,{onDrop:M,onDragOver:t=>t.preventDefault(),children:[s.jsx("input",{type:"file",accept:".csv,.vcf,text/csv,text/vcard",style:{display:"none"},onChange:t=>{var i;return void $(((i=t.target.files)==null?void 0:i[0])??null)}}),"Drag & drop vCard (.vcf) or CSV file here, or click to select"]}),o&&s.jsxs("div",{children:[s.jsx("strong",{children:"Selected:"})," ",o," — ",n.length," rows parsed, ",W.length," valid contacts",n.length>g.length&&s.jsxs("span",{style:{color:"#666"},children:[" ","(",n.length-g.length," hidden: ",I.size," duplicates,"," ",n.length-g.length-I.size," incomplete/spam)"]})]}),n.length>0&&s.jsxs(s.Fragment,{children:[s.jsx("div",{children:s.jsx(Y,{type:"text",placeholder:"Filter contacts by name, email, or phone...",value:b,onChange:t=>A(t.target.value)})}),s.jsxs("div",{style:{display:"flex",gap:"8px",marginBottom:"16px"},children:[s.jsx(L,{onClick:q,children:"Select All"}),s.jsx(L,{onClick:z,children:"Select None"}),s.jsxs("div",{style:{marginLeft:"auto",color:"#666"},children:[w.length," of ",g.length," selected"]})]}),s.jsx(_,{children:g.map((t,i)=>{const a=n.indexOf(t),l=C(t),p=d.has(a);return l.firstName&&l.lastName?s.jsxs(ee,{selected:p,onClick:()=>V(a),children:[s.jsx(te,{type:"checkbox",checked:p,onChange:()=>V(a)}),s.jsxs(se,{children:[s.jsxs(oe,{children:[l.firstName," ",l.lastName]}),s.jsxs(ae,{children:[l.email&&s.jsxs("div",{children:["📧 ",l.email]}),l.phone&&s.jsxs("div",{children:["📞 ",l.phone]}),l.notes&&s.jsxs("div",{children:["📝 ",l.notes]})]})]})]},a):null})})]}),s.jsx(L,{disabled:!w.length||E.isPending,onClick:()=>E.mutate(w),children:E.isPending?"Importing…":`Import ${w.length} selected contacts`})]})};export{me as ImportPage};
