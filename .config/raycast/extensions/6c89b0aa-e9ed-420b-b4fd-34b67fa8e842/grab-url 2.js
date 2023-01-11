"use strict";var D=Object.create;var d=Object.defineProperty;var z=Object.getOwnPropertyDescriptor;var N=Object.getOwnPropertyNames;var X=Object.getPrototypeOf,V=Object.prototype.hasOwnProperty;var m=(e,r)=>()=>(r||e((r={exports:{}}).exports,r),r.exports),K=(e,r)=>{for(var t in r)d(e,t,{get:r[t],enumerable:!0})},S=(e,r,t,o)=>{if(r&&typeof r=="object"||typeof r=="function")for(let n of N(r))!V.call(e,n)&&n!==t&&d(e,n,{get:()=>r[n],enumerable:!(o=z(r,n))||o.enumerable});return e};var j=(e,r,t)=>(t=e!=null?D(X(e)):{},S(r||!e||!e.__esModule?d(t,"default",{value:e,enumerable:!0}):t,e)),Y=e=>S(d({},"__esModule",{value:!0}),e);var y=m((ce,C)=>{"use strict";var _=require("fs"),x;function H(){try{return _.statSync("/.dockerenv"),!0}catch{return!1}}function J(){try{return _.readFileSync("/proc/self/cgroup","utf8").includes("docker")}catch{return!1}}C.exports=()=>(x===void 0&&(x=H()||J()),x)});var v=m((ue,P)=>{"use strict";var Q=require("os"),Z=require("fs"),T=y(),k=()=>{if(process.platform!=="linux")return!1;if(Q.release().toLowerCase().includes("microsoft"))return!T();try{return Z.readFileSync("/proc/version","utf8").toLowerCase().includes("microsoft")?!T():!1}catch{return!1}};process.env.__IS_WSL_TEST__?P.exports=k:P.exports=k()});var $=m((le,O)=>{"use strict";O.exports=(e,r,t)=>{let o=n=>Object.defineProperty(e,r,{value:n,enumerable:!0,writable:!0});return Object.defineProperty(e,r,{configurable:!0,enumerable:!0,get(){let n=t();return o(n),n},set(n){o(n)}}),e}});var I=m((fe,U)=>{var ee=require("path"),re=require("child_process"),{promises:A,constants:R}=require("fs"),g=v(),te=y(),b=$(),q=ee.join(__dirname,"xdg-open"),{platform:l,arch:L}=process,ne=(()=>{let e="/mnt/",r;return async function(){if(r)return r;let t="/etc/wsl.conf",o=!1;try{await A.access(t,R.F_OK),o=!0}catch{}if(!o)return e;let n=await A.readFile(t,{encoding:"utf8"}),u=/(?<!#.*)root\s*=\s*(?<mountPoint>.*)/g.exec(n);return u?(r=u.groups.mountPoint.trim(),r=r.endsWith("/")?r:`${r}/`,r):e}})(),W=async(e,r)=>{let t;for(let o of e)try{return await r(o)}catch(n){t=n}throw t},h=async e=>{if(e={wait:!1,background:!1,newInstance:!1,allowNonzeroExitCode:!1,...e},Array.isArray(e.app))return W(e.app,a=>h({...e,app:a}));let{name:r,arguments:t=[]}=e.app||{};if(t=[...t],Array.isArray(r))return W(r,a=>h({...e,app:{name:a,arguments:t}}));let o,n=[],u={};if(l==="darwin")o="open",e.wait&&n.push("--wait-apps"),e.background&&n.push("--background"),e.newInstance&&n.push("--new"),r&&n.push("-a",r);else if(l==="win32"||g&&!te()){let a=await ne();o=g?`${a}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe`:`${process.env.SYSTEMROOT}\\System32\\WindowsPowerShell\\v1.0\\powershell`,n.push("-NoProfile","-NonInteractive","\u2013ExecutionPolicy","Bypass","-EncodedCommand"),g||(u.windowsVerbatimArguments=!0);let i=["Start"];e.wait&&i.push("-Wait"),r?(i.push(`"\`"${r}\`""`,"-ArgumentList"),e.target&&t.unshift(e.target)):e.target&&i.push(`"${e.target}"`),t.length>0&&(t=t.map(p=>`"\`"${p}\`""`),i.push(t.join(","))),e.target=Buffer.from(i.join(" "),"utf16le").toString("base64")}else{if(r)o=r;else{let a=!__dirname||__dirname==="/",i=!1;try{await A.access(q,R.X_OK),i=!0}catch{}o=process.versions.electron||l==="android"||a||!i?"xdg-open":q}t.length>0&&n.push(...t),e.wait||(u.stdio="ignore",u.detached=!0)}e.target&&n.push(e.target),l==="darwin"&&t.length>0&&n.push("--args",...t);let f=re.spawn(o,n,u);return e.wait?new Promise((a,i)=>{f.once("error",i),f.once("close",p=>{if(e.allowNonzeroExitCode&&p>0){i(new Error(`Exited with code ${p}`));return}a(f)})}):(f.unref(),f)},F=(e,r)=>{if(typeof e!="string")throw new TypeError("Expected a `target`");return h({...r,target:e})},oe=(e,r)=>{if(typeof e!="string")throw new TypeError("Expected a `name`");let{arguments:t=[]}=r||{};if(t!=null&&!Array.isArray(t))throw new TypeError("Expected `appArguments` as Array type");return h({...r,app:{name:e,arguments:t}})};function G(e){if(typeof e=="string"||Array.isArray(e))return e;let{[L]:r}=e;if(!r)throw new Error(`${L} is not supported`);return r}function E({[l]:e},{wsl:r}){if(r&&g)return G(r);if(!e)throw new Error(`${l} is not supported`);return G(e)}var w={};b(w,"chrome",()=>E({darwin:"google chrome",win32:"chrome",linux:["google-chrome","google-chrome-stable","chromium"]},{wsl:{ia32:"/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",x64:["/mnt/c/Program Files/Google/Chrome/Application/chrome.exe","/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"]}}));b(w,"firefox",()=>E({darwin:"firefox",win32:"C:\\Program Files\\Mozilla Firefox\\firefox.exe",linux:"firefox"},{wsl:"/mnt/c/Program Files/Mozilla Firefox/firefox.exe"}));b(w,"edge",()=>E({darwin:"microsoft edge",win32:"msedge",linux:["microsoft-edge","microsoft-edge-dev"]},{wsl:"/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"}));F.apps=w;F.openApp=oe;U.exports=F});var ie={};K(ie,{default:()=>B});module.exports=Y(ie);var s=require("@raycast/api"),M=j(I()),c=require("react/jsx-runtime");function se(){async function e({url:r,tags:t,pin:o}){if(!r){(0,s.showToast)(s.Toast.Style.Failure,"URL is required");return}(0,M.default)(`bear://x-callback-url/grab-url?url=${encodeURIComponent(r)}&tags=${encodeURIComponent(t)}&pin=${o?"yes":"no"}`),await(0,s.popToRoot)({clearSearchBar:!0})}return(0,c.jsx)(s.Action.SubmitForm,{icon:s.Icon.Globe,title:"Capture in New Note",onSubmit:e})}function B(){return(0,c.jsxs)(s.Form,{navigationTitle:"Grab URL",actions:(0,c.jsx)(s.ActionPanel,{children:(0,c.jsx)(se,{})}),children:[(0,c.jsx)(s.Form.TextField,{id:"url",title:"URL",placeholder:"URL of web page to capture (eg. http://raycast.com)"}),(0,c.jsx)(s.Form.TextField,{id:"tags",title:"Tags",placeholder:"comma,separated,tags"}),(0,c.jsx)(s.Form.Checkbox,{id:"pin",label:"Pin note to top of note list"})]})}0&&(module.exports={});