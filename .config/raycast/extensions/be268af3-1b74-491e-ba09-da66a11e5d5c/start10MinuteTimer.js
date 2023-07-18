"use strict";var f=Object.defineProperty;var $=Object.getOwnPropertyDescriptor;var D=Object.getOwnPropertyNames;var y=Object.prototype.hasOwnProperty;var w=(t,e)=>{for(var r in e)f(t,r,{get:e[r],enumerable:!0})},P=(t,e,r,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of D(e))!y.call(t,n)&&n!==r&&f(t,n,{get:()=>e[n],enumerable:!(a=$(e,n))||a.enumerable});return t};var O=t=>P(f({},"__esModule",{value:!0}),t);var C={};w(C,{default:()=>M});module.exports=O(C);var h=require("@raycast/api");var s=require("@raycast/api"),u=require("child_process");var i=require("fs");var p=t=>{let e=Math.floor(t/3600),r=String(Math.floor(t%3600/60)).padStart(2,"0"),a=String(Math.floor(t%60)).padStart(2,"0");return`${e}:${r}:${a}`};var F=s.environment.supportPath+"/customTimers.json",S=(t=!1)=>{let e=(0,s.getPreferenceValues)();if(parseFloat(e.volumeSetting)>5){let r="\u26A0\uFE0F Timer alert volume should not be louder than 5 (it can get quite loud!)";return t?(0,s.showHUD)(r):(0,s.showToast)({style:s.Toast.Style.Failure,title:r}),!1}return!0};async function T(t,e="Untitled",r="default"){let n=(s.environment.supportPath+"/"+new Date().toISOString()+"---"+t+".timer").replace(/:/g,"__");(0,i.writeFileSync)(n,e);let c=(0,s.getPreferenceValues)(),g=`${s.environment.assetsPath+"/"+(r==="default"?c.selectedSound:r)}`,o=[`sleep ${t}`];o.push(`if [ -f "${n}" ]; then osascript -e 'display notification "Timer \\"${e}\\" complete" with title "Ding!"'`);let d=`afplay "${g}" --volume ${c.volumeSetting.replace(",",".")}`;if(c.selectedSound==="speak_timer_name"?o.push(`say "${e}"`):o.push(d),c.ringContinuously){let m=`${n}`.replace(".timer",".dismiss");(0,i.writeFileSync)(m,".dismiss file for Timers"),o.push(`while [ -f "${m}" ]; do ${d}; done`)}o.push(`rm "${n}"; else echo "Timer deleted"; fi`),(0,u.exec)(o.join(" && "),(m,l)=>{if(m){console.log(`error: ${m.message}`);return}if(l){console.log(`stderr: ${l}`);return}}),(0,s.popToRoot)(),await(0,s.showHUD)(`Timer "${e}" started for ${p(t)}! \u{1F389}`)}var M=async()=>{S()&&(await(0,h.closeMainWindow)(),T(60*10,"10 Minute Timer"))};
