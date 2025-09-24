import{f as q,g as P,a as D,r as m,j as e,h as n}from"./index-9bKELV1L.js";import{u as E}from"./useQuery-Cz8LaG0o.js";import{u as v}from"./useMutation-DOcVeEDd.js";import{u as Q}from"./useContactService-BPabvCE3.js";import{q as d}from"./keys-kIXIRbY9.js";const L=n.section`
  background: #0e1220;
  border: 1px solid ${({theme:s})=>s.colors.border};
  border-radius: 16px;
  padding: 20px;
  display: grid;
  gap: 16px;
`,i=n.div`
  display: grid;
  gap: 6px;
`,c=n.label`
  font-size: 12px;
  color: ${({theme:s})=>s.colors.subtext};
  letter-spacing: 0.4px;
  text-transform: uppercase;
`,l=n.input`
  background: #0a0d17;
  border: 1px solid ${({theme:s})=>s.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  color: ${({theme:s})=>s.colors.text};
`,M=n.textarea`
  background: #0a0d17;
  border: 1px solid ${({theme:s})=>s.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  color: ${({theme:s})=>s.colors.text};
  min-height: 96px;
`,g=n.div`
  display: flex;
  gap: 12px;
`,f=n.button`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid ${({theme:s})=>s.colors.border};
  background: ${({danger:s})=>s?"#2a0e13":"#0f1424"};
  color: ${({theme:s})=>s.colors.text};
  cursor: pointer;
  &:hover {
    filter: brightness(1.1);
  }
`,w=()=>{const{id:s=""}=q(),j=P(),x=D(),{getContact:y,updateContact:C,deleteContact:N}=Q(),{data:o,isLoading:F,isError:k}=E({queryKey:d.contact(s),queryFn:()=>y(s),enabled:!!s}),[t,b]=m.useState(void 0);m.useEffect(()=>{o!=null&&o.success&&b(o.data)},[o]);const a=r=>S=>b(h=>h&&{...h,[r]:S.target.value}),$=m.useMemo(()=>(o==null?void 0:o.success)&&JSON.stringify((o==null?void 0:o.data)??{})!==JSON.stringify(t??{}),[o,t]),u=v({mutationFn:C,onSuccess:r=>{r.success&&(x.setQueryData(d.contact(r.data.id),r),x.invalidateQueries({queryKey:d.contacts}))}}),p=v({mutationFn:()=>N(s),onSuccess:()=>{x.invalidateQueries({queryKey:d.contacts}),j("/contacts")}});return F?e.jsx("div",{children:"Loading…"}):k||!t?e.jsx("div",{children:"Contact not found."}):e.jsxs(L,{children:[e.jsxs("h2",{children:[t.firstName," ",t.lastName]}),e.jsxs(g,{children:[e.jsxs(i,{children:[e.jsx(c,{htmlFor:"firstName",children:"First name"}),e.jsx(l,{id:"firstName",value:t.firstName,onChange:a("firstName")})]}),e.jsxs(i,{children:[e.jsx(c,{htmlFor:"lastName",children:"Last name"}),e.jsx(l,{id:"lastName",value:t.lastName,onChange:a("lastName")})]})]}),e.jsxs(g,{children:[e.jsxs(i,{style:{flex:1},children:[e.jsx(c,{htmlFor:"email",children:"Email"}),e.jsx(l,{id:"email",value:t.email??"",onChange:a("email")})]}),e.jsxs(i,{style:{flex:1},children:[e.jsx(c,{htmlFor:"phone",children:"Phone"}),e.jsx(l,{id:"phone",value:t.phone??"",onChange:a("phone")})]})]}),e.jsxs(i,{children:[e.jsx(c,{htmlFor:"notes",children:"Notes"}),e.jsx(M,{id:"notes",value:t.notes??"",onChange:a("notes")})]}),e.jsxs(g,{children:[e.jsx(f,{onClick:()=>t&&u.mutate({...t,id:t.id}),disabled:!$||u.isPending,children:u.isPending?"Saving…":"Save changes"}),e.jsx(f,{danger:!0,onClick:()=>p.mutate(),disabled:p.isPending,children:p.isPending?"Deleting…":"Delete contact"}),e.jsx(f,{onClick:()=>j("/contacts"),children:"Back to contacts"})]})]})};export{w as ContactDetail};
