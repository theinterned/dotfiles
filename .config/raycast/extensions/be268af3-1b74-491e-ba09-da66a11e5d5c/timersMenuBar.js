"use strict";var M=Object.defineProperty;var F=Object.getOwnPropertyDescriptor;var J=Object.getOwnPropertyNames;var b=Object.prototype.hasOwnProperty;var E=(e,t)=>{for(var n in t)M(e,n,{get:t[n],enumerable:!0})},_=(e,t,n,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of J(t))!b.call(e,r)&&r!==n&&M(e,r,{get:()=>t[r],enumerable:!(i=F(t,r))||i.enumerable});return e};var v=e=>_(M({},"__esModule",{value:!0}),e);var U={};E(U,{default:()=>w});module.exports=v(U);var s=require("@raycast/api"),N=require("react");var L=require("@raycast/api"),C=require("react");var l=require("@raycast/api"),g=require("child_process"),I=require("crypto"),m=require("fs"),P=require("path");var S=e=>{let t=Math.floor(e/3600),n=String(Math.floor(e%3600/60)).padStart(2,"0"),i=String(Math.floor(e%60)).padStart(2,"0");return`${t}:${n}:${i}`};var d=l.environment.supportPath+"/customTimers.json";async function $(e,t="Untitled"){let i=(l.environment.supportPath+"/"+new Date().toISOString()+"---"+e+".timer").replace(/:/g,"__");(0,m.writeFileSync)(i,t);let r=(0,l.getPreferenceValues)(),f=`${l.environment.assetsPath+"/"+r.selectedSound}`,a=`sleep ${e} && if [ -f "${i}" ]; then `;if(r.selectedSound==="speak_timer_name"?a+=`say "${t}"`:a+=`afplay "${f}"`,r.ringContinuously){let o=`${i}`.replace(".timer",".dismiss");(0,m.writeFileSync)(o,".dismiss file for Timers"),a+=` && while [ -f "${o}" ]; do afplay "${f}"; done`}a+=` && osascript -e 'display notification "'"Timer complete"'" with title "Ding!"' && rm "${i}"; else echo "Timer deleted"; fi`,(0,g.exec)(a,(o,p)=>{if(o){console.log(`error: ${o.message}`);return}if(p){console.log(`stderr: ${p}`);return}}),(0,l.popToRoot)(),await(0,l.showHUD)(`Timer "${t}" started for ${S(e)}! \u{1F389}`)}function k(e){let t=`if [ -f "${e}" ]; then rm "${e}"; else echo "Timer deleted"; fi`,n=e.replace(".timer",".dismiss"),i=`if [ -f "${n}" ]; then rm "${n}"; else echo "Timer deleted"; fi`;(0,g.execSync)(t),(0,g.execSync)(i)}function O(){let e=[];return(0,m.readdirSync)(l.environment.supportPath).forEach(n=>{if((0,P.extname)(n)==".timer"){let i={name:"",secondsSet:-99,timeLeft:-99,originalFile:n};i.name=(0,m.readFileSync)(l.environment.supportPath+"/"+n).toString();let r=n.split("---");i.secondsSet=Number(r[1].split(".")[0]);let f=r[0].replace(/__/g,":");i.timeLeft=Math.max(0,Math.round(i.secondsSet-(new Date().getTime()-new Date(f).getTime())/1e3)),e.push(i)}}),e.sort((n,i)=>n.timeLeft-i.timeLeft),e}function h(){(0,m.existsSync)(d)||(0,m.writeFileSync)(d,JSON.stringify({}))}function x(e){h();let t=JSON.parse((0,m.readFileSync)(d,"utf8"));t[(0,I.randomUUID)()]=e,(0,m.writeFileSync)(d,JSON.stringify(t))}function A(){return h(),JSON.parse((0,m.readFileSync)(d,"utf8"))}function D(e){h();let t=JSON.parse((0,m.readFileSync)(d,"utf8"));delete t[e],(0,m.writeFileSync)(d,JSON.stringify(t))}function y(){let[e,t]=(0,C.useState)(void 0),[n,i]=(0,C.useState)({}),[r,f]=(0,C.useState)(e===void 0),a=()=>{h();let c=O();t(c);let T=A();i(T),f(!1)};return{timers:e,customTimers:n,isLoading:r,refreshTimers:a,handleStartTimer:(c,T)=>{$(c,T),a()},handleStopTimer:c=>{t(e?.filter(T=>T.originalFile!==c.originalFile)),k(`${L.environment.supportPath}/${c.originalFile}`),a()},handleStartCT:c=>{$(c.timeInSeconds,c.name),a()},handleCreateCT:c=>{let T={name:c.name,timeInSeconds:c.secondsSet};x(T),a()},handleDeleteCT:c=>{D(c),a()}}}var u=require("react/jsx-runtime");function w(){let{timers:e,customTimers:t,isLoading:n,refreshTimers:i,handleStartTimer:r,handleStopTimer:f,handleStartCT:a}=y();return(0,N.useEffect)(()=>{i(),setInterval(()=>{i()},1e3)},[]),(0,u.jsxs)(s.MenuBarExtra,{icon:s.Icon.Clock,isLoading:n,title:e!=null&&e?.length>0?`${e[0].name}: ~${S(e[0].timeLeft)}`:void 0,children:[(0,u.jsx)(s.MenuBarExtra.Item,{title:"Click running timer to stop"}),e?.map(o=>(0,u.jsx)(s.MenuBarExtra.Item,{title:o.name+": "+S(o.timeLeft)+" left",onAction:()=>f(o)},o.originalFile)),(0,u.jsx)(s.MenuBarExtra.Separator,{}),Object.keys(t)?.sort((o,p)=>t[o].timeInSeconds-t[p].timeInSeconds).map(o=>(0,u.jsx)(s.MenuBarExtra.Item,{title:'Start "'+t[o].name+'"',onAction:()=>a(t[o])},o)),(0,u.jsx)(s.MenuBarExtra.Separator,{}),(0,u.jsx)(s.MenuBarExtra.Item,{title:"Start 5 Minute Timer",onAction:()=>r(60*5,"5 Minute Timer")},"5M"),(0,u.jsx)(s.MenuBarExtra.Item,{title:"Start 10 Minute Timer",onAction:()=>r(60*10,"10 Minute Timer")},"10M"),(0,u.jsx)(s.MenuBarExtra.Item,{title:"Start 15 Minute Timer",onAction:()=>r(60*15,"15 Minute Timer")},"15M"),(0,u.jsx)(s.MenuBarExtra.Item,{title:"Start 30 Minute Timer",onAction:()=>r(60*30,"30 Minute Timer")},"30M"),(0,u.jsx)(s.MenuBarExtra.Item,{title:"Start 45 Minute Timer",onAction:()=>r(60*45,"45 Minute Timer")},"45M"),(0,u.jsx)(s.MenuBarExtra.Item,{title:"Start 60 Minute Timer",onAction:()=>r(60*60,"60 Minute Timer")},"60M"),(0,u.jsx)(s.MenuBarExtra.Item,{title:"Start 90 Minute Timer",onAction:()=>r(60*60*1.5,"90 Minute Timer")},"90M")]})}0&&(module.exports={});
