var bn=Object.create;var k=Object.defineProperty,vn=Object.defineProperties,En=Object.getOwnPropertyDescriptor,In=Object.getOwnPropertyDescriptors,Tn=Object.getOwnPropertyNames,Ee=Object.getOwnPropertySymbols,Pn=Object.getPrototypeOf,Te=Object.prototype.hasOwnProperty,Cn=Object.prototype.propertyIsEnumerable;var Ie=(e,t,n)=>t in e?k(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,f=(e,t)=>{for(var n in t||(t={}))Te.call(t,n)&&Ie(e,n,t[n]);if(Ee)for(var n of Ee(t))Cn.call(t,n)&&Ie(e,n,t[n]);return e},b=(e,t)=>vn(e,In(t)),Pe=e=>k(e,"__esModule",{value:!0});var c=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),Gn=(e,t)=>{for(var n in t)k(e,n,{get:t[n],enumerable:!0})},Ce=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of Tn(t))!Te.call(e,s)&&(n||s!=="default")&&k(e,s,{get:()=>t[s],enumerable:!(r=En(t,s))||r.enumerable});return e},Ge=(e,t)=>Ce(Pe(k(e!=null?bn(Pn(e)):{},"default",!t&&e&&e.__esModule?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e),An=(e=>(t,n)=>e&&e.get(t)||(n=Ce(Pe({}),t,1),e&&e.set(t,n),n))(typeof WeakMap!="undefined"?new WeakMap:0);var ke=c((Ts,qe)=>{qe.exports=Re;Re.sync=Rn;var Ae=require("fs");function On(e,t){var n=t.pathExt!==void 0?t.pathExt:process.env.PATHEXT;if(!n||(n=n.split(";"),n.indexOf("")!==-1))return!0;for(var r=0;r<n.length;r++){var s=n[r].toLowerCase();if(s&&e.substr(-s.length).toLowerCase()===s)return!0}return!1}function Oe(e,t,n){return!e.isSymbolicLink()&&!e.isFile()?!1:On(t,n)}function Re(e,t,n){Ae.stat(e,function(r,s){n(r,r?!1:Oe(s,e,t))})}function Rn(e,t){return Oe(Ae.statSync(e),e,t)}});var Le=c((Ps,Be)=>{Be.exports=_e;_e.sync=qn;var Ne=require("fs");function _e(e,t,n){Ne.stat(e,function(r,s){n(r,r?!1:$e(s,t))})}function qn(e,t){return $e(Ne.statSync(e),t)}function $e(e,t){return e.isFile()&&kn(e,t)}function kn(e,t){var n=e.mode,r=e.uid,s=e.gid,o=t.uid!==void 0?t.uid:process.getuid&&process.getuid(),i=t.gid!==void 0?t.gid:process.getgid&&process.getgid(),a=parseInt("100",8),u=parseInt("010",8),l=parseInt("001",8),p=a|u,S=n&l||n&u&&s===i||n&a&&r===o||n&p&&o===0;return S}});var je=c((Gs,Me)=>{var Cs=require("fs"),F;process.platform==="win32"||global.TESTING_WINDOWS?F=ke():F=Le();Me.exports=J;J.sync=Nn;function J(e,t,n){if(typeof t=="function"&&(n=t,t={}),!n){if(typeof Promise!="function")throw new TypeError("callback not provided");return new Promise(function(r,s){J(e,t||{},function(o,i){o?s(o):r(i)})})}F(e,t||{},function(r,s){r&&(r.code==="EACCES"||t&&t.ignoreErrors)&&(r=null,s=!1),n(r,s)})}function Nn(e,t){try{return F.sync(e,t||{})}catch(n){if(t&&t.ignoreErrors||n.code==="EACCES")return!1;throw n}}});var We=c((As,Ke)=>{var T=process.platform==="win32"||process.env.OSTYPE==="cygwin"||process.env.OSTYPE==="msys",Fe=require("path"),_n=T?";":":",Ue=je(),De=e=>Object.assign(new Error(`not found: ${e}`),{code:"ENOENT"}),He=(e,t)=>{let n=t.colon||_n,r=e.match(/\//)||T&&e.match(/\\/)?[""]:[...T?[process.cwd()]:[],...(t.path||process.env.PATH||"").split(n)],s=T?t.pathExt||process.env.PATHEXT||".EXE;.CMD;.BAT;.COM":"",o=T?s.split(n):[""];return T&&e.indexOf(".")!==-1&&o[0]!==""&&o.unshift(""),{pathEnv:r,pathExt:o,pathExtExe:s}},Xe=(e,t,n)=>{typeof t=="function"&&(n=t,t={}),t||(t={});let{pathEnv:r,pathExt:s,pathExtExe:o}=He(e,t),i=[],a=l=>new Promise((p,S)=>{if(l===r.length)return t.all&&i.length?p(i):S(De(e));let h=r[l],g=/^".*"$/.test(h)?h.slice(1,-1):h,y=Fe.join(g,e),x=!g&&/^\.[\\\/]/.test(e)?e.slice(0,2)+y:y;p(u(x,l,0))}),u=(l,p,S)=>new Promise((h,g)=>{if(S===s.length)return h(a(p+1));let y=s[S];Ue(l+y,{pathExt:o},(x,I)=>{if(!x&&I)if(t.all)i.push(l+y);else return h(l+y);return h(u(l,p,S+1))})});return n?a(0).then(l=>n(null,l),n):a(0)},$n=(e,t)=>{t=t||{};let{pathEnv:n,pathExt:r,pathExtExe:s}=He(e,t),o=[];for(let i=0;i<n.length;i++){let a=n[i],u=/^".*"$/.test(a)?a.slice(1,-1):a,l=Fe.join(u,e),p=!u&&/^\.[\\\/]/.test(e)?e.slice(0,2)+l:l;for(let S=0;S<r.length;S++){let h=p+r[S];try{if(Ue.sync(h,{pathExt:s}))if(t.all)o.push(h);else return h}catch{}}}if(t.all&&o.length)return o;if(t.nothrow)return null;throw De(e)};Ke.exports=Xe;Xe.sync=$n});var te=c((Os,ee)=>{"use strict";var ze=(e={})=>{let t=e.env||process.env;return(e.platform||process.platform)!=="win32"?"PATH":Object.keys(t).reverse().find(r=>r.toUpperCase()==="PATH")||"Path"};ee.exports=ze;ee.exports.default=ze});var Ze=c((Rs,Qe)=>{"use strict";var Ve=require("path"),Bn=We(),Ln=te();function Ye(e,t){let n=e.options.env||process.env,r=process.cwd(),s=e.options.cwd!=null,o=s&&process.chdir!==void 0&&!process.chdir.disabled;if(o)try{process.chdir(e.options.cwd)}catch{}let i;try{i=Bn.sync(e.command,{path:n[Ln({env:n})],pathExt:t?Ve.delimiter:void 0})}catch{}finally{o&&process.chdir(r)}return i&&(i=Ve.resolve(s?e.options.cwd:"",i)),i}function Mn(e){return Ye(e)||Ye(e,!0)}Qe.exports=Mn});var Je=c((qs,re)=>{"use strict";var ne=/([()\][%!^"`<>&|;, *?])/g;function jn(e){return e=e.replace(ne,"^$1"),e}function Fn(e,t){return e=`${e}`,e=e.replace(/(\\*)"/g,'$1$1\\"'),e=e.replace(/(\\*)$/,"$1$1"),e=`"${e}"`,e=e.replace(ne,"^$1"),t&&(e=e.replace(ne,"^$1")),e}re.exports.command=jn;re.exports.argument=Fn});var tt=c((ks,et)=>{"use strict";et.exports=/^#!(.*)/});var rt=c((Ns,nt)=>{"use strict";var Un=tt();nt.exports=(e="")=>{let t=e.match(Un);if(!t)return null;let[n,r]=t[0].replace(/#! ?/,"").split(" "),s=n.split("/").pop();return s==="env"?r:r?`${s} ${r}`:s}});var ot=c((_s,st)=>{"use strict";var se=require("fs"),Dn=rt();function Hn(e){let n=Buffer.alloc(150),r;try{r=se.openSync(e,"r"),se.readSync(r,n,0,150,0),se.closeSync(r)}catch{}return Dn(n.toString())}st.exports=Hn});var ut=c(($s,ct)=>{"use strict";var Xn=require("path"),it=Ze(),at=Je(),Kn=ot(),Wn=process.platform==="win32",zn=/\.(?:com|exe)$/i,Vn=/node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;function Yn(e){e.file=it(e);let t=e.file&&Kn(e.file);return t?(e.args.unshift(e.file),e.command=t,it(e)):e.file}function Qn(e){if(!Wn)return e;let t=Yn(e),n=!zn.test(t);if(e.options.forceShell||n){let r=Vn.test(t);e.command=Xn.normalize(e.command),e.command=at.command(e.command),e.args=e.args.map(o=>at.argument(o,r));let s=[e.command].concat(e.args).join(" ");e.args=["/d","/s","/c",`"${s}"`],e.command=process.env.comspec||"cmd.exe",e.options.windowsVerbatimArguments=!0}return e}function Zn(e,t,n){t&&!Array.isArray(t)&&(n=t,t=null),t=t?t.slice(0):[],n=Object.assign({},n);let r={command:e,args:t,options:n,file:void 0,original:{command:e,args:t}};return n.shell?r:Qn(r)}ct.exports=Zn});var ft=c((Bs,dt)=>{"use strict";var oe=process.platform==="win32";function ie(e,t){return Object.assign(new Error(`${t} ${e.command} ENOENT`),{code:"ENOENT",errno:"ENOENT",syscall:`${t} ${e.command}`,path:e.command,spawnargs:e.args})}function Jn(e,t){if(!oe)return;let n=e.emit;e.emit=function(r,s){if(r==="exit"){let o=lt(s,t,"spawn");if(o)return n.call(e,"error",o)}return n.apply(e,arguments)}}function lt(e,t){return oe&&e===1&&!t.file?ie(t.original,"spawn"):null}function er(e,t){return oe&&e===1&&!t.file?ie(t.original,"spawnSync"):null}dt.exports={hookChildProcess:Jn,verifyENOENT:lt,verifyENOENTSync:er,notFoundError:ie}});var ht=c((Ls,P)=>{"use strict";var pt=require("child_process"),ae=ut(),ce=ft();function mt(e,t,n){let r=ae(e,t,n),s=pt.spawn(r.command,r.args,r.options);return ce.hookChildProcess(s,r),s}function tr(e,t,n){let r=ae(e,t,n),s=pt.spawnSync(r.command,r.args,r.options);return s.error=s.error||ce.verifyENOENTSync(s.status,r),s}P.exports=mt;P.exports.spawn=mt;P.exports.sync=tr;P.exports._parse=ae;P.exports._enoent=ce});var gt=c((Ms,St)=>{"use strict";St.exports=e=>{let t=typeof e=="string"?`
`:`
`.charCodeAt(),n=typeof e=="string"?"\r":"\r".charCodeAt();return e[e.length-1]===t&&(e=e.slice(0,e.length-1)),e[e.length-1]===n&&(e=e.slice(0,e.length-1)),e}});var wt=c((js,_)=>{"use strict";var N=require("path"),yt=te(),xt=e=>{e=f({cwd:process.cwd(),path:process.env[yt()],execPath:process.execPath},e);let t,n=N.resolve(e.cwd),r=[];for(;t!==n;)r.push(N.join(n,"node_modules/.bin")),t=n,n=N.resolve(n,"..");let s=N.resolve(e.cwd,e.execPath,"..");return r.push(s),r.concat(e.path).join(N.delimiter)};_.exports=xt;_.exports.default=xt;_.exports.env=e=>{e=f({env:process.env},e);let t=f({},e.env),n=yt({env:t});return e.path=t[n],t[n]=_.exports(e),t}});var vt=c((Fs,ue)=>{"use strict";var bt=(e,t)=>{for(let n of Reflect.ownKeys(t))Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n));return e};ue.exports=bt;ue.exports.default=bt});var It=c((Us,D)=>{"use strict";var nr=vt(),U=new WeakMap,Et=(e,t={})=>{if(typeof e!="function")throw new TypeError("Expected a function");let n,r=0,s=e.displayName||e.name||"<anonymous>",o=function(...i){if(U.set(o,++r),r===1)n=e.apply(this,i),e=null;else if(t.throw===!0)throw new Error(`Function \`${s}\` can only be called once`);return n};return nr(o,e),U.set(o,r),o};D.exports=Et;D.exports.default=Et;D.exports.callCount=e=>{if(!U.has(e))throw new Error(`The given function \`${e.name}\` is not wrapped by the \`onetime\` package`);return U.get(e)}});var Tt=c(H=>{"use strict";Object.defineProperty(H,"__esModule",{value:!0});H.SIGNALS=void 0;var rr=[{name:"SIGHUP",number:1,action:"terminate",description:"Terminal closed",standard:"posix"},{name:"SIGINT",number:2,action:"terminate",description:"User interruption with CTRL-C",standard:"ansi"},{name:"SIGQUIT",number:3,action:"core",description:"User interruption with CTRL-\\",standard:"posix"},{name:"SIGILL",number:4,action:"core",description:"Invalid machine instruction",standard:"ansi"},{name:"SIGTRAP",number:5,action:"core",description:"Debugger breakpoint",standard:"posix"},{name:"SIGABRT",number:6,action:"core",description:"Aborted",standard:"ansi"},{name:"SIGIOT",number:6,action:"core",description:"Aborted",standard:"bsd"},{name:"SIGBUS",number:7,action:"core",description:"Bus error due to misaligned, non-existing address or paging error",standard:"bsd"},{name:"SIGEMT",number:7,action:"terminate",description:"Command should be emulated but is not implemented",standard:"other"},{name:"SIGFPE",number:8,action:"core",description:"Floating point arithmetic error",standard:"ansi"},{name:"SIGKILL",number:9,action:"terminate",description:"Forced termination",standard:"posix",forced:!0},{name:"SIGUSR1",number:10,action:"terminate",description:"Application-specific signal",standard:"posix"},{name:"SIGSEGV",number:11,action:"core",description:"Segmentation fault",standard:"ansi"},{name:"SIGUSR2",number:12,action:"terminate",description:"Application-specific signal",standard:"posix"},{name:"SIGPIPE",number:13,action:"terminate",description:"Broken pipe or socket",standard:"posix"},{name:"SIGALRM",number:14,action:"terminate",description:"Timeout or timer",standard:"posix"},{name:"SIGTERM",number:15,action:"terminate",description:"Termination",standard:"ansi"},{name:"SIGSTKFLT",number:16,action:"terminate",description:"Stack is empty or overflowed",standard:"other"},{name:"SIGCHLD",number:17,action:"ignore",description:"Child process terminated, paused or unpaused",standard:"posix"},{name:"SIGCLD",number:17,action:"ignore",description:"Child process terminated, paused or unpaused",standard:"other"},{name:"SIGCONT",number:18,action:"unpause",description:"Unpaused",standard:"posix",forced:!0},{name:"SIGSTOP",number:19,action:"pause",description:"Paused",standard:"posix",forced:!0},{name:"SIGTSTP",number:20,action:"pause",description:'Paused using CTRL-Z or "suspend"',standard:"posix"},{name:"SIGTTIN",number:21,action:"pause",description:"Background process cannot read terminal input",standard:"posix"},{name:"SIGBREAK",number:21,action:"terminate",description:"User interruption with CTRL-BREAK",standard:"other"},{name:"SIGTTOU",number:22,action:"pause",description:"Background process cannot write to terminal output",standard:"posix"},{name:"SIGURG",number:23,action:"ignore",description:"Socket received out-of-band data",standard:"bsd"},{name:"SIGXCPU",number:24,action:"core",description:"Process timed out",standard:"bsd"},{name:"SIGXFSZ",number:25,action:"core",description:"File too big",standard:"bsd"},{name:"SIGVTALRM",number:26,action:"terminate",description:"Timeout or timer",standard:"bsd"},{name:"SIGPROF",number:27,action:"terminate",description:"Timeout or timer",standard:"bsd"},{name:"SIGWINCH",number:28,action:"ignore",description:"Terminal window size changed",standard:"bsd"},{name:"SIGIO",number:29,action:"terminate",description:"I/O is available",standard:"other"},{name:"SIGPOLL",number:29,action:"terminate",description:"Watched event",standard:"other"},{name:"SIGINFO",number:29,action:"ignore",description:"Request for process information",standard:"other"},{name:"SIGPWR",number:30,action:"terminate",description:"Device running out of power",standard:"systemv"},{name:"SIGSYS",number:31,action:"core",description:"Invalid system call",standard:"other"},{name:"SIGUNUSED",number:31,action:"terminate",description:"Invalid system call",standard:"other"}];H.SIGNALS=rr});var le=c(C=>{"use strict";Object.defineProperty(C,"__esModule",{value:!0});C.SIGRTMAX=C.getRealtimeSignals=void 0;var sr=function(){let e=Ct-Pt+1;return Array.from({length:e},or)};C.getRealtimeSignals=sr;var or=function(e,t){return{name:`SIGRT${t+1}`,number:Pt+t,action:"terminate",description:"Application-specific signal (realtime)",standard:"posix"}},Pt=34,Ct=64;C.SIGRTMAX=Ct});var Gt=c(X=>{"use strict";Object.defineProperty(X,"__esModule",{value:!0});X.getSignals=void 0;var ir=require("os"),ar=Tt(),cr=le(),ur=function(){let e=(0,cr.getRealtimeSignals)();return[...ar.SIGNALS,...e].map(lr)};X.getSignals=ur;var lr=function({name:e,number:t,description:n,action:r,forced:s=!1,standard:o}){let{signals:{[e]:i}}=ir.constants,a=i!==void 0;return{name:e,number:a?i:t,description:n,supported:a,action:r,forced:s,standard:o}}});var Ot=c(G=>{"use strict";Object.defineProperty(G,"__esModule",{value:!0});G.signalsByNumber=G.signalsByName=void 0;var dr=require("os"),At=Gt(),fr=le(),pr=function(){return(0,At.getSignals)().reduce(mr,{})},mr=function(e,{name:t,number:n,description:r,supported:s,action:o,forced:i,standard:a}){return b(f({},e),{[t]:{name:t,number:n,description:r,supported:s,action:o,forced:i,standard:a}})},hr=pr();G.signalsByName=hr;var Sr=function(){let e=(0,At.getSignals)(),t=fr.SIGRTMAX+1,n=Array.from({length:t},(r,s)=>gr(s,e));return Object.assign({},...n)},gr=function(e,t){let n=yr(e,t);if(n===void 0)return{};let{name:r,description:s,supported:o,action:i,forced:a,standard:u}=n;return{[e]:{name:r,number:e,description:s,supported:o,action:i,forced:a,standard:u}}},yr=function(e,t){let n=t.find(({name:r})=>dr.constants.signals[r]===e);return n!==void 0?n:t.find(r=>r.number===e)},xr=Sr();G.signalsByNumber=xr});var qt=c((Ws,Rt)=>{"use strict";var{signalsByName:wr}=Ot(),br=({timedOut:e,timeout:t,errorCode:n,signal:r,signalDescription:s,exitCode:o,isCanceled:i})=>e?`timed out after ${t} milliseconds`:i?"was canceled":n!==void 0?`failed with ${n}`:r!==void 0?`was killed with ${r} (${s})`:o!==void 0?`failed with exit code ${o}`:"failed",vr=({stdout:e,stderr:t,all:n,error:r,signal:s,exitCode:o,command:i,escapedCommand:a,timedOut:u,isCanceled:l,killed:p,parsed:{options:{timeout:S}}})=>{o=o===null?void 0:o,s=s===null?void 0:s;let h=s===void 0?void 0:wr[s].description,g=r&&r.code,x=`Command ${br({timedOut:u,timeout:S,errorCode:g,signal:s,signalDescription:h,exitCode:o,isCanceled:l})}: ${i}`,I=Object.prototype.toString.call(r)==="[object Error]",M=I?`${x}
${r.message}`:x,j=[M,t,e].filter(Boolean).join(`
`);return I?(r.originalMessage=r.message,r.message=j):r=new Error(j),r.shortMessage=M,r.command=i,r.escapedCommand=a,r.exitCode=o,r.signal=s,r.signalDescription=h,r.stdout=e,r.stderr=t,n!==void 0&&(r.all=n),"bufferedData"in r&&delete r.bufferedData,r.failed=!0,r.timedOut=Boolean(u),r.isCanceled=l,r.killed=p&&!u,r};Rt.exports=vr});var Nt=c((zs,de)=>{"use strict";var K=["stdin","stdout","stderr"],Er=e=>K.some(t=>e[t]!==void 0),kt=e=>{if(!e)return;let{stdio:t}=e;if(t===void 0)return K.map(r=>e[r]);if(Er(e))throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${K.map(r=>`\`${r}\``).join(", ")}`);if(typeof t=="string")return t;if(!Array.isArray(t))throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof t}\``);let n=Math.max(t.length,K.length);return Array.from({length:n},(r,s)=>t[s])};de.exports=kt;de.exports.node=e=>{let t=kt(e);return t==="ipc"?"ipc":t===void 0||typeof t=="string"?[t,t,t,"ipc"]:t.includes("ipc")?t:[...t,"ipc"]}});var _t=c((Vs,W)=>{W.exports=["SIGABRT","SIGALRM","SIGHUP","SIGINT","SIGTERM"];process.platform!=="win32"&&W.exports.push("SIGVTALRM","SIGXCPU","SIGXFSZ","SIGUSR2","SIGTRAP","SIGSYS","SIGQUIT","SIGIOT");process.platform==="linux"&&W.exports.push("SIGIO","SIGPOLL","SIGPWR","SIGSTKFLT","SIGUNUSED")});var jt=c((Ys,R)=>{var d=global.process,v=function(e){return e&&typeof e=="object"&&typeof e.removeListener=="function"&&typeof e.emit=="function"&&typeof e.reallyExit=="function"&&typeof e.listeners=="function"&&typeof e.kill=="function"&&typeof e.pid=="number"&&typeof e.on=="function"};v(d)?($t=require("assert"),A=_t(),Bt=/^win/i.test(d.platform),$=require("events"),typeof $!="function"&&($=$.EventEmitter),d.__signal_exit_emitter__?m=d.__signal_exit_emitter__:(m=d.__signal_exit_emitter__=new $,m.count=0,m.emitted={}),m.infinite||(m.setMaxListeners(1/0),m.infinite=!0),R.exports=function(e,t){if(!v(global.process))return function(){};$t.equal(typeof e,"function","a callback must be provided for exit handler"),O===!1&&fe();var n="exit";t&&t.alwaysLast&&(n="afterexit");var r=function(){m.removeListener(n,e),m.listeners("exit").length===0&&m.listeners("afterexit").length===0&&z()};return m.on(n,e),r},z=function(){!O||!v(global.process)||(O=!1,A.forEach(function(t){try{d.removeListener(t,V[t])}catch{}}),d.emit=Y,d.reallyExit=pe,m.count-=1)},R.exports.unload=z,E=function(t,n,r){m.emitted[t]||(m.emitted[t]=!0,m.emit(t,n,r))},V={},A.forEach(function(e){V[e]=function(){if(!!v(global.process)){var n=d.listeners(e);n.length===m.count&&(z(),E("exit",null,e),E("afterexit",null,e),Bt&&e==="SIGHUP"&&(e="SIGINT"),d.kill(d.pid,e))}}}),R.exports.signals=function(){return A},O=!1,fe=function(){O||!v(global.process)||(O=!0,m.count+=1,A=A.filter(function(t){try{return d.on(t,V[t]),!0}catch{return!1}}),d.emit=Mt,d.reallyExit=Lt)},R.exports.load=fe,pe=d.reallyExit,Lt=function(t){!v(global.process)||(d.exitCode=t||0,E("exit",d.exitCode,null),E("afterexit",d.exitCode,null),pe.call(d,d.exitCode))},Y=d.emit,Mt=function(t,n){if(t==="exit"&&v(global.process)){n!==void 0&&(d.exitCode=n);var r=Y.apply(this,arguments);return E("exit",d.exitCode,null),E("afterexit",d.exitCode,null),r}else return Y.apply(this,arguments)}):R.exports=function(){return function(){}};var $t,A,Bt,$,m,z,E,V,O,fe,pe,Lt,Y,Mt});var Ut=c((Qs,Ft)=>{"use strict";var Ir=require("os"),Tr=jt(),Pr=1e3*5,Cr=(e,t="SIGTERM",n={})=>{let r=e(t);return Gr(e,t,n,r),r},Gr=(e,t,n,r)=>{if(!Ar(t,n,r))return;let s=Rr(n),o=setTimeout(()=>{e("SIGKILL")},s);o.unref&&o.unref()},Ar=(e,{forceKillAfterTimeout:t},n)=>Or(e)&&t!==!1&&n,Or=e=>e===Ir.constants.signals.SIGTERM||typeof e=="string"&&e.toUpperCase()==="SIGTERM",Rr=({forceKillAfterTimeout:e=!0})=>{if(e===!0)return Pr;if(!Number.isFinite(e)||e<0)throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${e}\` (${typeof e})`);return e},qr=(e,t)=>{e.kill()&&(t.isCanceled=!0)},kr=(e,t,n)=>{e.kill(t),n(Object.assign(new Error("Timed out"),{timedOut:!0,signal:t}))},Nr=(e,{timeout:t,killSignal:n="SIGTERM"},r)=>{if(t===0||t===void 0)return r;let s,o=new Promise((a,u)=>{s=setTimeout(()=>{kr(e,n,u)},t)}),i=r.finally(()=>{clearTimeout(s)});return Promise.race([o,i])},_r=({timeout:e})=>{if(e!==void 0&&(!Number.isFinite(e)||e<0))throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${e}\` (${typeof e})`)},$r=async(e,{cleanup:t,detached:n},r)=>{if(!t||n)return r;let s=Tr(()=>{e.kill()});return r.finally(()=>{s()})};Ft.exports={spawnedKill:Cr,spawnedCancel:qr,setupTimeout:Nr,validateTimeout:_r,setExitHandler:$r}});var Ht=c((Zs,Dt)=>{"use strict";var w=e=>e!==null&&typeof e=="object"&&typeof e.pipe=="function";w.writable=e=>w(e)&&e.writable!==!1&&typeof e._write=="function"&&typeof e._writableState=="object";w.readable=e=>w(e)&&e.readable!==!1&&typeof e._read=="function"&&typeof e._readableState=="object";w.duplex=e=>w.writable(e)&&w.readable(e);w.transform=e=>w.duplex(e)&&typeof e._transform=="function";Dt.exports=w});var Kt=c((Js,Xt)=>{"use strict";var{PassThrough:Br}=require("stream");Xt.exports=e=>{e=f({},e);let{array:t}=e,{encoding:n}=e,r=n==="buffer",s=!1;t?s=!(n||r):n=n||"utf8",r&&(n=null);let o=new Br({objectMode:s});n&&o.setEncoding(n);let i=0,a=[];return o.on("data",u=>{a.push(u),s?i=a.length:i+=u.length}),o.getBufferedValue=()=>t?a:r?Buffer.concat(a,i):a.join(""),o.getBufferedLength=()=>i,o}});var Wt=c((eo,B)=>{"use strict";var{constants:Lr}=require("buffer"),Mr=require("stream"),{promisify:jr}=require("util"),Fr=Kt(),Ur=jr(Mr.pipeline),me=class extends Error{constructor(){super("maxBuffer exceeded");this.name="MaxBufferError"}};async function he(e,t){if(!e)throw new Error("Expected a stream");t=f({maxBuffer:1/0},t);let{maxBuffer:n}=t,r=Fr(t);return await new Promise((s,o)=>{let i=a=>{a&&r.getBufferedLength()<=Lr.MAX_LENGTH&&(a.bufferedData=r.getBufferedValue()),o(a)};(async()=>{try{await Ur(e,r),s()}catch(a){i(a)}})(),r.on("data",()=>{r.getBufferedLength()>n&&i(new me)})}),r.getBufferedValue()}B.exports=he;B.exports.buffer=(e,t)=>he(e,b(f({},t),{encoding:"buffer"}));B.exports.array=(e,t)=>he(e,b(f({},t),{array:!0}));B.exports.MaxBufferError=me});var Vt=c((to,zt)=>{"use strict";var{PassThrough:Dr}=require("stream");zt.exports=function(){var e=[],t=new Dr({objectMode:!0});return t.setMaxListeners(0),t.add=n,t.isEmpty=r,t.on("unpipe",s),Array.prototype.slice.call(arguments).forEach(n),t;function n(o){return Array.isArray(o)?(o.forEach(n),this):(e.push(o),o.once("end",s.bind(null,o)),o.once("error",t.emit.bind(t,"error")),o.pipe(t,{end:!1}),this)}function r(){return e.length==0}function s(o){e=e.filter(function(i){return i!==o}),!e.length&&t.readable&&t.end()}}});var Jt=c((no,Zt)=>{"use strict";var Qt=Ht(),Yt=Wt(),Hr=Vt(),Xr=(e,t)=>{t===void 0||e.stdin===void 0||(Qt(t)?t.pipe(e.stdin):e.stdin.end(t))},Kr=(e,{all:t})=>{if(!t||!e.stdout&&!e.stderr)return;let n=Hr();return e.stdout&&n.add(e.stdout),e.stderr&&n.add(e.stderr),n},Se=async(e,t)=>{if(!!e){e.destroy();try{return await t}catch(n){return n.bufferedData}}},ge=(e,{encoding:t,buffer:n,maxBuffer:r})=>{if(!(!e||!n))return t?Yt(e,{encoding:t,maxBuffer:r}):Yt.buffer(e,{maxBuffer:r})},Wr=async({stdout:e,stderr:t,all:n},{encoding:r,buffer:s,maxBuffer:o},i)=>{let a=ge(e,{encoding:r,buffer:s,maxBuffer:o}),u=ge(t,{encoding:r,buffer:s,maxBuffer:o}),l=ge(n,{encoding:r,buffer:s,maxBuffer:o*2});try{return await Promise.all([i,a,u,l])}catch(p){return Promise.all([{error:p,signal:p.signal,timedOut:p.timedOut},Se(e,a),Se(t,u),Se(n,l)])}},zr=({input:e})=>{if(Qt(e))throw new TypeError("The `input` option cannot be a stream in sync mode")};Zt.exports={handleInput:Xr,makeAllStream:Kr,getSpawnedResult:Wr,validateInputSync:zr}});var tn=c((ro,en)=>{"use strict";var Vr=(async()=>{})().constructor.prototype,Yr=["then","catch","finally"].map(e=>[e,Reflect.getOwnPropertyDescriptor(Vr,e)]),Qr=(e,t)=>{for(let[n,r]of Yr){let s=typeof t=="function"?(...o)=>Reflect.apply(r.value,t(),o):r.value.bind(t);Reflect.defineProperty(e,n,b(f({},r),{value:s}))}return e},Zr=e=>new Promise((t,n)=>{e.on("exit",(r,s)=>{t({exitCode:r,signal:s})}),e.on("error",r=>{n(r)}),e.stdin&&e.stdin.on("error",r=>{n(r)})});en.exports={mergePromise:Qr,getSpawnedPromise:Zr}});var sn=c((so,rn)=>{"use strict";var nn=(e,t=[])=>Array.isArray(t)?[e,...t]:[e],Jr=/^[\w.-]+$/,es=/"/g,ts=e=>typeof e!="string"||Jr.test(e)?e:`"${e.replace(es,'\\"')}"`,ns=(e,t)=>nn(e,t).join(" "),rs=(e,t)=>nn(e,t).map(n=>ts(n)).join(" "),ss=/ +/g,os=e=>{let t=[];for(let n of e.trim().split(ss)){let r=t[t.length-1];r&&r.endsWith("\\")?t[t.length-1]=`${r.slice(0,-1)} ${n}`:t.push(n)}return t};rn.exports={joinCommand:ns,getEscapedCommand:rs,parseCommand:os}});var fn=c((oo,q)=>{"use strict";var is=require("path"),ye=require("child_process"),as=ht(),cs=gt(),us=wt(),ls=It(),Q=qt(),an=Nt(),{spawnedKill:ds,spawnedCancel:fs,setupTimeout:ps,validateTimeout:ms,setExitHandler:hs}=Ut(),{handleInput:Ss,getSpawnedResult:gs,makeAllStream:ys,validateInputSync:xs}=Jt(),{mergePromise:on,getSpawnedPromise:ws}=tn(),{joinCommand:cn,parseCommand:un,getEscapedCommand:ln}=sn(),bs=1e3*1e3*100,vs=({env:e,extendEnv:t,preferLocal:n,localDir:r,execPath:s})=>{let o=t?f(f({},process.env),e):e;return n?us.env({env:o,cwd:r,execPath:s}):o},dn=(e,t,n={})=>{let r=as._parse(e,t,n);return e=r.command,t=r.args,n=r.options,n=f({maxBuffer:bs,buffer:!0,stripFinalNewline:!0,extendEnv:!0,preferLocal:!1,localDir:n.cwd||process.cwd(),execPath:process.execPath,encoding:"utf8",reject:!0,cleanup:!0,all:!1,windowsHide:!0},n),n.env=vs(n),n.stdio=an(n),process.platform==="win32"&&is.basename(e,".exe")==="cmd"&&t.unshift("/q"),{file:e,args:t,options:n,parsed:r}},L=(e,t,n)=>typeof t!="string"&&!Buffer.isBuffer(t)?n===void 0?void 0:"":e.stripFinalNewline?cs(t):t,Z=(e,t,n)=>{let r=dn(e,t,n),s=cn(e,t),o=ln(e,t);ms(r.options);let i;try{i=ye.spawn(r.file,r.args,r.options)}catch(g){let y=new ye.ChildProcess,x=Promise.reject(Q({error:g,stdout:"",stderr:"",all:"",command:s,escapedCommand:o,parsed:r,timedOut:!1,isCanceled:!1,killed:!1}));return on(y,x)}let a=ws(i),u=ps(i,r.options,a),l=hs(i,r.options,u),p={isCanceled:!1};i.kill=ds.bind(null,i.kill.bind(i)),i.cancel=fs.bind(null,i,p);let h=ls(async()=>{let[{error:g,exitCode:y,signal:x,timedOut:I},M,j,wn]=await gs(i,r.options,l),xe=L(r.options,M),we=L(r.options,j),be=L(r.options,wn);if(g||y!==0||x!==null){let ve=Q({error:g,exitCode:y,signal:x,stdout:xe,stderr:we,all:be,command:s,escapedCommand:o,parsed:r,timedOut:I,isCanceled:p.isCanceled,killed:i.killed});if(!r.options.reject)return ve;throw ve}return{command:s,escapedCommand:o,exitCode:0,stdout:xe,stderr:we,all:be,failed:!1,timedOut:!1,isCanceled:!1,killed:!1}});return Ss(i,r.options.input),i.all=ys(i,r.options),on(i,h)};q.exports=Z;q.exports.sync=(e,t,n)=>{let r=dn(e,t,n),s=cn(e,t),o=ln(e,t);xs(r.options);let i;try{i=ye.spawnSync(r.file,r.args,r.options)}catch(l){throw Q({error:l,stdout:"",stderr:"",all:"",command:s,escapedCommand:o,parsed:r,timedOut:!1,isCanceled:!1,killed:!1})}let a=L(r.options,i.stdout,i.error),u=L(r.options,i.stderr,i.error);if(i.error||i.status!==0||i.signal!==null){let l=Q({stdout:a,stderr:u,error:i.error,signal:i.signal,exitCode:i.status,command:s,escapedCommand:o,parsed:r,timedOut:i.error&&i.error.code==="ETIMEDOUT",isCanceled:!1,killed:i.signal!==null});if(!r.options.reject)return l;throw l}return{command:s,escapedCommand:o,exitCode:0,stdout:a,stderr:u,failed:!1,timedOut:!1,isCanceled:!1,killed:!1}};q.exports.command=(e,t)=>{let[n,...r]=un(e);return Z(n,r,t)};q.exports.commandSync=(e,t)=>{let[n,...r]=un(e);return Z.sync(n,r,t)};q.exports.node=(e,t,n={})=>{t&&!Array.isArray(t)&&typeof t=="object"&&(n=t,t=[]);let r=an.node(n),s=process.execArgv.filter(a=>!a.startsWith("--inspect")),{nodePath:o=process.execPath,nodeOptions:i=s}=n;return Z(o,[...i,e,...Array.isArray(t)?t:[]],b(f({},n),{stdin:void 0,stdout:void 0,stderr:void 0,stdio:r,shell:!1}))}});var Es={};Gn(Es,{default:()=>xn});var yn=require("@raycast/api");var pn=Ge(require("node:process"),1),mn=Ge(fn(),1);async function hn(e){if(pn.default.platform!=="darwin")throw new Error("macOS only");let{stdout:t}=await(0,mn.default)("osascript",["-e",e]);return t}var Sn=require("@raycast/api");var gn=e=>`
    tell application "Slack"
      if not application "Slack" is running then
        activate
        set _maxOpenWaitTimeInSeconds to 5
        set _openCounter to 0
        repeat until application "Slack" is running
          delay 0.5
          set _openCounter to _openCounter + 0.5
          if _openCounter > _maxOpenWaitTimeInSeconds then exit repeat
        end repeat

        delay 6

        # Exit 'Set yourself to active?' window
        activate
        tell application "System Events"
          key code 53
        end tell
      end if
      activate
      ${e}
    end tell`;async function xn(){return await(0,yn.showHUD)("Open unread messages"),await hn(gn(`
      tell application "System Events" to tell process "Slack" to keystroke "A" using {command down, shift down}
    `)),null}module.exports=An(Es);0&&(module.exports={});
