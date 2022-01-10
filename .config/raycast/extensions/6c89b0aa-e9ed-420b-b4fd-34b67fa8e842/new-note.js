var X=Object.create;var p=Object.defineProperty;var G=Object.getOwnPropertyDescriptor;var R=Object.getOwnPropertyNames;var U=Object.getPrototypeOf,V=Object.prototype.hasOwnProperty;var E=e=>p(e,"__esModule",{value:!0});var d=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),j=(e,t)=>{for(var r in t)p(e,r,{get:t[r],enumerable:!0})},S=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of R(t))!V.call(e,n)&&(r||n!=="default")&&p(e,n,{get:()=>t[n],enumerable:!(i=G(t,n))||i.enumerable});return e},K=(e,t)=>S(E(p(e!=null?X(U(e)):{},"default",!t&&e&&e.__esModule?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e),Y=(e=>(t,r)=>e&&e.get(t)||(r=S(E({}),t,1),e&&e.set(t,r),r))(typeof WeakMap!="undefined"?new WeakMap:0);var x=d((ce,_)=>{"use strict";var C=require("fs"),h;function H(){try{return C.statSync("/.dockerenv"),!0}catch{return!1}}function J(){try{return C.readFileSync("/proc/self/cgroup","utf8").includes("docker")}catch{return!1}}_.exports=()=>(h===void 0&&(h=H()||J()),h)});var $=d((le,y)=>{"use strict";var Q=require("os"),Z=require("fs"),N=x(),T=()=>{if(process.platform!=="linux")return!1;if(Q.release().toLowerCase().includes("microsoft"))return!N();try{return Z.readFileSync("/proc/version","utf8").toLowerCase().includes("microsoft")?!N():!1}catch{return!1}};process.env.__IS_WSL_TEST__?y.exports=T:y.exports=T()});var O=d((ue,k)=>{"use strict";k.exports=(e,t,r)=>{let i=n=>Object.defineProperty(e,t,{value:n,enumerable:!0,writable:!0});return Object.defineProperty(e,t,{configurable:!0,enumerable:!0,get(){let n=r();return i(n),n},set(n){i(n)}}),e}});var L=d((fe,v)=>{var ee=require("path"),te=require("child_process"),{promises:P,constants:D}=require("fs"),m=$(),re=x(),A=O(),I=ee.join(__dirname,"xdg-open"),{platform:l,arch:W}=process,ne=(()=>{let e="/mnt/",t;return async function(){if(t)return t;let r="/etc/wsl.conf",i=!1;try{await P.access(r,D.F_OK),i=!0}catch{}if(!i)return e;let n=await P.readFile(r,{encoding:"utf8"}),c=/(?<!#.*)root\s*=\s*(?<mountPoint>.*)/g.exec(n);return c?(t=c.groups.mountPoint.trim(),t=t.endsWith("/")?t:`${t}/`,t):e}})(),q=async(e,t)=>{let r;for(let i of e)try{return await t(i)}catch(n){r=n}throw r},g=async e=>{if(e={wait:!1,background:!1,newInstance:!1,allowNonzeroExitCode:!1,...e},Array.isArray(e.app))return q(e.app,a=>g({...e,app:a}));let{name:t,arguments:r=[]}=e.app||{};if(r=[...r],Array.isArray(t))return q(t,a=>g({...e,app:{name:a,arguments:r}}));let i,n=[],c={};if(l==="darwin")i="open",e.wait&&n.push("--wait-apps"),e.background&&n.push("--background"),e.newInstance&&n.push("--new"),t&&n.push("-a",t);else if(l==="win32"||m&&!re()){let a=await ne();i=m?`${a}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe`:`${process.env.SYSTEMROOT}\\System32\\WindowsPowerShell\\v1.0\\powershell`,n.push("-NoProfile","-NonInteractive","\u2013ExecutionPolicy","Bypass","-EncodedCommand"),m||(c.windowsVerbatimArguments=!0);let s=["Start"];e.wait&&s.push("-Wait"),t?(s.push(`"\`"${t}\`""`,"-ArgumentList"),e.target&&r.unshift(e.target)):e.target&&s.push(`"${e.target}"`),r.length>0&&(r=r.map(f=>`"\`"${f}\`""`),s.push(r.join(","))),e.target=Buffer.from(s.join(" "),"utf16le").toString("base64")}else{if(t)i=t;else{let a=!__dirname||__dirname==="/",s=!1;try{await P.access(I,D.X_OK),s=!0}catch{}i=process.versions.electron||l==="android"||a||!s?"xdg-open":I}r.length>0&&n.push(...r),e.wait||(c.stdio="ignore",c.detached=!0)}e.target&&n.push(e.target),l==="darwin"&&r.length>0&&n.push("--args",...r);let u=te.spawn(i,n,c);return e.wait?new Promise((a,s)=>{u.once("error",s),u.once("close",f=>{if(e.allowNonzeroExitCode&&f>0){s(new Error(`Exited with code ${f}`));return}a(u)})}):(u.unref(),u)},F=(e,t)=>{if(typeof e!="string")throw new TypeError("Expected a `target`");return g({...t,target:e})},oe=(e,t)=>{if(typeof e!="string")throw new TypeError("Expected a `name`");let{arguments:r=[]}=t||{};if(r!=null&&!Array.isArray(r))throw new TypeError("Expected `appArguments` as Array type");return g({...t,app:{name:e,arguments:r}})};function M(e){if(typeof e=="string"||Array.isArray(e))return e;let{[W]:t}=e;if(!t)throw new Error(`${W} is not supported`);return t}function b({[l]:e},{wsl:t}){if(t&&m)return M(t);if(!e)throw new Error(`${l} is not supported`);return M(e)}var w={};A(w,"chrome",()=>b({darwin:"google chrome",win32:"chrome",linux:["google-chrome","google-chrome-stable","chromium"]},{wsl:{ia32:"/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",x64:["/mnt/c/Program Files/Google/Chrome/Application/chrome.exe","/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"]}}));A(w,"firefox",()=>b({darwin:"firefox",win32:"C:\\Program Files\\Mozilla Firefox\\firefox.exe",linux:"firefox"},{wsl:"/mnt/c/Program Files/Mozilla Firefox/firefox.exe"}));A(w,"edge",()=>b({darwin:"microsoft edge",win32:"msedge",linux:["microsoft-edge","microsoft-edge-dev"]},{wsl:"/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"}));F.apps=w;F.openApp=oe;v.exports=F});var se={};j(se,{default:()=>B});var o=require("@raycast/api"),z=K(L());function ie(){async function e(t){if(!t.text){(0,o.showToast)(o.ToastStyle.Failure,"Please enter text");return}(0,z.default)(`bear://x-callback-url/create?title=${encodeURIComponent(t.title)}&tags=${encodeURIComponent(t.tags)}&open_note=${t.openNote!=="no"?"yes":"no"}&new_window=${t.openNote==="new"?"yes":"no"}&show_window=${t.openNote!=="no"?"yes":"no"}&edit=${t.openNote==="no"?"no":"yes"}&timestamp=${t.timestamp?"yes":"no"}&text=${encodeURIComponent(t.text)}`,{background:t.openNote==="no"}),await(0,o.closeMainWindow)()}return _jsx(o.SubmitFormAction,{icon:o.Icon.Document,title:"Create Note",onSubmit:e})}function B(){return _jsx(o.Form,{navigationTitle:"Create Note",actions:_jsx(o.ActionPanel,null,_jsx(ie,null))},_jsx(o.Form.TextField,{id:"title",title:"Title",placeholder:"Note Title ..."}),_jsx(o.Form.TextArea,{id:"text",title:"Text",placeholder:"Text to add to note ..."}),_jsx(o.Form.TextField,{id:"tags",title:"Tags",placeholder:"comma,separated,tags"}),_jsx(o.Form.Separator,null),_jsx(o.Form.Dropdown,{id:"openNote",title:"Open Note"},_jsx(o.Form.Dropdown.Item,{value:"no",title:"Don't Open Note"}),_jsx(o.Form.Dropdown.Item,{value:"main",title:"In Main Window"}),_jsx(o.Form.Dropdown.Item,{value:"new",title:"In New Window"})),_jsx(o.Form.Checkbox,{id:"timestamp",label:"Prepend time and date"}),_jsx(o.Form.Checkbox,{id:"pin",label:"Pin note in notes list"}))}module.exports=Y(se);0&&(module.exports={});
