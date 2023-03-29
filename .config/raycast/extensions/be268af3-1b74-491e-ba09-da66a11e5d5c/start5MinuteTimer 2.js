"use strict";var f=Object.defineProperty;var h=Object.getOwnPropertyDescriptor;var $=Object.getOwnPropertyNames;var D=Object.prototype.hasOwnProperty;var y=(t,e)=>{for(var r in e)f(t,r,{get:e[r],enumerable:!0})},w=(t,e,r,m)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of $(e))!D.call(t,s)&&s!==r&&f(t,s,{get:()=>e[s],enumerable:!(m=h(e,s))||m.enumerable});return t};var P=t=>w(f({},"__esModule",{value:!0}),t);var M={};y(M,{default:()=>C});module.exports=P(M);var S=require("@raycast/api");var i=require("@raycast/api"),d=require("child_process");var o=require("fs");var l=t=>{let e=Math.floor(t/3600),r=String(Math.floor(t%3600/60)).padStart(2,"0"),m=String(Math.floor(t%60)).padStart(2,"0");return`${e}:${r}:${m}`};var _=i.environment.supportPath+"/customTimers.json";async function T(t,e="Untitled",r="default"){let s=(i.environment.supportPath+"/"+new Date().toISOString()+"---"+t+".timer").replace(/:/g,"__");(0,o.writeFileSync)(s,e);let c=(0,i.getPreferenceValues)(),g=`${i.environment.assetsPath+"/"+(r==="default"?c.selectedSound:r)}`,n=[`sleep ${t}`];n.push(`if [ -f "${s}" ]; then osascript -e 'display notification "Timer \\"${e}\\" complete" with title "Ding!"'`);let u=`afplay "${g}" --volume ${c.volumeSetting.replace(",",".")}`;if(c.selectedSound==="speak_timer_name"?n.push(`say "${e}"`):n.push(u),c.ringContinuously){let a=`${s}`.replace(".timer",".dismiss");(0,o.writeFileSync)(a,".dismiss file for Timers"),n.push(`while [ -f "${a}" ]; do ${u}; done`)}n.push(`rm "${s}"; else echo "Timer deleted"; fi`),(0,d.exec)(n.join(" && "),(a,p)=>{if(a){console.log(`error: ${a.message}`);return}if(p){console.log(`stderr: ${p}`);return}}),(0,i.popToRoot)(),await(0,i.showHUD)(`Timer "${e}" started for ${l(t)}! \u{1F389}`)}var C=async()=>{await(0,S.closeMainWindow)(),T(60*5,"5 Minute Timer")};0&&(module.exports={});
