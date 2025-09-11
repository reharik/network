import{f as q,g as P,a as D,r as m,j as e,h as o}from"./index-BFw5mKhb.js";import{u as E}from"./useQuery-Dqc1InEi.js";import{u as v}from"./mappers-Et_TSE1t.js";import{u as Q}from"./useContactService-BUIZEp1O.js";import{q as c}from"./keys-kIXIRbY9.js";const L=o.section`
  background: #0e1220;
  border: 1px solid ${({theme:t})=>t.colors.border};
  border-radius: 16px;
  padding: 20px;
  display: grid;
  gap: 16px;
`,a=o.div`
  display: grid;
  gap: 6px;
`,i=o.label`
  font-size: 12px;
  color: ${({theme:t})=>t.colors.subtext};
  letter-spacing: 0.4px;
  text-transform: uppercase;
`,l=o.input`
  background: #0a0d17;
  border: 1px solid ${({theme:t})=>t.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  color: ${({theme:t})=>t.colors.text};
`,M=o.textarea`
  background: #0a0d17;
  border: 1px solid ${({theme:t})=>t.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  color: ${({theme:t})=>t.colors.text};
  min-height: 96px;
`,g=o.div`
  display: flex;
  gap: 12px;
`,f=o.button`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid ${({theme:t})=>t.colors.border};
  background: ${({danger:t})=>t?"#2a0e13":"#0f1424"};
  color: ${({theme:t})=>t.colors.text};
  cursor: pointer;
  &:hover {
    filter: brightness(1.1);
  }
`,w=()=>{const{id:t=""}=q(),j=P(),x=D(),{getContact:y,updateContact:C,deleteContact:N}=Q(),{data:n,isLoading:F,isError:k}=E({queryKey:c.contact(t),queryFn:()=>y(t),enabled:!!t}),[s,b]=m.useState(null);m.useEffect(()=>{n&&b(n)},[n]);const r=d=>S=>b(h=>h&&{...h,[d]:S.target.value}),$=m.useMemo(()=>JSON.stringify(n??{})!==JSON.stringify(s??{}),[n,s]),u=v({mutationFn:C,onSuccess:d=>{x.setQueryData(c.contact(d.id),d),x.invalidateQueries({queryKey:c.contacts})}}),p=v({mutationFn:()=>N(t),onSuccess:()=>{x.invalidateQueries({queryKey:c.contacts}),j("/contacts")}});return F?e.jsx("div",{children:"Loading…"}):k||!s?e.jsx("div",{children:"Contact not found."}):e.jsxs(L,{children:[e.jsxs("h2",{children:[s.firstName," ",s.lastName]}),e.jsxs(g,{children:[e.jsxs(a,{children:[e.jsx(i,{htmlFor:"firstName",children:"First name"}),e.jsx(l,{id:"firstName",value:s.firstName,onChange:r("firstName")})]}),e.jsxs(a,{children:[e.jsx(i,{htmlFor:"lastName",children:"Last name"}),e.jsx(l,{id:"lastName",value:s.lastName,onChange:r("lastName")})]})]}),e.jsxs(g,{children:[e.jsxs(a,{style:{flex:1},children:[e.jsx(i,{htmlFor:"email",children:"Email"}),e.jsx(l,{id:"email",value:s.email??"",onChange:r("email")})]}),e.jsxs(a,{style:{flex:1},children:[e.jsx(i,{htmlFor:"phone",children:"Phone"}),e.jsx(l,{id:"phone",value:s.phone??"",onChange:r("phone")})]})]}),e.jsxs(a,{children:[e.jsx(i,{htmlFor:"notes",children:"Notes"}),e.jsx(M,{id:"notes",value:s.notes??"",onChange:r("notes")})]}),e.jsxs(g,{children:[e.jsx(f,{onClick:()=>s&&u.mutate({...s,id:s.id}),disabled:!$||u.isPending,children:u.isPending?"Saving…":"Save changes"}),e.jsx(f,{danger:!0,onClick:()=>p.mutate(),disabled:p.isPending,children:p.isPending?"Deleting…":"Delete contact"}),e.jsx(f,{onClick:()=>j("/contacts"),children:"Back to contacts"})]})]})};export{w as ContactDetail};
