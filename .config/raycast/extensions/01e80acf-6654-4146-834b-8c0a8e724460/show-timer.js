var bn=Object.create;var N=Object.defineProperty,vn=Object.defineProperties,En=Object.getOwnPropertyDescriptor,In=Object.getOwnPropertyDescriptors,Tn=Object.getOwnPropertyNames,Ie=Object.getOwnPropertySymbols,Pn=Object.getPrototypeOf,Pe=Object.prototype.hasOwnProperty,Gn=Object.prototype.propertyIsEnumerable;var Te=(e,t,n)=>t in e?N(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,f=(e,t)=>{for(var n in t||(t={}))Pe.call(t,n)&&Te(e,n,t[n]);if(Ie)for(var n of Ie(t))Gn.call(t,n)&&Te(e,n,t[n]);return e},b=(e,t)=>vn(e,In(t)),Ge=e=>N(e,"__esModule",{value:!0});var c=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),Cn=(e,t)=>{for(var n in t)N(e,n,{get:t[n],enumerable:!0})},Ce=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Tn(t))!Pe.call(e,o)&&(n||o!=="default")&&N(e,o,{get:()=>t[o],enumerable:!(r=En(t,o))||r.enumerable});return e},Ae=(e,t)=>Ce(Ge(N(e!=null?bn(Pn(e)):{},"default",!t&&e&&e.__esModule?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e),An=(e=>(t,n)=>e&&e.get(t)||(n=Ce(Ge({}),t,1),e&&e.set(t,n),n))(typeof WeakMap!="undefined"?new WeakMap:0);var ke=c((Go,Ne)=>{Ne.exports=Re;Re.sync=On;var qe=require("fs");function qn(e,t){var n=t.pathExt!==void 0?t.pathExt:process.env.PATHEXT;if(!n||(n=n.split(";"),n.indexOf("")!==-1))return!0;for(var r=0;r<n.length;r++){var o=n[r].toLowerCase();if(o&&e.substr(-o.length).toLowerCase()===o)return!0}return!1}function Oe(e,t,n){return!e.isSymbolicLink()&&!e.isFile()?!1:qn(t,n)}function Re(e,t,n){qe.stat(e,function(r,o){n(r,r?!1:Oe(o,e,t))})}function On(e,t){return Oe(qe.statSync(e),e,t)}});var Le=c((Co,$e)=>{$e.exports=_e;_e.sync=Rn;var Fe=require("fs");function _e(e,t,n){Fe.stat(e,function(r,o){n(r,r?!1:Be(o,t))})}function Rn(e,t){return Be(Fe.statSync(e),t)}function Be(e,t){return e.isFile()&&Nn(e,t)}function Nn(e,t){var n=e.mode,r=e.uid,o=e.gid,s=t.uid!==void 0?t.uid:process.getuid&&process.getuid(),i=t.gid!==void 0?t.gid:process.getgid&&process.getgid(),a=parseInt("100",8),u=parseInt("010",8),l=parseInt("001",8),p=a|u,y=n&l||n&u&&o===i||n&a&&r===s||n&p&&s===0;return y}});var je=c((qo,Me)=>{var Ao=require("fs"),j;process.platform==="win32"||global.TESTING_WINDOWS?j=ke():j=Le();Me.exports=ee;ee.sync=kn;function ee(e,t,n){if(typeof t=="function"&&(n=t,t={}),!n){if(typeof Promise!="function")throw new TypeError("callback not provided");return new Promise(function(r,o){ee(e,t||{},function(s,i){s?o(s):r(i)})})}j(e,t||{},function(r,o){r&&(r.code==="EACCES"||t&&t.ignoreErrors)&&(r=null,o=!1),n(r,o)})}function kn(e,t){try{return j.sync(e,t||{})}catch(n){if(t&&t.ignoreErrors||n.code==="EACCES")return!1;throw n}}});var ze=c((Oo,We)=>{var T=process.platform==="win32"||process.env.OSTYPE==="cygwin"||process.env.OSTYPE==="msys",Ue=require("path"),Fn=T?";":":",De=je(),Xe=e=>Object.assign(new Error(`not found: ${e}`),{code:"ENOENT"}),He=(e,t)=>{let n=t.colon||Fn,r=e.match(/\//)||T&&e.match(/\\/)?[""]:[...T?[process.cwd()]:[],...(t.path||process.env.PATH||"").split(n)],o=T?t.pathExt||process.env.PATHEXT||".EXE;.CMD;.BAT;.COM":"",s=T?o.split(n):[""];return T&&e.indexOf(".")!==-1&&s[0]!==""&&s.unshift(""),{pathEnv:r,pathExt:s,pathExtExe:o}},Ke=(e,t,n)=>{typeof t=="function"&&(n=t,t={}),t||(t={});let{pathEnv:r,pathExt:o,pathExtExe:s}=He(e,t),i=[],a=l=>new Promise((p,y)=>{if(l===r.length)return t.all&&i.length?p(i):y(Xe(e));let h=r[l],S=/^".*"$/.test(h)?h.slice(1,-1):h,x=Ue.join(S,e),g=!S&&/^\.[\\\/]/.test(e)?e.slice(0,2)+x:x;p(u(g,l,0))}),u=(l,p,y)=>new Promise((h,S)=>{if(y===o.length)return h(a(p+1));let x=o[y];De(l+x,{pathExt:s},(g,I)=>{if(!g&&I)if(t.all)i.push(l+x);else return h(l+x);return h(u(l,p,y+1))})});return n?a(0).then(l=>n(null,l),n):a(0)},_n=(e,t)=>{t=t||{};let{pathEnv:n,pathExt:r,pathExtExe:o}=He(e,t),s=[];for(let i=0;i<n.length;i++){let a=n[i],u=/^".*"$/.test(a)?a.slice(1,-1):a,l=Ue.join(u,e),p=!u&&/^\.[\\\/]/.test(e)?e.slice(0,2)+l:l;for(let y=0;y<r.length;y++){let h=p+r[y];try{if(De.sync(h,{pathExt:o}))if(t.all)s.push(h);else return h}catch{}}}if(t.all&&s.length)return s;if(t.nothrow)return null;throw Xe(e)};We.exports=Ke;Ke.sync=_n});var ne=c((Ro,te)=>{"use strict";var Ve=(e={})=>{let t=e.env||process.env;return(e.platform||process.platform)!=="win32"?"PATH":Object.keys(t).reverse().find(r=>r.toUpperCase()==="PATH")||"Path"};te.exports=Ve;te.exports.default=Ve});var Je=c((No,Ze)=>{"use strict";var Ye=require("path"),Bn=ze(),$n=ne();function Qe(e,t){let n=e.options.env||process.env,r=process.cwd(),o=e.options.cwd!=null,s=o&&process.chdir!==void 0&&!process.chdir.disabled;if(s)try{process.chdir(e.options.cwd)}catch{}let i;try{i=Bn.sync(e.command,{path:n[$n({env:n})],pathExt:t?Ye.delimiter:void 0})}catch{}finally{s&&process.chdir(r)}return i&&(i=Ye.resolve(o?e.options.cwd:"",i)),i}function Ln(e){return Qe(e)||Qe(e,!0)}Ze.exports=Ln});var et=c((ko,oe)=>{"use strict";var re=/([()\][%!^"`<>&|;, *?])/g;function Mn(e){return e=e.replace(re,"^$1"),e}function jn(e,t){return e=`${e}`,e=e.replace(/(\\*)"/g,'$1$1\\"'),e=e.replace(/(\\*)$/,"$1$1"),e=`"${e}"`,e=e.replace(re,"^$1"),t&&(e=e.replace(re,"^$1")),e}oe.exports.command=Mn;oe.exports.argument=jn});var nt=c((Fo,tt)=>{"use strict";tt.exports=/^#!(.*)/});var ot=c((_o,rt)=>{"use strict";var Un=nt();rt.exports=(e="")=>{let t=e.match(Un);if(!t)return null;let[n,r]=t[0].replace(/#! ?/,"").split(" "),o=n.split("/").pop();return o==="env"?r:r?`${o} ${r}`:o}});var it=c((Bo,st)=>{"use strict";var se=require("fs"),Dn=ot();function Xn(e){let n=Buffer.alloc(150),r;try{r=se.openSync(e,"r"),se.readSync(r,n,0,150,0),se.closeSync(r)}catch{}return Dn(n.toString())}st.exports=Xn});var lt=c(($o,ut)=>{"use strict";var Hn=require("path"),at=Je(),ct=et(),Kn=it(),Wn=process.platform==="win32",zn=/\.(?:com|exe)$/i,Vn=/node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;function Yn(e){e.file=at(e);let t=e.file&&Kn(e.file);return t?(e.args.unshift(e.file),e.command=t,at(e)):e.file}function Qn(e){if(!Wn)return e;let t=Yn(e),n=!zn.test(t);if(e.options.forceShell||n){let r=Vn.test(t);e.command=Hn.normalize(e.command),e.command=ct.command(e.command),e.args=e.args.map(s=>ct.argument(s,r));let o=[e.command].concat(e.args).join(" ");e.args=["/d","/s","/c",`"${o}"`],e.command=process.env.comspec||"cmd.exe",e.options.windowsVerbatimArguments=!0}return e}function Zn(e,t,n){t&&!Array.isArray(t)&&(n=t,t=null),t=t?t.slice(0):[],n=Object.assign({},n);let r={command:e,args:t,options:n,file:void 0,original:{command:e,args:t}};return n.shell?r:Qn(r)}ut.exports=Zn});var pt=c((Lo,ft)=>{"use strict";var ie=process.platform==="win32";function ae(e,t){return Object.assign(new Error(`${t} ${e.command} ENOENT`),{code:"ENOENT",errno:"ENOENT",syscall:`${t} ${e.command}`,path:e.command,spawnargs:e.args})}function Jn(e,t){if(!ie)return;let n=e.emit;e.emit=function(r,o){if(r==="exit"){let s=dt(o,t,"spawn");if(s)return n.call(e,"error",s)}return n.apply(e,arguments)}}function dt(e,t){return ie&&e===1&&!t.file?ae(t.original,"spawn"):null}function er(e,t){return ie&&e===1&&!t.file?ae(t.original,"spawnSync"):null}ft.exports={hookChildProcess:Jn,verifyENOENT:dt,verifyENOENTSync:er,notFoundError:ae}});var yt=c((Mo,P)=>{"use strict";var mt=require("child_process"),ce=lt(),ue=pt();function ht(e,t,n){let r=ce(e,t,n),o=mt.spawn(r.command,r.args,r.options);return ue.hookChildProcess(o,r),o}function tr(e,t,n){let r=ce(e,t,n),o=mt.spawnSync(r.command,r.args,r.options);return o.error=o.error||ue.verifyENOENTSync(o.status,r),o}P.exports=ht;P.exports.spawn=ht;P.exports.sync=tr;P.exports._parse=ce;P.exports._enoent=ue});var xt=c((jo,St)=>{"use strict";St.exports=e=>{let t=typeof e=="string"?`
`:`
`.charCodeAt(),n=typeof e=="string"?"\r":"\r".charCodeAt();return e[e.length-1]===t&&(e=e.slice(0,e.length-1)),e[e.length-1]===n&&(e=e.slice(0,e.length-1)),e}});var bt=c((Uo,F)=>{"use strict";var k=require("path"),gt=ne(),wt=e=>{e=f({cwd:process.cwd(),path:process.env[gt()],execPath:process.execPath},e);let t,n=k.resolve(e.cwd),r=[];for(;t!==n;)r.push(k.join(n,"node_modules/.bin")),t=n,n=k.resolve(n,"..");let o=k.resolve(e.cwd,e.execPath,"..");return r.push(o),r.concat(e.path).join(k.delimiter)};F.exports=wt;F.exports.default=wt;F.exports.env=e=>{e=f({env:process.env},e);let t=f({},e.env),n=gt({env:t});return e.path=t[n],t[n]=F.exports(e),t}});var Et=c((Do,le)=>{"use strict";var vt=(e,t)=>{for(let n of Reflect.ownKeys(t))Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n));return e};le.exports=vt;le.exports.default=vt});var Tt=c((Xo,D)=>{"use strict";var nr=Et(),U=new WeakMap,It=(e,t={})=>{if(typeof e!="function")throw new TypeError("Expected a function");let n,r=0,o=e.displayName||e.name||"<anonymous>",s=function(...i){if(U.set(s,++r),r===1)n=e.apply(this,i),e=null;else if(t.throw===!0)throw new Error(`Function \`${o}\` can only be called once`);return n};return nr(s,e),U.set(s,r),s};D.exports=It;D.exports.default=It;D.exports.callCount=e=>{if(!U.has(e))throw new Error(`The given function \`${e.name}\` is not wrapped by the \`onetime\` package`);return U.get(e)}});var Pt=c(X=>{"use strict";Object.defineProperty(X,"__esModule",{value:!0});X.SIGNALS=void 0;var rr=[{name:"SIGHUP",number:1,action:"terminate",description:"Terminal closed",standard:"posix"},{name:"SIGINT",number:2,action:"terminate",description:"User interruption with CTRL-C",standard:"ansi"},{name:"SIGQUIT",number:3,action:"core",description:"User interruption with CTRL-\\",standard:"posix"},{name:"SIGILL",number:4,action:"core",description:"Invalid machine instruction",standard:"ansi"},{name:"SIGTRAP",number:5,action:"core",description:"Debugger breakpoint",standard:"posix"},{name:"SIGABRT",number:6,action:"core",description:"Aborted",standard:"ansi"},{name:"SIGIOT",number:6,action:"core",description:"Aborted",standard:"bsd"},{name:"SIGBUS",number:7,action:"core",description:"Bus error due to misaligned, non-existing address or paging error",standard:"bsd"},{name:"SIGEMT",number:7,action:"terminate",description:"Command should be emulated but is not implemented",standard:"other"},{name:"SIGFPE",number:8,action:"core",description:"Floating point arithmetic error",standard:"ansi"},{name:"SIGKILL",number:9,action:"terminate",description:"Forced termination",standard:"posix",forced:!0},{name:"SIGUSR1",number:10,action:"terminate",description:"Application-specific signal",standard:"posix"},{name:"SIGSEGV",number:11,action:"core",description:"Segmentation fault",standard:"ansi"},{name:"SIGUSR2",number:12,action:"terminate",description:"Application-specific signal",standard:"posix"},{name:"SIGPIPE",number:13,action:"terminate",description:"Broken pipe or socket",standard:"posix"},{name:"SIGALRM",number:14,action:"terminate",description:"Timeout or timer",standard:"posix"},{name:"SIGTERM",number:15,action:"terminate",description:"Termination",standard:"ansi"},{name:"SIGSTKFLT",number:16,action:"terminate",description:"Stack is empty or overflowed",standard:"other"},{name:"SIGCHLD",number:17,action:"ignore",description:"Child process terminated, paused or unpaused",standard:"posix"},{name:"SIGCLD",number:17,action:"ignore",description:"Child process terminated, paused or unpaused",standard:"other"},{name:"SIGCONT",number:18,action:"unpause",description:"Unpaused",standard:"posix",forced:!0},{name:"SIGSTOP",number:19,action:"pause",description:"Paused",standard:"posix",forced:!0},{name:"SIGTSTP",number:20,action:"pause",description:'Paused using CTRL-Z or "suspend"',standard:"posix"},{name:"SIGTTIN",number:21,action:"pause",description:"Background process cannot read terminal input",standard:"posix"},{name:"SIGBREAK",number:21,action:"terminate",description:"User interruption with CTRL-BREAK",standard:"other"},{name:"SIGTTOU",number:22,action:"pause",description:"Background process cannot write to terminal output",standard:"posix"},{name:"SIGURG",number:23,action:"ignore",description:"Socket received out-of-band data",standard:"bsd"},{name:"SIGXCPU",number:24,action:"core",description:"Process timed out",standard:"bsd"},{name:"SIGXFSZ",number:25,action:"core",description:"File too big",standard:"bsd"},{name:"SIGVTALRM",number:26,action:"terminate",description:"Timeout or timer",standard:"bsd"},{name:"SIGPROF",number:27,action:"terminate",description:"Timeout or timer",standard:"bsd"},{name:"SIGWINCH",number:28,action:"ignore",description:"Terminal window size changed",standard:"bsd"},{name:"SIGIO",number:29,action:"terminate",description:"I/O is available",standard:"other"},{name:"SIGPOLL",number:29,action:"terminate",description:"Watched event",standard:"other"},{name:"SIGINFO",number:29,action:"ignore",description:"Request for process information",standard:"other"},{name:"SIGPWR",number:30,action:"terminate",description:"Device running out of power",standard:"systemv"},{name:"SIGSYS",number:31,action:"core",description:"Invalid system call",standard:"other"},{name:"SIGUNUSED",number:31,action:"terminate",description:"Invalid system call",standard:"other"}];X.SIGNALS=rr});var de=c(G=>{"use strict";Object.defineProperty(G,"__esModule",{value:!0});G.SIGRTMAX=G.getRealtimeSignals=void 0;var or=function(){let e=Ct-Gt+1;return Array.from({length:e},sr)};G.getRealtimeSignals=or;var sr=function(e,t){return{name:`SIGRT${t+1}`,number:Gt+t,action:"terminate",description:"Application-specific signal (realtime)",standard:"posix"}},Gt=34,Ct=64;G.SIGRTMAX=Ct});var At=c(H=>{"use strict";Object.defineProperty(H,"__esModule",{value:!0});H.getSignals=void 0;var ir=require("os"),ar=Pt(),cr=de(),ur=function(){let e=(0,cr.getRealtimeSignals)();return[...ar.SIGNALS,...e].map(lr)};H.getSignals=ur;var lr=function({name:e,number:t,description:n,action:r,forced:o=!1,standard:s}){let{signals:{[e]:i}}=ir.constants,a=i!==void 0;return{name:e,number:a?i:t,description:n,supported:a,action:r,forced:o,standard:s}}});var Ot=c(C=>{"use strict";Object.defineProperty(C,"__esModule",{value:!0});C.signalsByNumber=C.signalsByName=void 0;var dr=require("os"),qt=At(),fr=de(),pr=function(){return(0,qt.getSignals)().reduce(mr,{})},mr=function(e,{name:t,number:n,description:r,supported:o,action:s,forced:i,standard:a}){return b(f({},e),{[t]:{name:t,number:n,description:r,supported:o,action:s,forced:i,standard:a}})},hr=pr();C.signalsByName=hr;var yr=function(){let e=(0,qt.getSignals)(),t=fr.SIGRTMAX+1,n=Array.from({length:t},(r,o)=>Sr(o,e));return Object.assign({},...n)},Sr=function(e,t){let n=xr(e,t);if(n===void 0)return{};let{name:r,description:o,supported:s,action:i,forced:a,standard:u}=n;return{[e]:{name:r,number:e,description:o,supported:s,action:i,forced:a,standard:u}}},xr=function(e,t){let n=t.find(({name:r})=>dr.constants.signals[r]===e);return n!==void 0?n:t.find(r=>r.number===e)},gr=yr();C.signalsByNumber=gr});var Nt=c((Vo,Rt)=>{"use strict";var{signalsByName:wr}=Ot(),br=({timedOut:e,timeout:t,errorCode:n,signal:r,signalDescription:o,exitCode:s,isCanceled:i})=>e?`timed out after ${t} milliseconds`:i?"was canceled":n!==void 0?`failed with ${n}`:r!==void 0?`was killed with ${r} (${o})`:s!==void 0?`failed with exit code ${s}`:"failed",vr=({stdout:e,stderr:t,all:n,error:r,signal:o,exitCode:s,command:i,escapedCommand:a,timedOut:u,isCanceled:l,killed:p,parsed:{options:{timeout:y}}})=>{s=s===null?void 0:s,o=o===null?void 0:o;let h=o===void 0?void 0:wr[o].description,S=r&&r.code,g=`Command ${br({timedOut:u,timeout:y,errorCode:S,signal:o,signalDescription:h,exitCode:s,isCanceled:l})}: ${i}`,I=Object.prototype.toString.call(r)==="[object Error]",L=I?`${g}
${r.message}`:g,M=[L,t,e].filter(Boolean).join(`
`);return I?(r.originalMessage=r.message,r.message=M):r=new Error(M),r.shortMessage=L,r.command=i,r.escapedCommand=a,r.exitCode=s,r.signal=o,r.signalDescription=h,r.stdout=e,r.stderr=t,n!==void 0&&(r.all=n),"bufferedData"in r&&delete r.bufferedData,r.failed=!0,r.timedOut=Boolean(u),r.isCanceled=l,r.killed=p&&!u,r};Rt.exports=vr});var Ft=c((Yo,fe)=>{"use strict";var K=["stdin","stdout","stderr"],Er=e=>K.some(t=>e[t]!==void 0),kt=e=>{if(!e)return;let{stdio:t}=e;if(t===void 0)return K.map(r=>e[r]);if(Er(e))throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${K.map(r=>`\`${r}\``).join(", ")}`);if(typeof t=="string")return t;if(!Array.isArray(t))throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof t}\``);let n=Math.max(t.length,K.length);return Array.from({length:n},(r,o)=>t[o])};fe.exports=kt;fe.exports.node=e=>{let t=kt(e);return t==="ipc"?"ipc":t===void 0||typeof t=="string"?[t,t,t,"ipc"]:t.includes("ipc")?t:[...t,"ipc"]}});var _t=c((Qo,W)=>{W.exports=["SIGABRT","SIGALRM","SIGHUP","SIGINT","SIGTERM"];process.platform!=="win32"&&W.exports.push("SIGVTALRM","SIGXCPU","SIGXFSZ","SIGUSR2","SIGTRAP","SIGSYS","SIGQUIT","SIGIOT");process.platform==="linux"&&W.exports.push("SIGIO","SIGPOLL","SIGPWR","SIGSTKFLT","SIGUNUSED")});var jt=c((Zo,O)=>{var d=global.process,v=function(e){return e&&typeof e=="object"&&typeof e.removeListener=="function"&&typeof e.emit=="function"&&typeof e.reallyExit=="function"&&typeof e.listeners=="function"&&typeof e.kill=="function"&&typeof e.pid=="number"&&typeof e.on=="function"};v(d)?(Bt=require("assert"),A=_t(),$t=/^win/i.test(d.platform),_=require("events"),typeof _!="function"&&(_=_.EventEmitter),d.__signal_exit_emitter__?m=d.__signal_exit_emitter__:(m=d.__signal_exit_emitter__=new _,m.count=0,m.emitted={}),m.infinite||(m.setMaxListeners(1/0),m.infinite=!0),O.exports=function(e,t){if(!!v(global.process)){Bt.equal(typeof e,"function","a callback must be provided for exit handler"),q===!1&&pe();var n="exit";t&&t.alwaysLast&&(n="afterexit");var r=function(){m.removeListener(n,e),m.listeners("exit").length===0&&m.listeners("afterexit").length===0&&z()};return m.on(n,e),r}},z=function(){!q||!v(global.process)||(q=!1,A.forEach(function(t){try{d.removeListener(t,V[t])}catch{}}),d.emit=Y,d.reallyExit=me,m.count-=1)},O.exports.unload=z,E=function(t,n,r){m.emitted[t]||(m.emitted[t]=!0,m.emit(t,n,r))},V={},A.forEach(function(e){V[e]=function(){if(!!v(global.process)){var n=d.listeners(e);n.length===m.count&&(z(),E("exit",null,e),E("afterexit",null,e),$t&&e==="SIGHUP"&&(e="SIGINT"),d.kill(d.pid,e))}}}),O.exports.signals=function(){return A},q=!1,pe=function(){q||!v(global.process)||(q=!0,m.count+=1,A=A.filter(function(t){try{return d.on(t,V[t]),!0}catch{return!1}}),d.emit=Mt,d.reallyExit=Lt)},O.exports.load=pe,me=d.reallyExit,Lt=function(t){!v(global.process)||(d.exitCode=t||0,E("exit",d.exitCode,null),E("afterexit",d.exitCode,null),me.call(d,d.exitCode))},Y=d.emit,Mt=function(t,n){if(t==="exit"&&v(global.process)){n!==void 0&&(d.exitCode=n);var r=Y.apply(this,arguments);return E("exit",d.exitCode,null),E("afterexit",d.exitCode,null),r}else return Y.apply(this,arguments)}):O.exports=function(){};var Bt,A,$t,_,m,z,E,V,q,pe,me,Lt,Y,Mt});var Dt=c((Jo,Ut)=>{"use strict";var Ir=require("os"),Tr=jt(),Pr=1e3*5,Gr=(e,t="SIGTERM",n={})=>{let r=e(t);return Cr(e,t,n,r),r},Cr=(e,t,n,r)=>{if(!Ar(t,n,r))return;let o=Or(n),s=setTimeout(()=>{e("SIGKILL")},o);s.unref&&s.unref()},Ar=(e,{forceKillAfterTimeout:t},n)=>qr(e)&&t!==!1&&n,qr=e=>e===Ir.constants.signals.SIGTERM||typeof e=="string"&&e.toUpperCase()==="SIGTERM",Or=({forceKillAfterTimeout:e=!0})=>{if(e===!0)return Pr;if(!Number.isFinite(e)||e<0)throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${e}\` (${typeof e})`);return e},Rr=(e,t)=>{e.kill()&&(t.isCanceled=!0)},Nr=(e,t,n)=>{e.kill(t),n(Object.assign(new Error("Timed out"),{timedOut:!0,signal:t}))},kr=(e,{timeout:t,killSignal:n="SIGTERM"},r)=>{if(t===0||t===void 0)return r;let o,s=new Promise((a,u)=>{o=setTimeout(()=>{Nr(e,n,u)},t)}),i=r.finally(()=>{clearTimeout(o)});return Promise.race([s,i])},Fr=({timeout:e})=>{if(e!==void 0&&(!Number.isFinite(e)||e<0))throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${e}\` (${typeof e})`)},_r=async(e,{cleanup:t,detached:n},r)=>{if(!t||n)return r;let o=Tr(()=>{e.kill()});return r.finally(()=>{o()})};Ut.exports={spawnedKill:Gr,spawnedCancel:Rr,setupTimeout:kr,validateTimeout:Fr,setExitHandler:_r}});var Ht=c((es,Xt)=>{"use strict";var w=e=>e!==null&&typeof e=="object"&&typeof e.pipe=="function";w.writable=e=>w(e)&&e.writable!==!1&&typeof e._write=="function"&&typeof e._writableState=="object";w.readable=e=>w(e)&&e.readable!==!1&&typeof e._read=="function"&&typeof e._readableState=="object";w.duplex=e=>w.writable(e)&&w.readable(e);w.transform=e=>w.duplex(e)&&typeof e._transform=="function";Xt.exports=w});var Wt=c((ts,Kt)=>{"use strict";var{PassThrough:Br}=require("stream");Kt.exports=e=>{e=f({},e);let{array:t}=e,{encoding:n}=e,r=n==="buffer",o=!1;t?o=!(n||r):n=n||"utf8",r&&(n=null);let s=new Br({objectMode:o});n&&s.setEncoding(n);let i=0,a=[];return s.on("data",u=>{a.push(u),o?i=a.length:i+=u.length}),s.getBufferedValue=()=>t?a:r?Buffer.concat(a,i):a.join(""),s.getBufferedLength=()=>i,s}});var zt=c((ns,B)=>{"use strict";var{constants:$r}=require("buffer"),Lr=require("stream"),{promisify:Mr}=require("util"),jr=Wt(),Ur=Mr(Lr.pipeline),he=class extends Error{constructor(){super("maxBuffer exceeded");this.name="MaxBufferError"}};async function ye(e,t){if(!e)throw new Error("Expected a stream");t=f({maxBuffer:1/0},t);let{maxBuffer:n}=t,r=jr(t);return await new Promise((o,s)=>{let i=a=>{a&&r.getBufferedLength()<=$r.MAX_LENGTH&&(a.bufferedData=r.getBufferedValue()),s(a)};(async()=>{try{await Ur(e,r),o()}catch(a){i(a)}})(),r.on("data",()=>{r.getBufferedLength()>n&&i(new he)})}),r.getBufferedValue()}B.exports=ye;B.exports.buffer=(e,t)=>ye(e,b(f({},t),{encoding:"buffer"}));B.exports.array=(e,t)=>ye(e,b(f({},t),{array:!0}));B.exports.MaxBufferError=he});var Yt=c((rs,Vt)=>{"use strict";var{PassThrough:Dr}=require("stream");Vt.exports=function(){var e=[],t=new Dr({objectMode:!0});return t.setMaxListeners(0),t.add=n,t.isEmpty=r,t.on("unpipe",o),Array.prototype.slice.call(arguments).forEach(n),t;function n(s){return Array.isArray(s)?(s.forEach(n),this):(e.push(s),s.once("end",o.bind(null,s)),s.once("error",t.emit.bind(t,"error")),s.pipe(t,{end:!1}),this)}function r(){return e.length==0}function o(s){e=e.filter(function(i){return i!==s}),!e.length&&t.readable&&t.end()}}});var en=c((os,Jt)=>{"use strict";var Zt=Ht(),Qt=zt(),Xr=Yt(),Hr=(e,t)=>{t===void 0||e.stdin===void 0||(Zt(t)?t.pipe(e.stdin):e.stdin.end(t))},Kr=(e,{all:t})=>{if(!t||!e.stdout&&!e.stderr)return;let n=Xr();return e.stdout&&n.add(e.stdout),e.stderr&&n.add(e.stderr),n},Se=async(e,t)=>{if(!!e){e.destroy();try{return await t}catch(n){return n.bufferedData}}},xe=(e,{encoding:t,buffer:n,maxBuffer:r})=>{if(!(!e||!n))return t?Qt(e,{encoding:t,maxBuffer:r}):Qt.buffer(e,{maxBuffer:r})},Wr=async({stdout:e,stderr:t,all:n},{encoding:r,buffer:o,maxBuffer:s},i)=>{let a=xe(e,{encoding:r,buffer:o,maxBuffer:s}),u=xe(t,{encoding:r,buffer:o,maxBuffer:s}),l=xe(n,{encoding:r,buffer:o,maxBuffer:s*2});try{return await Promise.all([i,a,u,l])}catch(p){return Promise.all([{error:p,signal:p.signal,timedOut:p.timedOut},Se(e,a),Se(t,u),Se(n,l)])}},zr=({input:e})=>{if(Zt(e))throw new TypeError("The `input` option cannot be a stream in sync mode")};Jt.exports={handleInput:Hr,makeAllStream:Kr,getSpawnedResult:Wr,validateInputSync:zr}});var nn=c((ss,tn)=>{"use strict";var Vr=(async()=>{})().constructor.prototype,Yr=["then","catch","finally"].map(e=>[e,Reflect.getOwnPropertyDescriptor(Vr,e)]),Qr=(e,t)=>{for(let[n,r]of Yr){let o=typeof t=="function"?(...s)=>Reflect.apply(r.value,t(),s):r.value.bind(t);Reflect.defineProperty(e,n,b(f({},r),{value:o}))}return e},Zr=e=>new Promise((t,n)=>{e.on("exit",(r,o)=>{t({exitCode:r,signal:o})}),e.on("error",r=>{n(r)}),e.stdin&&e.stdin.on("error",r=>{n(r)})});tn.exports={mergePromise:Qr,getSpawnedPromise:Zr}});var sn=c((is,on)=>{"use strict";var rn=(e,t=[])=>Array.isArray(t)?[e,...t]:[e],Jr=/^[\w.-]+$/,eo=/"/g,to=e=>typeof e!="string"||Jr.test(e)?e:`"${e.replace(eo,'\\"')}"`,no=(e,t)=>rn(e,t).join(" "),ro=(e,t)=>rn(e,t).map(n=>to(n)).join(" "),oo=/ +/g,so=e=>{let t=[];for(let n of e.trim().split(oo)){let r=t[t.length-1];r&&r.endsWith("\\")?t[t.length-1]=`${r.slice(0,-1)} ${n}`:t.push(n)}return t};on.exports={joinCommand:no,getEscapedCommand:ro,parseCommand:so}});var pn=c((as,R)=>{"use strict";var io=require("path"),ge=require("child_process"),ao=yt(),co=xt(),uo=bt(),lo=Tt(),Q=Nt(),cn=Ft(),{spawnedKill:fo,spawnedCancel:po,setupTimeout:mo,validateTimeout:ho,setExitHandler:yo}=Dt(),{handleInput:So,getSpawnedResult:xo,makeAllStream:go,validateInputSync:wo}=en(),{mergePromise:an,getSpawnedPromise:bo}=nn(),{joinCommand:un,parseCommand:ln,getEscapedCommand:dn}=sn(),vo=1e3*1e3*100,Eo=({env:e,extendEnv:t,preferLocal:n,localDir:r,execPath:o})=>{let s=t?f(f({},process.env),e):e;return n?uo.env({env:s,cwd:r,execPath:o}):s},fn=(e,t,n={})=>{let r=ao._parse(e,t,n);return e=r.command,t=r.args,n=r.options,n=f({maxBuffer:vo,buffer:!0,stripFinalNewline:!0,extendEnv:!0,preferLocal:!1,localDir:n.cwd||process.cwd(),execPath:process.execPath,encoding:"utf8",reject:!0,cleanup:!0,all:!1,windowsHide:!0},n),n.env=Eo(n),n.stdio=cn(n),process.platform==="win32"&&io.basename(e,".exe")==="cmd"&&t.unshift("/q"),{file:e,args:t,options:n,parsed:r}},$=(e,t,n)=>typeof t!="string"&&!Buffer.isBuffer(t)?n===void 0?void 0:"":e.stripFinalNewline?co(t):t,Z=(e,t,n)=>{let r=fn(e,t,n),o=un(e,t),s=dn(e,t);ho(r.options);let i;try{i=ge.spawn(r.file,r.args,r.options)}catch(S){let x=new ge.ChildProcess,g=Promise.reject(Q({error:S,stdout:"",stderr:"",all:"",command:o,escapedCommand:s,parsed:r,timedOut:!1,isCanceled:!1,killed:!1}));return an(x,g)}let a=bo(i),u=mo(i,r.options,a),l=yo(i,r.options,u),p={isCanceled:!1};i.kill=fo.bind(null,i.kill.bind(i)),i.cancel=po.bind(null,i,p);let h=lo(async()=>{let[{error:S,exitCode:x,signal:g,timedOut:I},L,M,wn]=await xo(i,r.options,l),we=$(r.options,L),be=$(r.options,M),ve=$(r.options,wn);if(S||x!==0||g!==null){let Ee=Q({error:S,exitCode:x,signal:g,stdout:we,stderr:be,all:ve,command:o,escapedCommand:s,parsed:r,timedOut:I,isCanceled:p.isCanceled,killed:i.killed});if(!r.options.reject)return Ee;throw Ee}return{command:o,escapedCommand:s,exitCode:0,stdout:we,stderr:be,all:ve,failed:!1,timedOut:!1,isCanceled:!1,killed:!1}});return So(i,r.options.input),i.all=go(i,r.options),an(i,h)};R.exports=Z;R.exports.sync=(e,t,n)=>{let r=fn(e,t,n),o=un(e,t),s=dn(e,t);wo(r.options);let i;try{i=ge.spawnSync(r.file,r.args,r.options)}catch(l){throw Q({error:l,stdout:"",stderr:"",all:"",command:o,escapedCommand:s,parsed:r,timedOut:!1,isCanceled:!1,killed:!1})}let a=$(r.options,i.stdout,i.error),u=$(r.options,i.stderr,i.error);if(i.error||i.status!==0||i.signal!==null){let l=Q({stdout:a,stderr:u,error:i.error,signal:i.signal,exitCode:i.status,command:o,escapedCommand:s,parsed:r,timedOut:i.error&&i.error.code==="ETIMEDOUT",isCanceled:!1,killed:i.signal!==null});if(!r.options.reject)return l;throw l}return{command:o,escapedCommand:s,exitCode:0,stdout:a,stderr:u,failed:!1,timedOut:!1,isCanceled:!1,killed:!1}};R.exports.command=(e,t)=>{let[n,...r]=ln(e);return Z(n,r,t)};R.exports.commandSync=(e,t)=>{let[n,...r]=ln(e);return Z.sync(n,r,t)};R.exports.node=(e,t,n={})=>{t&&!Array.isArray(t)&&typeof t=="object"&&(n=t,t=[]);let r=cn.node(n),o=process.execArgv.filter(a=>!a.startsWith("--inspect")),{nodePath:s=process.execPath,nodeOptions:i=o}=n;return Z(s,[...i,e,...Array.isArray(t)?t:[]],b(f({},n),{stdin:void 0,stdout:void 0,stderr:void 0,stdio:r,shell:!1}))}});var To={};Cn(To,{default:()=>Io});var Sn=require("@raycast/api");var mn=Ae(require("node:process"),1),hn=Ae(pn(),1);async function yn(e){if(mn.default.platform!=="darwin")throw new Error("macOS only");let{stdout:t}=await(0,hn.default)("osascript",["-e",e]);return t}async function xn(){return(await(0,Sn.getApplications)()).some(({bundleId:t})=>t==="design.yugen.Flow")}async function gn(){await yn('tell application "Flow" to show')}var J=require("@raycast/api");async function Io(){let e=new J.Toast({title:"Showing timer",style:J.Toast.Style.Animated});if(e.show(),!await xn()){e.title="Flow not installed",e.message="Install it from: https://flowapp.info/download",e.style=J.Toast.Style.Failure;return}await gn()}module.exports=An(To);0&&(module.exports={});