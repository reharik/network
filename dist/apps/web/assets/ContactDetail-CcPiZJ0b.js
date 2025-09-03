import{d as k,e as $,u as q,r as m,j as e,f as o}from"./index-BhI8Pxlq.js";import{u as S}from"./useQuery-BOvoIR13.js";import{u as v}from"./useMutation-DexDYsTq.js";import{u as P,q as c,d as D,g as E}from"./keys-D9GUwjRo.js";import"./api-Qa43F_vh.js";const Q=o.section`
  background: #0e1220;
  border: 1px solid ${({theme:s})=>s.colors.border};
  border-radius: 16px;
  padding: 20px;
  display: grid;
  gap: 16px;
`,a=o.div`
  display: grid;
  gap: 6px;
`,i=o.label`
  font-size: 12px;
  color: ${({theme:s})=>s.colors.subtext};
  letter-spacing: 0.4px;
  text-transform: uppercase;
`,l=o.input`
  background: #0a0d17;
  border: 1px solid ${({theme:s})=>s.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  color: ${({theme:s})=>s.colors.text};
`,L=o.textarea`
  background: #0a0d17;
  border: 1px solid ${({theme:s})=>s.colors.border};
  border-radius: 10px;
  padding: 10px 12px;
  color: ${({theme:s})=>s.colors.text};
  min-height: 96px;
`,g=o.div`
  display: flex;
  gap: 12px;
`,j=o.button`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid ${({theme:s})=>s.colors.border};
  background: ${({danger:s})=>s?"#2a0e13":"#0f1424"};
  color: ${({theme:s})=>s.colors.text};
  cursor: pointer;
  &:hover {
    filter: brightness(1.1);
  }
`,R=()=>{const{id:s=""}=k(),f=$(),x=q(),{data:n,isLoading:y,isError:C}=S({queryKey:c.contact(s),queryFn:()=>E(s),enabled:!!s}),[t,b]=m.useState(null);m.useEffect(()=>{n&&b(n)},[n]);const r=d=>F=>b(h=>h&&{...h,[d]:F.target.value}),N=m.useMemo(()=>JSON.stringify(n??{})!==JSON.stringify(t??{}),[n,t]),u=v({mutationFn:P,onSuccess:d=>{x.setQueryData(c.contact(d.id),d),x.invalidateQueries({queryKey:c.contacts})}}),p=v({mutationFn:()=>D(s),onSuccess:()=>{x.invalidateQueries({queryKey:c.contacts}),f("/contacts")}});return y?e.jsx("div",{children:"Loading…"}):C||!t?e.jsx("div",{children:"Contact not found."}):e.jsxs(Q,{children:[e.jsxs("h2",{children:[t.firstName," ",t.lastName]}),e.jsxs(g,{children:[e.jsxs(a,{children:[e.jsx(i,{htmlFor:"firstName",children:"First name"}),e.jsx(l,{id:"firstName",value:t.firstName,onChange:r("firstName")})]}),e.jsxs(a,{children:[e.jsx(i,{htmlFor:"lastName",children:"Last name"}),e.jsx(l,{id:"lastName",value:t.lastName,onChange:r("lastName")})]})]}),e.jsxs(g,{children:[e.jsxs(a,{style:{flex:1},children:[e.jsx(i,{htmlFor:"email",children:"Email"}),e.jsx(l,{id:"email",value:t.email??"",onChange:r("email")})]}),e.jsxs(a,{style:{flex:1},children:[e.jsx(i,{htmlFor:"phone",children:"Phone"}),e.jsx(l,{id:"phone",value:t.phone??"",onChange:r("phone")})]})]}),e.jsxs(a,{children:[e.jsx(i,{htmlFor:"notes",children:"Notes"}),e.jsx(L,{id:"notes",value:t.notes??"",onChange:r("notes")})]}),e.jsxs(g,{children:[e.jsx(j,{onClick:()=>t&&u.mutate({...t,id:t.id}),disabled:!N||u.isPending,children:u.isPending?"Saving…":"Save changes"}),e.jsx(j,{danger:!0,onClick:()=>p.mutate(),disabled:p.isPending,children:p.isPending?"Deleting…":"Delete contact"}),e.jsx(j,{onClick:()=>f("/contacts"),children:"Back to contacts"})]})]})};export{R as ContactDetail};
