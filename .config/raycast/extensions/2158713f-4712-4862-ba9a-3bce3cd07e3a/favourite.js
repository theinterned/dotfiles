"use strict";var pn=Object.create;var j=Object.defineProperty;var mn=Object.getOwnPropertyDescriptor;var hn=Object.getOwnPropertyNames;var yn=Object.getPrototypeOf,Sn=Object.prototype.hasOwnProperty;var a=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),gn=(e,t)=>{for(var r in t)j(e,r,{get:t[r],enumerable:!0})},be=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of hn(t))!Sn.call(e,s)&&s!==r&&j(e,s,{get:()=>t[s],enumerable:!(n=mn(t,s))||n.enumerable});return e};var Ee=(e,t,r)=>(r=e!=null?pn(yn(e)):{},be(t||!e||!e.__esModule?j(r,"default",{value:e,enumerable:!0}):r,e)),xn=e=>be(j({},"__esModule",{value:!0}),e);var Ce=a((ys,Ge)=>{Ge.exports=Te;Te.sync=vn;var Ie=require("fs");function wn(e,t){var r=t.pathExt!==void 0?t.pathExt:process.env.PATHEXT;if(!r||(r=r.split(";"),r.indexOf("")!==-1))return!0;for(var n=0;n<r.length;n++){var s=r[n].toLowerCase();if(s&&e.substr(-s.length).toLowerCase()===s)return!0}return!1}function Pe(e,t,r){return!e.isSymbolicLink()&&!e.isFile()?!1:wn(t,r)}function Te(e,t,r){Ie.stat(e,function(n,s){r(n,n?!1:Pe(s,e,t))})}function vn(e,t){return Pe(Ie.statSync(e),e,t)}});var Ne=a((Ss,Re)=>{Re.exports=Oe;Oe.sync=bn;var Ae=require("fs");function Oe(e,t,r){Ae.stat(e,function(n,s){r(n,n?!1:qe(s,t))})}function bn(e,t){return qe(Ae.statSync(e),t)}function qe(e,t){return e.isFile()&&En(e,t)}function En(e,t){var r=e.mode,n=e.uid,s=e.gid,o=t.uid!==void 0?t.uid:process.getuid&&process.getuid(),i=t.gid!==void 0?t.gid:process.getgid&&process.getgid(),c=parseInt("100",8),u=parseInt("010",8),l=parseInt("001",8),f=c|u,h=r&l||r&u&&s===i||r&c&&n===o||r&f&&o===0;return h}});var ke=a((xs,_e)=>{var gs=require("fs"),M;process.platform==="win32"||global.TESTING_WINDOWS?M=Ce():M=Ne();_e.exports=J;J.sync=In;function J(e,t,r){if(typeof t=="function"&&(r=t,t={}),!r){if(typeof Promise!="function")throw new TypeError("callback not provided");return new Promise(function(n,s){J(e,t||{},function(o,i){o?s(o):n(i)})})}M(e,t||{},function(n,s){n&&(n.code==="EACCES"||t&&t.ignoreErrors)&&(n=null,s=!1),r(n,s)})}function In(e,t){try{return M.sync(e,t||{})}catch(r){if(t&&t.ignoreErrors||r.code==="EACCES")return!1;throw r}}});var Ue=a((ws,Fe)=>{var I=process.platform==="win32"||process.env.OSTYPE==="cygwin"||process.env.OSTYPE==="msys",$e=require("path"),Pn=I?";":":",Le=ke(),Be=e=>Object.assign(new Error(`not found: ${e}`),{code:"ENOENT"}),je=(e,t)=>{let r=t.colon||Pn,n=e.match(/\//)||I&&e.match(/\\/)?[""]:[...I?[process.cwd()]:[],...(t.path||process.env.PATH||"").split(r)],s=I?t.pathExt||process.env.PATHEXT||".EXE;.CMD;.BAT;.COM":"",o=I?s.split(r):[""];return I&&e.indexOf(".")!==-1&&o[0]!==""&&o.unshift(""),{pathEnv:n,pathExt:o,pathExtExe:s}},Me=(e,t,r)=>{typeof t=="function"&&(r=t,t={}),t||(t={});let{pathEnv:n,pathExt:s,pathExtExe:o}=je(e,t),i=[],c=l=>new Promise((f,h)=>{if(l===n.length)return t.all&&i.length?f(i):h(Be(e));let m=n[l],y=/^".*"$/.test(m)?m.slice(1,-1):m,S=$e.join(y,e),g=!y&&/^\.[\\\/]/.test(e)?e.slice(0,2)+S:S;f(u(g,l,0))}),u=(l,f,h)=>new Promise((m,y)=>{if(h===s.length)return m(c(f+1));let S=s[h];Le(l+S,{pathExt:o},(g,E)=>{if(!g&&E)if(t.all)i.push(l+S);else return m(l+S);return m(u(l,f,h+1))})});return r?c(0).then(l=>r(null,l),r):c(0)},Tn=(e,t)=>{t=t||{};let{pathEnv:r,pathExt:n,pathExtExe:s}=je(e,t),o=[];for(let i=0;i<r.length;i++){let c=r[i],u=/^".*"$/.test(c)?c.slice(1,-1):c,l=$e.join(u,e),f=!u&&/^\.[\\\/]/.test(e)?e.slice(0,2)+l:l;for(let h=0;h<n.length;h++){let m=f+n[h];try{if(Le.sync(m,{pathExt:s}))if(t.all)o.push(m);else return m}catch{}}}if(t.all&&o.length)return o;if(t.nothrow)return null;throw Be(e)};Fe.exports=Me;Me.sync=Tn});var te=a((vs,ee)=>{"use strict";var De=(e={})=>{let t=e.env||process.env;return(e.platform||process.platform)!=="win32"?"PATH":Object.keys(t).reverse().find(n=>n.toUpperCase()==="PATH")||"Path"};ee.exports=De;ee.exports.default=De});var We=a((bs,Ke)=>{"use strict";var He=require("path"),Gn=Ue(),Cn=te();function Xe(e,t){let r=e.options.env||process.env,n=process.cwd(),s=e.options.cwd!=null,o=s&&process.chdir!==void 0&&!process.chdir.disabled;if(o)try{process.chdir(e.options.cwd)}catch{}let i;try{i=Gn.sync(e.command,{path:r[Cn({env:r})],pathExt:t?He.delimiter:void 0})}catch{}finally{o&&process.chdir(n)}return i&&(i=He.resolve(s?e.options.cwd:"",i)),i}function An(e){return Xe(e)||Xe(e,!0)}Ke.exports=An});var Ve=a((Es,re)=>{"use strict";var ne=/([()\][%!^"`<>&|;, *?])/g;function On(e){return e=e.replace(ne,"^$1"),e}function qn(e,t){return e=`${e}`,e=e.replace(/(\\*)"/g,'$1$1\\"'),e=e.replace(/(\\*)$/,"$1$1"),e=`"${e}"`,e=e.replace(ne,"^$1"),t&&(e=e.replace(ne,"^$1")),e}re.exports.command=On;re.exports.argument=qn});var Ye=a((Is,ze)=>{"use strict";ze.exports=/^#!(.*)/});var Ze=a((Ps,Qe)=>{"use strict";var Rn=Ye();Qe.exports=(e="")=>{let t=e.match(Rn);if(!t)return null;let[r,n]=t[0].replace(/#! ?/,"").split(" "),s=r.split("/").pop();return s==="env"?n:n?`${s} ${n}`:s}});var et=a((Ts,Je)=>{"use strict";var se=require("fs"),Nn=Ze();function _n(e){let r=Buffer.alloc(150),n;try{n=se.openSync(e,"r"),se.readSync(n,r,0,150,0),se.closeSync(n)}catch{}return Nn(r.toString())}Je.exports=_n});var st=a((Gs,rt)=>{"use strict";var kn=require("path"),tt=We(),nt=Ve(),$n=et(),Ln=process.platform==="win32",Bn=/\.(?:com|exe)$/i,jn=/node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;function Mn(e){e.file=tt(e);let t=e.file&&$n(e.file);return t?(e.args.unshift(e.file),e.command=t,tt(e)):e.file}function Fn(e){if(!Ln)return e;let t=Mn(e),r=!Bn.test(t);if(e.options.forceShell||r){let n=jn.test(t);e.command=kn.normalize(e.command),e.command=nt.command(e.command),e.args=e.args.map(o=>nt.argument(o,n));let s=[e.command].concat(e.args).join(" ");e.args=["/d","/s","/c",`"${s}"`],e.command=process.env.comspec||"cmd.exe",e.options.windowsVerbatimArguments=!0}return e}function Un(e,t,r){t&&!Array.isArray(t)&&(r=t,t=null),t=t?t.slice(0):[],r=Object.assign({},r);let n={command:e,args:t,options:r,file:void 0,original:{command:e,args:t}};return r.shell?n:Fn(n)}rt.exports=Un});var ct=a((Cs,it)=>{"use strict";var oe=process.platform==="win32";function ie(e,t){return Object.assign(new Error(`${t} ${e.command} ENOENT`),{code:"ENOENT",errno:"ENOENT",syscall:`${t} ${e.command}`,path:e.command,spawnargs:e.args})}function Dn(e,t){if(!oe)return;let r=e.emit;e.emit=function(n,s){if(n==="exit"){let o=ot(s,t,"spawn");if(o)return r.call(e,"error",o)}return r.apply(e,arguments)}}function ot(e,t){return oe&&e===1&&!t.file?ie(t.original,"spawn"):null}function Hn(e,t){return oe&&e===1&&!t.file?ie(t.original,"spawnSync"):null}it.exports={hookChildProcess:Dn,verifyENOENT:ot,verifyENOENTSync:Hn,notFoundError:ie}});var lt=a((As,P)=>{"use strict";var at=require("child_process"),ce=st(),ae=ct();function ut(e,t,r){let n=ce(e,t,r),s=at.spawn(n.command,n.args,n.options);return ae.hookChildProcess(s,n),s}function Xn(e,t,r){let n=ce(e,t,r),s=at.spawnSync(n.command,n.args,n.options);return s.error=s.error||ae.verifyENOENTSync(s.status,n),s}P.exports=ut;P.exports.spawn=ut;P.exports.sync=Xn;P.exports._parse=ce;P.exports._enoent=ae});var ft=a((Os,dt)=>{"use strict";dt.exports=e=>{let t=typeof e=="string"?`
`:`
`.charCodeAt(),r=typeof e=="string"?"\r":"\r".charCodeAt();return e[e.length-1]===t&&(e=e.slice(0,e.length-1)),e[e.length-1]===r&&(e=e.slice(0,e.length-1)),e}});var ht=a((qs,N)=>{"use strict";var R=require("path"),pt=te(),mt=e=>{e={cwd:process.cwd(),path:process.env[pt()],execPath:process.execPath,...e};let t,r=R.resolve(e.cwd),n=[];for(;t!==r;)n.push(R.join(r,"node_modules/.bin")),t=r,r=R.resolve(r,"..");let s=R.resolve(e.cwd,e.execPath,"..");return n.push(s),n.concat(e.path).join(R.delimiter)};N.exports=mt;N.exports.default=mt;N.exports.env=e=>{e={env:process.env,...e};let t={...e.env},r=pt({env:t});return e.path=t[r],t[r]=N.exports(e),t}});var St=a((Rs,ue)=>{"use strict";var yt=(e,t)=>{for(let r of Reflect.ownKeys(t))Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r));return e};ue.exports=yt;ue.exports.default=yt});var xt=a((Ns,U)=>{"use strict";var Kn=St(),F=new WeakMap,gt=(e,t={})=>{if(typeof e!="function")throw new TypeError("Expected a function");let r,n=0,s=e.displayName||e.name||"<anonymous>",o=function(...i){if(F.set(o,++n),n===1)r=e.apply(this,i),e=null;else if(t.throw===!0)throw new Error(`Function \`${s}\` can only be called once`);return r};return Kn(o,e),F.set(o,n),o};U.exports=gt;U.exports.default=gt;U.exports.callCount=e=>{if(!F.has(e))throw new Error(`The given function \`${e.name}\` is not wrapped by the \`onetime\` package`);return F.get(e)}});var wt=a(D=>{"use strict";Object.defineProperty(D,"__esModule",{value:!0});D.SIGNALS=void 0;var Wn=[{name:"SIGHUP",number:1,action:"terminate",description:"Terminal closed",standard:"posix"},{name:"SIGINT",number:2,action:"terminate",description:"User interruption with CTRL-C",standard:"ansi"},{name:"SIGQUIT",number:3,action:"core",description:"User interruption with CTRL-\\",standard:"posix"},{name:"SIGILL",number:4,action:"core",description:"Invalid machine instruction",standard:"ansi"},{name:"SIGTRAP",number:5,action:"core",description:"Debugger breakpoint",standard:"posix"},{name:"SIGABRT",number:6,action:"core",description:"Aborted",standard:"ansi"},{name:"SIGIOT",number:6,action:"core",description:"Aborted",standard:"bsd"},{name:"SIGBUS",number:7,action:"core",description:"Bus error due to misaligned, non-existing address or paging error",standard:"bsd"},{name:"SIGEMT",number:7,action:"terminate",description:"Command should be emulated but is not implemented",standard:"other"},{name:"SIGFPE",number:8,action:"core",description:"Floating point arithmetic error",standard:"ansi"},{name:"SIGKILL",number:9,action:"terminate",description:"Forced termination",standard:"posix",forced:!0},{name:"SIGUSR1",number:10,action:"terminate",description:"Application-specific signal",standard:"posix"},{name:"SIGSEGV",number:11,action:"core",description:"Segmentation fault",standard:"ansi"},{name:"SIGUSR2",number:12,action:"terminate",description:"Application-specific signal",standard:"posix"},{name:"SIGPIPE",number:13,action:"terminate",description:"Broken pipe or socket",standard:"posix"},{name:"SIGALRM",number:14,action:"terminate",description:"Timeout or timer",standard:"posix"},{name:"SIGTERM",number:15,action:"terminate",description:"Termination",standard:"ansi"},{name:"SIGSTKFLT",number:16,action:"terminate",description:"Stack is empty or overflowed",standard:"other"},{name:"SIGCHLD",number:17,action:"ignore",description:"Child process terminated, paused or unpaused",standard:"posix"},{name:"SIGCLD",number:17,action:"ignore",description:"Child process terminated, paused or unpaused",standard:"other"},{name:"SIGCONT",number:18,action:"unpause",description:"Unpaused",standard:"posix",forced:!0},{name:"SIGSTOP",number:19,action:"pause",description:"Paused",standard:"posix",forced:!0},{name:"SIGTSTP",number:20,action:"pause",description:'Paused using CTRL-Z or "suspend"',standard:"posix"},{name:"SIGTTIN",number:21,action:"pause",description:"Background process cannot read terminal input",standard:"posix"},{name:"SIGBREAK",number:21,action:"terminate",description:"User interruption with CTRL-BREAK",standard:"other"},{name:"SIGTTOU",number:22,action:"pause",description:"Background process cannot write to terminal output",standard:"posix"},{name:"SIGURG",number:23,action:"ignore",description:"Socket received out-of-band data",standard:"bsd"},{name:"SIGXCPU",number:24,action:"core",description:"Process timed out",standard:"bsd"},{name:"SIGXFSZ",number:25,action:"core",description:"File too big",standard:"bsd"},{name:"SIGVTALRM",number:26,action:"terminate",description:"Timeout or timer",standard:"bsd"},{name:"SIGPROF",number:27,action:"terminate",description:"Timeout or timer",standard:"bsd"},{name:"SIGWINCH",number:28,action:"ignore",description:"Terminal window size changed",standard:"bsd"},{name:"SIGIO",number:29,action:"terminate",description:"I/O is available",standard:"other"},{name:"SIGPOLL",number:29,action:"terminate",description:"Watched event",standard:"other"},{name:"SIGINFO",number:29,action:"ignore",description:"Request for process information",standard:"other"},{name:"SIGPWR",number:30,action:"terminate",description:"Device running out of power",standard:"systemv"},{name:"SIGSYS",number:31,action:"core",description:"Invalid system call",standard:"other"},{name:"SIGUNUSED",number:31,action:"terminate",description:"Invalid system call",standard:"other"}];D.SIGNALS=Wn});var le=a(T=>{"use strict";Object.defineProperty(T,"__esModule",{value:!0});T.SIGRTMAX=T.getRealtimeSignals=void 0;var Vn=function(){let e=bt-vt+1;return Array.from({length:e},zn)};T.getRealtimeSignals=Vn;var zn=function(e,t){return{name:`SIGRT${t+1}`,number:vt+t,action:"terminate",description:"Application-specific signal (realtime)",standard:"posix"}},vt=34,bt=64;T.SIGRTMAX=bt});var Et=a(H=>{"use strict";Object.defineProperty(H,"__esModule",{value:!0});H.getSignals=void 0;var Yn=require("os"),Qn=wt(),Zn=le(),Jn=function(){let e=(0,Zn.getRealtimeSignals)();return[...Qn.SIGNALS,...e].map(er)};H.getSignals=Jn;var er=function({name:e,number:t,description:r,action:n,forced:s=!1,standard:o}){let{signals:{[e]:i}}=Yn.constants,c=i!==void 0;return{name:e,number:c?i:t,description:r,supported:c,action:n,forced:s,standard:o}}});var Pt=a(G=>{"use strict";Object.defineProperty(G,"__esModule",{value:!0});G.signalsByNumber=G.signalsByName=void 0;var tr=require("os"),It=Et(),nr=le(),rr=function(){return(0,It.getSignals)().reduce(sr,{})},sr=function(e,{name:t,number:r,description:n,supported:s,action:o,forced:i,standard:c}){return{...e,[t]:{name:t,number:r,description:n,supported:s,action:o,forced:i,standard:c}}},or=rr();G.signalsByName=or;var ir=function(){let e=(0,It.getSignals)(),t=nr.SIGRTMAX+1,r=Array.from({length:t},(n,s)=>cr(s,e));return Object.assign({},...r)},cr=function(e,t){let r=ar(e,t);if(r===void 0)return{};let{name:n,description:s,supported:o,action:i,forced:c,standard:u}=r;return{[e]:{name:n,number:e,description:s,supported:o,action:i,forced:c,standard:u}}},ar=function(e,t){let r=t.find(({name:n})=>tr.constants.signals[n]===e);return r!==void 0?r:t.find(n=>n.number===e)},ur=ir();G.signalsByNumber=ur});var Gt=a((Bs,Tt)=>{"use strict";var{signalsByName:lr}=Pt(),dr=({timedOut:e,timeout:t,errorCode:r,signal:n,signalDescription:s,exitCode:o,isCanceled:i})=>e?`timed out after ${t} milliseconds`:i?"was canceled":r!==void 0?`failed with ${r}`:n!==void 0?`was killed with ${n} (${s})`:o!==void 0?`failed with exit code ${o}`:"failed",fr=({stdout:e,stderr:t,all:r,error:n,signal:s,exitCode:o,command:i,escapedCommand:c,timedOut:u,isCanceled:l,killed:f,parsed:{options:{timeout:h}}})=>{o=o===null?void 0:o,s=s===null?void 0:s;let m=s===void 0?void 0:lr[s].description,y=n&&n.code,g=`Command ${dr({timedOut:u,timeout:h,errorCode:y,signal:s,signalDescription:m,exitCode:o,isCanceled:l})}: ${i}`,E=Object.prototype.toString.call(n)==="[object Error]",L=E?`${g}
${n.message}`:g,B=[L,t,e].filter(Boolean).join(`
`);return E?(n.originalMessage=n.message,n.message=B):n=new Error(B),n.shortMessage=L,n.command=i,n.escapedCommand=c,n.exitCode=o,n.signal=s,n.signalDescription=m,n.stdout=e,n.stderr=t,r!==void 0&&(n.all=r),"bufferedData"in n&&delete n.bufferedData,n.failed=!0,n.timedOut=Boolean(u),n.isCanceled=l,n.killed=f&&!u,n};Tt.exports=fr});var At=a((js,de)=>{"use strict";var X=["stdin","stdout","stderr"],pr=e=>X.some(t=>e[t]!==void 0),Ct=e=>{if(!e)return;let{stdio:t}=e;if(t===void 0)return X.map(n=>e[n]);if(pr(e))throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${X.map(n=>`\`${n}\``).join(", ")}`);if(typeof t=="string")return t;if(!Array.isArray(t))throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof t}\``);let r=Math.max(t.length,X.length);return Array.from({length:r},(n,s)=>t[s])};de.exports=Ct;de.exports.node=e=>{let t=Ct(e);return t==="ipc"?"ipc":t===void 0||typeof t=="string"?[t,t,t,"ipc"]:t.includes("ipc")?t:[...t,"ipc"]}});var Ot=a((Ms,K)=>{K.exports=["SIGABRT","SIGALRM","SIGHUP","SIGINT","SIGTERM"];process.platform!=="win32"&&K.exports.push("SIGVTALRM","SIGXCPU","SIGXFSZ","SIGUSR2","SIGTRAP","SIGSYS","SIGQUIT","SIGIOT");process.platform==="linux"&&K.exports.push("SIGIO","SIGPOLL","SIGPWR","SIGSTKFLT","SIGUNUSED")});var kt=a((Fs,O)=>{var d=global.process,v=function(e){return e&&typeof e=="object"&&typeof e.removeListener=="function"&&typeof e.emit=="function"&&typeof e.reallyExit=="function"&&typeof e.listeners=="function"&&typeof e.kill=="function"&&typeof e.pid=="number"&&typeof e.on=="function"};v(d)?(qt=require("assert"),C=Ot(),Rt=/^win/i.test(d.platform),_=require("events"),typeof _!="function"&&(_=_.EventEmitter),d.__signal_exit_emitter__?p=d.__signal_exit_emitter__:(p=d.__signal_exit_emitter__=new _,p.count=0,p.emitted={}),p.infinite||(p.setMaxListeners(1/0),p.infinite=!0),O.exports=function(e,t){if(!v(global.process))return function(){};qt.equal(typeof e,"function","a callback must be provided for exit handler"),A===!1&&fe();var r="exit";t&&t.alwaysLast&&(r="afterexit");var n=function(){p.removeListener(r,e),p.listeners("exit").length===0&&p.listeners("afterexit").length===0&&W()};return p.on(r,e),n},W=function(){!A||!v(global.process)||(A=!1,C.forEach(function(t){try{d.removeListener(t,V[t])}catch{}}),d.emit=z,d.reallyExit=pe,p.count-=1)},O.exports.unload=W,b=function(t,r,n){p.emitted[t]||(p.emitted[t]=!0,p.emit(t,r,n))},V={},C.forEach(function(e){V[e]=function(){if(!!v(global.process)){var r=d.listeners(e);r.length===p.count&&(W(),b("exit",null,e),b("afterexit",null,e),Rt&&e==="SIGHUP"&&(e="SIGINT"),d.kill(d.pid,e))}}}),O.exports.signals=function(){return C},A=!1,fe=function(){A||!v(global.process)||(A=!0,p.count+=1,C=C.filter(function(t){try{return d.on(t,V[t]),!0}catch{return!1}}),d.emit=_t,d.reallyExit=Nt)},O.exports.load=fe,pe=d.reallyExit,Nt=function(t){!v(global.process)||(d.exitCode=t||0,b("exit",d.exitCode,null),b("afterexit",d.exitCode,null),pe.call(d,d.exitCode))},z=d.emit,_t=function(t,r){if(t==="exit"&&v(global.process)){r!==void 0&&(d.exitCode=r);var n=z.apply(this,arguments);return b("exit",d.exitCode,null),b("afterexit",d.exitCode,null),n}else return z.apply(this,arguments)}):O.exports=function(){return function(){}};var qt,C,Rt,_,p,W,b,V,A,fe,pe,Nt,z,_t});var Lt=a((Us,$t)=>{"use strict";var mr=require("os"),hr=kt(),yr=1e3*5,Sr=(e,t="SIGTERM",r={})=>{let n=e(t);return gr(e,t,r,n),n},gr=(e,t,r,n)=>{if(!xr(t,r,n))return;let s=vr(r),o=setTimeout(()=>{e("SIGKILL")},s);o.unref&&o.unref()},xr=(e,{forceKillAfterTimeout:t},r)=>wr(e)&&t!==!1&&r,wr=e=>e===mr.constants.signals.SIGTERM||typeof e=="string"&&e.toUpperCase()==="SIGTERM",vr=({forceKillAfterTimeout:e=!0})=>{if(e===!0)return yr;if(!Number.isFinite(e)||e<0)throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${e}\` (${typeof e})`);return e},br=(e,t)=>{e.kill()&&(t.isCanceled=!0)},Er=(e,t,r)=>{e.kill(t),r(Object.assign(new Error("Timed out"),{timedOut:!0,signal:t}))},Ir=(e,{timeout:t,killSignal:r="SIGTERM"},n)=>{if(t===0||t===void 0)return n;let s,o=new Promise((c,u)=>{s=setTimeout(()=>{Er(e,r,u)},t)}),i=n.finally(()=>{clearTimeout(s)});return Promise.race([o,i])},Pr=({timeout:e})=>{if(e!==void 0&&(!Number.isFinite(e)||e<0))throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${e}\` (${typeof e})`)},Tr=async(e,{cleanup:t,detached:r},n)=>{if(!t||r)return n;let s=hr(()=>{e.kill()});return n.finally(()=>{s()})};$t.exports={spawnedKill:Sr,spawnedCancel:br,setupTimeout:Ir,validateTimeout:Pr,setExitHandler:Tr}});var jt=a((Ds,Bt)=>{"use strict";var x=e=>e!==null&&typeof e=="object"&&typeof e.pipe=="function";x.writable=e=>x(e)&&e.writable!==!1&&typeof e._write=="function"&&typeof e._writableState=="object";x.readable=e=>x(e)&&e.readable!==!1&&typeof e._read=="function"&&typeof e._readableState=="object";x.duplex=e=>x.writable(e)&&x.readable(e);x.transform=e=>x.duplex(e)&&typeof e._transform=="function";Bt.exports=x});var Ft=a((Hs,Mt)=>{"use strict";var{PassThrough:Gr}=require("stream");Mt.exports=e=>{e={...e};let{array:t}=e,{encoding:r}=e,n=r==="buffer",s=!1;t?s=!(r||n):r=r||"utf8",n&&(r=null);let o=new Gr({objectMode:s});r&&o.setEncoding(r);let i=0,c=[];return o.on("data",u=>{c.push(u),s?i=c.length:i+=u.length}),o.getBufferedValue=()=>t?c:n?Buffer.concat(c,i):c.join(""),o.getBufferedLength=()=>i,o}});var Ut=a((Xs,k)=>{"use strict";var{constants:Cr}=require("buffer"),Ar=require("stream"),{promisify:Or}=require("util"),qr=Ft(),Rr=Or(Ar.pipeline),Y=class extends Error{constructor(){super("maxBuffer exceeded"),this.name="MaxBufferError"}};async function me(e,t){if(!e)throw new Error("Expected a stream");t={maxBuffer:1/0,...t};let{maxBuffer:r}=t,n=qr(t);return await new Promise((s,o)=>{let i=c=>{c&&n.getBufferedLength()<=Cr.MAX_LENGTH&&(c.bufferedData=n.getBufferedValue()),o(c)};(async()=>{try{await Rr(e,n),s()}catch(c){i(c)}})(),n.on("data",()=>{n.getBufferedLength()>r&&i(new Y)})}),n.getBufferedValue()}k.exports=me;k.exports.buffer=(e,t)=>me(e,{...t,encoding:"buffer"});k.exports.array=(e,t)=>me(e,{...t,array:!0});k.exports.MaxBufferError=Y});var Ht=a((Ks,Dt)=>{"use strict";var{PassThrough:Nr}=require("stream");Dt.exports=function(){var e=[],t=new Nr({objectMode:!0});return t.setMaxListeners(0),t.add=r,t.isEmpty=n,t.on("unpipe",s),Array.prototype.slice.call(arguments).forEach(r),t;function r(o){return Array.isArray(o)?(o.forEach(r),this):(e.push(o),o.once("end",s.bind(null,o)),o.once("error",t.emit.bind(t,"error")),o.pipe(t,{end:!1}),this)}function n(){return e.length==0}function s(o){e=e.filter(function(i){return i!==o}),!e.length&&t.readable&&t.end()}}});var Vt=a((Ws,Wt)=>{"use strict";var Kt=jt(),Xt=Ut(),_r=Ht(),kr=(e,t)=>{t===void 0||e.stdin===void 0||(Kt(t)?t.pipe(e.stdin):e.stdin.end(t))},$r=(e,{all:t})=>{if(!t||!e.stdout&&!e.stderr)return;let r=_r();return e.stdout&&r.add(e.stdout),e.stderr&&r.add(e.stderr),r},he=async(e,t)=>{if(!!e){e.destroy();try{return await t}catch(r){return r.bufferedData}}},ye=(e,{encoding:t,buffer:r,maxBuffer:n})=>{if(!(!e||!r))return t?Xt(e,{encoding:t,maxBuffer:n}):Xt.buffer(e,{maxBuffer:n})},Lr=async({stdout:e,stderr:t,all:r},{encoding:n,buffer:s,maxBuffer:o},i)=>{let c=ye(e,{encoding:n,buffer:s,maxBuffer:o}),u=ye(t,{encoding:n,buffer:s,maxBuffer:o}),l=ye(r,{encoding:n,buffer:s,maxBuffer:o*2});try{return await Promise.all([i,c,u,l])}catch(f){return Promise.all([{error:f,signal:f.signal,timedOut:f.timedOut},he(e,c),he(t,u),he(r,l)])}},Br=({input:e})=>{if(Kt(e))throw new TypeError("The `input` option cannot be a stream in sync mode")};Wt.exports={handleInput:kr,makeAllStream:$r,getSpawnedResult:Lr,validateInputSync:Br}});var Yt=a((Vs,zt)=>{"use strict";var jr=(async()=>{})().constructor.prototype,Mr=["then","catch","finally"].map(e=>[e,Reflect.getOwnPropertyDescriptor(jr,e)]),Fr=(e,t)=>{for(let[r,n]of Mr){let s=typeof t=="function"?(...o)=>Reflect.apply(n.value,t(),o):n.value.bind(t);Reflect.defineProperty(e,r,{...n,value:s})}return e},Ur=e=>new Promise((t,r)=>{e.on("exit",(n,s)=>{t({exitCode:n,signal:s})}),e.on("error",n=>{r(n)}),e.stdin&&e.stdin.on("error",n=>{r(n)})});zt.exports={mergePromise:Fr,getSpawnedPromise:Ur}});var Jt=a((zs,Zt)=>{"use strict";var Qt=(e,t=[])=>Array.isArray(t)?[e,...t]:[e],Dr=/^[\w.-]+$/,Hr=/"/g,Xr=e=>typeof e!="string"||Dr.test(e)?e:`"${e.replace(Hr,'\\"')}"`,Kr=(e,t)=>Qt(e,t).join(" "),Wr=(e,t)=>Qt(e,t).map(r=>Xr(r)).join(" "),Vr=/ +/g,zr=e=>{let t=[];for(let r of e.trim().split(Vr)){let n=t[t.length-1];n&&n.endsWith("\\")?t[t.length-1]=`${n.slice(0,-1)} ${r}`:t.push(r)}return t};Zt.exports={joinCommand:Kr,getEscapedCommand:Wr,parseCommand:zr}});var cn=a((Ys,q)=>{"use strict";var Yr=require("path"),Se=require("child_process"),Qr=lt(),Zr=ft(),Jr=ht(),es=xt(),Q=Gt(),tn=At(),{spawnedKill:ts,spawnedCancel:ns,setupTimeout:rs,validateTimeout:ss,setExitHandler:os}=Lt(),{handleInput:is,getSpawnedResult:cs,makeAllStream:as,validateInputSync:us}=Vt(),{mergePromise:en,getSpawnedPromise:ls}=Yt(),{joinCommand:nn,parseCommand:rn,getEscapedCommand:sn}=Jt(),ds=1e3*1e3*100,fs=({env:e,extendEnv:t,preferLocal:r,localDir:n,execPath:s})=>{let o=t?{...process.env,...e}:e;return r?Jr.env({env:o,cwd:n,execPath:s}):o},on=(e,t,r={})=>{let n=Qr._parse(e,t,r);return e=n.command,t=n.args,r=n.options,r={maxBuffer:ds,buffer:!0,stripFinalNewline:!0,extendEnv:!0,preferLocal:!1,localDir:r.cwd||process.cwd(),execPath:process.execPath,encoding:"utf8",reject:!0,cleanup:!0,all:!1,windowsHide:!0,...r},r.env=fs(r),r.stdio=tn(r),process.platform==="win32"&&Yr.basename(e,".exe")==="cmd"&&t.unshift("/q"),{file:e,args:t,options:r,parsed:n}},$=(e,t,r)=>typeof t!="string"&&!Buffer.isBuffer(t)?r===void 0?void 0:"":e.stripFinalNewline?Zr(t):t,Z=(e,t,r)=>{let n=on(e,t,r),s=nn(e,t),o=sn(e,t);ss(n.options);let i;try{i=Se.spawn(n.file,n.args,n.options)}catch(y){let S=new Se.ChildProcess,g=Promise.reject(Q({error:y,stdout:"",stderr:"",all:"",command:s,escapedCommand:o,parsed:n,timedOut:!1,isCanceled:!1,killed:!1}));return en(S,g)}let c=ls(i),u=rs(i,n.options,c),l=os(i,n.options,u),f={isCanceled:!1};i.kill=ts.bind(null,i.kill.bind(i)),i.cancel=ns.bind(null,i,f);let m=es(async()=>{let[{error:y,exitCode:S,signal:g,timedOut:E},L,B,fn]=await cs(i,n.options,l),ge=$(n.options,L),xe=$(n.options,B),we=$(n.options,fn);if(y||S!==0||g!==null){let ve=Q({error:y,exitCode:S,signal:g,stdout:ge,stderr:xe,all:we,command:s,escapedCommand:o,parsed:n,timedOut:E,isCanceled:f.isCanceled,killed:i.killed});if(!n.options.reject)return ve;throw ve}return{command:s,escapedCommand:o,exitCode:0,stdout:ge,stderr:xe,all:we,failed:!1,timedOut:!1,isCanceled:!1,killed:!1}});return is(i,n.options.input),i.all=as(i,n.options),en(i,m)};q.exports=Z;q.exports.sync=(e,t,r)=>{let n=on(e,t,r),s=nn(e,t),o=sn(e,t);us(n.options);let i;try{i=Se.spawnSync(n.file,n.args,n.options)}catch(l){throw Q({error:l,stdout:"",stderr:"",all:"",command:s,escapedCommand:o,parsed:n,timedOut:!1,isCanceled:!1,killed:!1})}let c=$(n.options,i.stdout,i.error),u=$(n.options,i.stderr,i.error);if(i.error||i.status!==0||i.signal!==null){let l=Q({stdout:c,stderr:u,error:i.error,signal:i.signal,exitCode:i.status,command:s,escapedCommand:o,parsed:n,timedOut:i.error&&i.error.code==="ETIMEDOUT",isCanceled:!1,killed:i.signal!==null});if(!n.options.reject)return l;throw l}return{command:s,escapedCommand:o,exitCode:0,stdout:c,stderr:u,failed:!1,timedOut:!1,isCanceled:!1,killed:!1}};q.exports.command=(e,t)=>{let[r,...n]=rn(e);return Z(r,n,t)};q.exports.commandSync=(e,t)=>{let[r,...n]=rn(e);return Z.sync(r,n,t)};q.exports.node=(e,t,r={})=>{t&&!Array.isArray(t)&&typeof t=="object"&&(r=t,t=[]);let n=tn.node(r),s=process.execArgv.filter(c=>!c.startsWith("--inspect")),{nodePath:o=process.execPath,nodeOptions:i=s}=r;return Z(o,[...i,e,...Array.isArray(t)?t:[]],{...r,stdin:void 0,stdout:void 0,stderr:void 0,stdio:n,shell:!1})}});var ms={};gn(ms,{default:()=>ps});module.exports=xn(ms);var w=require("@raycast/api");var an=Ee(require("node:process"),1),un=Ee(cn(),1);async function ln(e,{humanReadableOutput:t=!0}={}){if(an.default.platform!=="darwin")throw new Error("macOS only");let r=t?[]:["-ss"],{stdout:n}=await(0,un.default)("osascript",["-e",e,r]);return n}async function dn(e){await ln(`
    tell application "System Preferences"
      reveal pane id "com.apple.preference.sound"
    end tell
    tell application "System Events"
      tell application process "System Preferences"
        repeat until exists tab group 1 of window "Sound"
        end repeat
        tell tab group 1 of window "Sound"
          click radio button "Output"
          tell table 1 of scroll area 1
            select (row 1 where value of text field 1 is "${e}")
          end tell
        end tell
      end tell
    end tell

    if application "System Preferences" is running then
      tell application "System Preferences" to quit
    end if
  `)}var ps=async()=>{let e=(0,w.getPreferenceValues)();if(e.favourite!=null&&e.favourite!=="")try{await dn(e.favourite),await(0,w.showHUD)(`Active output audio device set to ${e.favourite}`)}catch{await(0,w.showToast)({style:w.Toast.Style.Failure,title:"Favourite output audio device could not be set"})}else await(0,w.showToast)({style:w.Toast.Style.Failure,title:"No favourite output audio device specified"})};0&&(module.exports={});
