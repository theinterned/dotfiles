"use strict";var w=Object.defineProperty;var A=Object.getOwnPropertyDescriptor;var I=Object.getOwnPropertyNames;var k=Object.prototype.hasOwnProperty;var H=(r,t)=>{for(var n in t)w(r,n,{get:t[n],enumerable:!0})},J=(r,t,n,u)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of I(t))!k.call(r,s)&&s!==n&&w(r,s,{get:()=>t[s],enumerable:!(u=A(t,s))||u.enumerable});return r};var _=r=>J(w({},"__esModule",{value:!0}),r);var B={};H(B,{default:()=>x});module.exports=_(B);var o=require("@raycast/api"),N=require("react");var f=require("@raycast/api"),C=[{title:"Alarm Clock",icon:f.Icon.Alarm,value:"alarmClock.wav"},{title:"Dismembered Woodpecker",icon:f.Icon.Bird,value:"dismemberedWoodpecker.wav"},{title:"Flute Riff",icon:f.Icon.Music,value:"fluteRiff.wav"},{title:"Level Up",icon:f.Icon.Trophy,value:"levelUp.wav"},{title:"Piano Chime",icon:f.Icon.Music,value:"pianoChime.wav"},{title:"Terminator",icon:f.Icon.BarCode,value:"terminator.wav"},{title:"Speak Timer Name",icon:f.Icon.Person,value:"speak_timer_name"}];var i=require("@raycast/api"),v=require("child_process"),E=require("crypto"),l=require("fs");var P=r=>{let t=Math.floor(r/3600),n=String(Math.floor(r%3600/60)).padStart(2,"0"),u=String(Math.floor(r%60)).padStart(2,"0");return`${t}:${n}:${u}`};var T=i.environment.supportPath+"/customTimers.json",M=(r=!1)=>{let t=(0,i.getPreferenceValues)();if(parseFloat(t.volumeSetting)>5){let n="\u26A0\uFE0F Timer alert volume should not be louder than 5 (it can get quite loud!)";return r?(0,i.showHUD)(n):(0,i.showToast)({style:i.Toast.Style.Failure,title:n}),!1}return!0};async function O(r,t="Untitled",n="default"){(0,i.popToRoot)();let s=(i.environment.supportPath+"/"+new Date().toISOString()+"---"+r+".timer").replace(/:/g,"__");(0,l.writeFileSync)(s,t);let c=(0,i.getPreferenceValues)(),h=`${i.environment.assetsPath+"/"+(n==="default"?c.selectedSound:n)}`,d=[`sleep ${r}`];d.push(`if [ -f "${s}" ]; then osascript -e 'display notification "Timer \\"${t}\\" complete" with title "Ding!"'`);let S=`afplay "${h}" --volume ${c.volumeSetting.replace(",",".")}`;if(c.selectedSound==="speak_timer_name"?d.push(`say "${t}"`):d.push(S),c.ringContinuously){let p=`${s}`.replace(".timer",".dismiss");(0,l.writeFileSync)(p,".dismiss file for Timers"),d.push(`while [ -f "${p}" ]; do ${S}; done`)}d.push(`rm "${s}"; else echo "Timer deleted"; fi`),(0,v.exec)(d.join(" && "),(p,g)=>{if(p){console.log(`error: ${p.message}`);return}if(g){console.log(`stderr: ${g}`);return}}),await(0,i.showHUD)(`Timer "${t}" started for ${P(r)}! \u{1F389}`)}function D(){(0,l.existsSync)(T)||(0,l.writeFileSync)(T,JSON.stringify({}))}function V(r){D();let t=JSON.parse((0,l.readFileSync)(T,"utf8"));t[(0,E.randomUUID)()]=r,(0,l.writeFileSync)(T,JSON.stringify(t))}var m=require("react/jsx-runtime");function x(r){let t=Object.values(r.arguments).some(e=>e!==""),[n,u]=(0,N.useState)(),[s,c]=(0,N.useState)(),[h,d]=(0,N.useState)(),S=(0,o.getPreferenceValues)(),p=e=>{if(D(),e.hours===""&&e.minutes===""&&e.seconds==="")new o.Toast({style:o.Toast.Style.Failure,title:"No values set for timer length!"}).show();else if(isNaN(Number(e.hours)))u("Hours must be a number!");else if(isNaN(Number(e.minutes)))c("Minutes must be a number!");else if(isNaN(Number(e.seconds)))d("Seconds must be a number!");else{if(!M())return;(0,o.closeMainWindow)();let a=e.name?e.name:"Untitled",$=3600*Number(e.hours)+60*Number(e.minutes)+Number(e.seconds);O($,a,e.selectedSound),e.willBeSaved&&V({name:e.name,timeInSeconds:$,selectedSound:e.selectedSound})}},g=()=>{n&&n.length>0&&u(void 0)},y=()=>{s&&s.length>0&&c(void 0)},F=()=>{h&&h.length>0&&d(void 0)},b=[{id:"hours",title:"Hours",placeholder:"0",err:n,drop:g,validator:e=>{let a=e.target.value;isNaN(Number(a))?u("Hours must be a number!"):g()}},{id:"minutes",title:"Minutes",placeholder:"00",err:s,drop:y,validator:e=>{let a=e.target.value;isNaN(Number(a))?c("Minutes must be a number!"):y()}},{id:"seconds",title:"Seconds",placeholder:"00",err:h,drop:F,validator:e=>{let a=e.target.value;isNaN(Number(a))?d("Seconds must be a number!"):F()}}];return S.newTimerInputOrder!=="hhmmss"&&b.reverse(),(0,m.jsxs)(o.Form,{actions:(0,m.jsx)(o.ActionPanel,{children:(0,m.jsx)(o.Action.SubmitForm,{title:"Start Custom Timer",onSubmit:e=>p(e)})}),children:[b.map((e,a)=>(0,m.jsx)(o.Form.TextField,{id:e.id,title:e.title,placeholder:e.placeholder,defaultValue:r.arguments[e.id],error:e.err,onChange:e.drop,onBlur:e.validator},a)),(0,m.jsxs)(o.Form.Dropdown,{id:"selectedSound",defaultValue:"default",title:"Sound",children:[(0,m.jsx)(o.Form.Dropdown.Item,{value:"default",title:"Default"}),C.map((e,a)=>(0,m.jsx)(o.Form.Dropdown.Item,{title:e.value===S.selectedSound?`${e.title} (currently selected)`:e.title,value:e.value,icon:e.icon},a))]}),(0,m.jsx)(o.Form.TextField,{id:"name",title:"Name",placeholder:"Pour Tea",autoFocus:t}),(0,m.jsx)(o.Form.Checkbox,{id:"willBeSaved",label:"Save as preset"})]})}
