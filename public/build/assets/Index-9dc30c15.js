import{j as e,r as v,u as O,_ as k,a as i}from"./app-403ffb89.js";import{T as ie,M as ce,A as de,d as z}from"./AuthenticatedLayout-a47341c0.js";import{T as pe,a as r,b as ue,c as ge,d as A,e as he}from"./TableRow-91003df6.js";import{I as j}from"./IconButton-7b6c8a25.js";import{c as T,g as ee,a as te,s as P,b as R,d as oe,u as be,e as N,i as me}from"./Menu-d1a25a08.js";import{S as xe,I as Pe}from"./Select-b87f0a65.js";const D=T(e.jsx("path",{d:"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"}),"FirstPage"),K=T(e.jsx("path",{d:"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"}),"LastPage");function fe(t){return ee("MuiTableFooter",t)}te("MuiTableFooter",["root"]);const we=["className","component"],je=t=>{const{classes:o}=t;return oe({root:["root"]},fe,o)},Re=P("tfoot",{name:"MuiTableFooter",slot:"Root",overridesResolver:(t,o)=>o.root})({display:"table-footer-group"}),Ie={variant:"footer"},U="tfoot",Te=v.forwardRef(function(o,c){const d=O({props:o,name:"MuiTableFooter"}),{className:g,component:n=U}=d,m=k(d,we),a=i({},d,{component:n}),s=je(a);return e.jsx(pe.Provider,{value:Ie,children:e.jsx(Re,i({as:n,className:R(s.root,g),ref:c,role:n===U?null:"rowgroup",ownerState:a},m))})}),ve=Te,H=T(e.jsx("path",{d:"M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"}),"KeyboardArrowLeft"),E=T(e.jsx("path",{d:"M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"}),"KeyboardArrowRight");var G,W,J,Q,V,X,Y,Z;const Le=["backIconButtonProps","count","getItemAriaLabel","nextIconButtonProps","onPageChange","page","rowsPerPage","showFirstButton","showLastButton"],ye=v.forwardRef(function(o,c){const{backIconButtonProps:d,count:g,getItemAriaLabel:n,nextIconButtonProps:m,onPageChange:a,page:s,rowsPerPage:l,showFirstButton:L,showLastButton:y}=o,C=k(o,Le),w=be(),M=p=>{a(p,0)},S=p=>{a(p,s-1)},f=p=>{a(p,s+1)},x=p=>{a(p,Math.max(0,Math.ceil(g/l)-1))};return e.jsxs("div",i({ref:c},C,{children:[L&&e.jsx(j,{onClick:M,disabled:s===0,"aria-label":n("first",s),title:n("first",s),children:w.direction==="rtl"?G||(G=e.jsx(K,{})):W||(W=e.jsx(D,{}))}),e.jsx(j,i({onClick:S,disabled:s===0,color:"inherit","aria-label":n("previous",s),title:n("previous",s)},d,{children:w.direction==="rtl"?J||(J=e.jsx(E,{})):Q||(Q=e.jsx(H,{}))})),e.jsx(j,i({onClick:f,disabled:g!==-1?s>=Math.ceil(g/l)-1:!1,color:"inherit","aria-label":n("next",s),title:n("next",s)},m,{children:w.direction==="rtl"?V||(V=e.jsx(H,{})):X||(X=e.jsx(E,{}))})),y&&e.jsx(j,{onClick:x,disabled:s>=Math.ceil(g/l)-1,"aria-label":n("last",s),title:n("last",s),children:w.direction==="rtl"?Y||(Y=e.jsx(D,{})):Z||(Z=e.jsx(K,{}))})]}))}),Ce=ye;function Me(t){return ee("MuiTablePagination",t)}const Se=te("MuiTablePagination",["root","toolbar","spacer","selectLabel","selectRoot","select","selectIcon","input","menuItem","displayedRows","actions"]),I=Se;var q;const Be=["ActionsComponent","backIconButtonProps","className","colSpan","component","count","getItemAriaLabel","labelDisplayedRows","labelRowsPerPage","nextIconButtonProps","onPageChange","onRowsPerPageChange","page","rowsPerPage","rowsPerPageOptions","SelectProps","showFirstButton","showLastButton"],Ae=P(r,{name:"MuiTablePagination",slot:"Root",overridesResolver:(t,o)=>o.root})(({theme:t})=>({overflow:"auto",color:(t.vars||t).palette.text.primary,fontSize:t.typography.pxToRem(14),"&:last-child":{padding:0}})),ke=P(ie,{name:"MuiTablePagination",slot:"Toolbar",overridesResolver:(t,o)=>i({[`& .${I.actions}`]:o.actions},o.toolbar)})(({theme:t})=>({minHeight:52,paddingRight:2,[`${t.breakpoints.up("xs")} and (orientation: landscape)`]:{minHeight:52},[t.breakpoints.up("sm")]:{minHeight:52,paddingRight:2},[`& .${I.actions}`]:{flexShrink:0,marginLeft:20}})),_e=P("div",{name:"MuiTablePagination",slot:"Spacer",overridesResolver:(t,o)=>o.spacer})({flex:"1 1 100%"}),Fe=P("p",{name:"MuiTablePagination",slot:"SelectLabel",overridesResolver:(t,o)=>o.selectLabel})(({theme:t})=>i({},t.typography.body2,{flexShrink:0})),$e=P(xe,{name:"MuiTablePagination",slot:"Select",overridesResolver:(t,o)=>i({[`& .${I.selectIcon}`]:o.selectIcon,[`& .${I.select}`]:o.select},o.input,o.selectRoot)})({color:"inherit",fontSize:"inherit",flexShrink:0,marginRight:32,marginLeft:8,[`& .${I.select}`]:{paddingLeft:8,paddingRight:24,textAlign:"right",textAlignLast:"right"}}),ze=P(ce,{name:"MuiTablePagination",slot:"MenuItem",overridesResolver:(t,o)=>o.menuItem})({}),Ne=P("p",{name:"MuiTablePagination",slot:"DisplayedRows",overridesResolver:(t,o)=>o.displayedRows})(({theme:t})=>i({},t.typography.body2,{flexShrink:0}));function De({from:t,to:o,count:c}){return`${t}–${o} of ${c!==-1?c:`more than ${o}`}`}function Ke(t){return`Go to ${t} page`}const Ue=t=>{const{classes:o}=t;return oe({root:["root"],toolbar:["toolbar"],spacer:["spacer"],selectLabel:["selectLabel"],select:["select"],input:["input"],selectIcon:["selectIcon"],menuItem:["menuItem"],displayedRows:["displayedRows"],actions:["actions"]},Me,o)},He=v.forwardRef(function(o,c){const d=O({props:o,name:"MuiTablePagination"}),{ActionsComponent:g=Ce,backIconButtonProps:n,className:m,colSpan:a,component:s=r,count:l,getItemAriaLabel:L=Ke,labelDisplayedRows:y=De,labelRowsPerPage:C="Rows per page:",nextIconButtonProps:w,onPageChange:M,onRowsPerPageChange:S,page:f,rowsPerPage:x,rowsPerPageOptions:p=[10,25,50,100],SelectProps:h={},showFirstButton:ae=!1,showLastButton:se=!1}=d,ne=k(d,Be),B=d,u=Ue(B),_=h.native?"option":ze;let F;(s===r||s==="td")&&(F=a||1e3);const le=N(h.id),$=N(h.labelId),re=()=>l===-1?(f+1)*x:x===-1?l:Math.min(l,(f+1)*x);return e.jsx(Ae,i({colSpan:F,ref:c,as:s,ownerState:B,className:R(u.root,m)},ne,{children:e.jsxs(ke,{className:u.toolbar,children:[e.jsx(_e,{className:u.spacer}),p.length>1&&e.jsx(Fe,{className:u.selectLabel,id:$,children:C}),p.length>1&&e.jsx($e,i({variant:"standard"},!h.variant&&{input:q||(q=e.jsx(Pe,{}))},{value:x,onChange:S,id:le,labelId:$},h,{classes:i({},h.classes,{root:R(u.input,u.selectRoot,(h.classes||{}).root),select:R(u.select,(h.classes||{}).select),icon:R(u.selectIcon,(h.classes||{}).icon)}),children:p.map(b=>v.createElement(_,i({},!me(_)&&{ownerState:B},{className:u.menuItem,key:b.label?b.label:b,value:b.value?b.value:b}),b.label?b.label:b))})),e.jsx(Ne,{className:u.displayedRows,children:y({from:l===0?0:f*x+1,to:re(),count:l===-1?-1:l,page:f})}),e.jsx(g,{className:u.actions,backIconButtonProps:n,count:l,nextIconButtonProps:w,onPageChange:M,page:f,rowsPerPage:x,showFirstButton:ae,showLastButton:se,getItemAriaLabel:L})]})}))}),Ee=He,Ge=T(e.jsx("path",{d:"M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"}),"RemoveRedEye"),We=({acceptances:t,request:o})=>{const c=(o.page-1)*o.pageSize,d=a=>()=>z.Inertia.visit(route("acceptances.show",a)),g=(a,s)=>m(s+1,o.pageSize,o.filters),n=a=>m(1,a.target.value,o.filters),m=(a,s,l)=>z.Inertia.visit(route("acceptances.index"),{data:{page:a,pageSize:s,filters:l},only:["acceptances","request"]});return e.jsxs(ue,{children:[e.jsx(ge,{children:e.jsxs(A,{children:[e.jsx(r,{children:"#"}),e.jsx(r,{children:"Registered At"}),e.jsx(r,{children:"Lat Update At"}),e.jsx(r,{children:"Status"}),e.jsx(r,{children:"Action"})]})}),e.jsx(he,{children:t.data.map((a,s)=>e.jsxs(A,{children:[e.jsx(r,{children:c+s+1},"row-"+a.id),e.jsx(r,{children:new Date(a.created_at).toDateString()},"created_at-"+a.ie),e.jsx(r,{children:new Date(a.updated_at).toDateString()},"updated_at-"+a.ie),e.jsx(r,{children:a.status},"status-"+a.id),e.jsx(r,{children:e.jsx(j,{color:"primary",href:route("acceptances.show",a.id),onClick:d(a.id),children:e.jsx(Ge,{})})},"action-"+a.id)]},a.id))}),e.jsx(ve,{children:e.jsx(A,{children:e.jsx(Ee,{count:t.total,onPageChange:g,onRowsPerPageChange:n,page:t.current_page-1,rowsPerPage:t.per_page,rowsPerPageOptions:[100,20,10]})})})]})};We.layout=t=>e.jsx(de,{auth:t.props.auth,breadcrumbs:[{title:"Tests"}],children:t,head:"Tests"});export{We as default};