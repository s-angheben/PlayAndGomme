import{S as w,i as y,s as z,e as E,t as v,c as d,a as b,h as P,d as o,g as n,J as R,j as N,k as S,l as C,m as j,n as H}from"./chunks/index-9b6b3a71.js";function J(r){let l,t=r[1].frame+"",a;return{c(){l=E("pre"),a=v(t)},l(f){l=d(f,"PRE",{});var s=b(l);a=P(s,t),s.forEach(o)},m(f,s){n(f,l,s),R(l,a)},p(f,s){s&2&&t!==(t=f[1].frame+"")&&N(a,t)},d(f){f&&o(l)}}}function h(r){let l,t=r[1].stack+"",a;return{c(){l=E("pre"),a=v(t)},l(f){l=d(f,"PRE",{});var s=b(l);a=P(s,t),s.forEach(o)},m(f,s){n(f,l,s),R(l,a)},p(f,s){s&2&&t!==(t=f[1].stack+"")&&N(a,t)},d(f){f&&o(l)}}}function A(r){let l,t,a,f,s=r[1].message+"",c,k,u,p,i=r[1].frame&&J(r),_=r[1].stack&&h(r);return{c(){l=E("h1"),t=v(r[0]),a=S(),f=E("pre"),c=v(s),k=S(),i&&i.c(),u=S(),_&&_.c(),p=C()},l(e){l=d(e,"H1",{});var m=b(l);t=P(m,r[0]),m.forEach(o),a=j(e),f=d(e,"PRE",{});var q=b(f);c=P(q,s),q.forEach(o),k=j(e),i&&i.l(e),u=j(e),_&&_.l(e),p=C()},m(e,m){n(e,l,m),R(l,t),n(e,a,m),n(e,f,m),R(f,c),n(e,k,m),i&&i.m(e,m),n(e,u,m),_&&_.m(e,m),n(e,p,m)},p(e,[m]){m&1&&N(t,e[0]),m&2&&s!==(s=e[1].message+"")&&N(c,s),e[1].frame?i?i.p(e,m):(i=J(e),i.c(),i.m(u.parentNode,u)):i&&(i.d(1),i=null),e[1].stack?_?_.p(e,m):(_=h(e),_.c(),_.m(p.parentNode,p)):_&&(_.d(1),_=null)},i:H,o:H,d(e){e&&o(l),e&&o(a),e&&o(f),e&&o(k),i&&i.d(e),e&&o(u),_&&_.d(e),e&&o(p)}}}function F({error:r,status:l}){return{props:{error:r,status:l}}}function B(r,l,t){let{status:a}=l,{error:f}=l;return r.$$set=s=>{"status"in s&&t(0,a=s.status),"error"in s&&t(1,f=s.error)},[a,f]}class G extends w{constructor(l){super(),y(this,l,B,A,z,{status:0,error:1})}}export{G as default,F as load};
