var Ae=Object.create;var p=Object.defineProperty;var we=Object.getOwnPropertyDescriptor;var ye=Object.getOwnPropertyNames;var Ee=Object.getPrototypeOf,Me=Object.prototype.hasOwnProperty;var j=r=>p(r,"__esModule",{value:!0});var u=(r,e)=>()=>(e||r((e={exports:{}}).exports,e),e.exports),Le=(r,e)=>{for(var t in e)p(r,t,{get:e[t],enumerable:!0})},B=(r,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of ye(e))!Me.call(r,a)&&(t||a!=="default")&&p(r,a,{get:()=>e[a],enumerable:!(n=we(e,a))||n.enumerable});return r},Ue=(r,e)=>B(j(p(r!=null?Ae(Ee(r)):{},"default",!e&&r&&r.__esModule?{get:()=>r.default,enumerable:!0}:{value:r,enumerable:!0})),r),be=(r=>(e,t)=>r&&r.get(e)||(t=B(j({}),e,1),r&&r.set(e,t),t))(typeof WeakMap!="undefined"?new WeakMap:0);var W=u(f=>{"use strict";Object.defineProperty(f,"__esModule",{value:!0});f.FORMATS=f.FORMAT_PLAIN=f.FORMAT_HTML=void 0;var z="html";f.FORMAT_HTML=z;var X="plain";f.FORMAT_PLAIN=X;var xe=[z,X];f.FORMATS=xe});var ee=u(i=>{"use strict";Object.defineProperty(i,"__esModule",{value:!0});i.UNITS=i.UNIT_PARAGRAPH=i.UNIT_PARAGRAPHS=i.UNIT_SENTENCE=i.UNIT_SENTENCES=i.UNIT_WORD=i.UNIT_WORDS=void 0;var J="words";i.UNIT_WORDS=J;var K="word";i.UNIT_WORD=K;var Q="sentences";i.UNIT_SENTENCES=Q;var V="sentence";i.UNIT_SENTENCE=V;var Y="paragraphs";i.UNIT_PARAGRAPHS=Y;var Z="paragraph";i.UNIT_PARAGRAPH=Z;var We=[J,K,Q,V,Y,Z];i.UNITS=We});var D=u(h=>{"use strict";Object.defineProperty(h,"__esModule",{value:!0});h.WORDS=void 0;var De=["ad","adipisicing","aliqua","aliquip","amet","anim","aute","cillum","commodo","consectetur","consequat","culpa","cupidatat","deserunt","do","dolor","dolore","duis","ea","eiusmod","elit","enim","esse","est","et","eu","ex","excepteur","exercitation","fugiat","id","in","incididunt","ipsum","irure","labore","laboris","laborum","Lorem","magna","minim","mollit","nisi","non","nostrud","nulla","occaecat","officia","pariatur","proident","qui","quis","reprehenderit","sint","sit","sunt","tempor","ullamco","ut","velit","veniam","voluptate"];h.WORDS=De});var re=u(P=>{"use strict";Object.defineProperty(P,"__esModule",{value:!0});P.LINE_ENDINGS=void 0;var ke={POSIX:`
`,WIN32:`\r
`};P.LINE_ENDINGS=ke});var te=u(N=>{"use strict";Object.defineProperty(N,"__esModule",{value:!0});N.default=void 0;var qe=function(e){var t=e.trim();return t.charAt(0).toUpperCase()+t.slice(1)},Ce=qe;N.default=Ce});var ne=u((R,k)=>{"use strict";Object.defineProperty(R,"__esModule",{value:!0});R.default=void 0;var Fe=function(){return typeof k!="undefined"&&!!k.exports},Ge=Fe;R.default=Ge});var ae=u(S=>{"use strict";Object.defineProperty(S,"__esModule",{value:!0});S.default=void 0;var He=function(){var e=!1;try{e=navigator.product==="ReactNative"}catch{e=!1}return e},$e=He;S.default=$e});var ie=u(O=>{"use strict";Object.defineProperty(O,"__esModule",{value:!0});O.SUPPORTED_PLATFORMS=void 0;var je={DARWIN:"darwin",LINUX:"linux",WIN32:"win32"};O.SUPPORTED_PLATFORMS=je});var ue=u(T=>{"use strict";Object.defineProperty(T,"__esModule",{value:!0});T.default=void 0;var Be=ie(),ze=function(){var e=!1;try{e=process.platform===Be.SUPPORTED_PLATFORMS.WIN32}catch{e=!1}return e},Xe=ze;T.default=Xe});var oe=u(I=>{"use strict";Object.defineProperty(I,"__esModule",{value:!0});I.default=void 0;var Je=function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:0;return Array.apply(null,Array(e)).map(function(t,n){return n})},Ke=Je;I.default=Ke});var se=u(A=>{"use strict";Object.defineProperty(A,"__esModule",{value:!0});A.default=void 0;var Qe=w(),Ve=function(e,t){var n=(0,Qe.makeArrayOfLength)(e);return n.map(function(){return t()})},Ye=Ve;A.default=Ye});var w=u(c=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0});Object.defineProperty(c,"capitalize",{enumerable:!0,get:function(){return Ze.default}});Object.defineProperty(c,"isNode",{enumerable:!0,get:function(){return er.default}});Object.defineProperty(c,"isReactNative",{enumerable:!0,get:function(){return rr.default}});Object.defineProperty(c,"isWindows",{enumerable:!0,get:function(){return tr.default}});Object.defineProperty(c,"makeArrayOfLength",{enumerable:!0,get:function(){return nr.default}});Object.defineProperty(c,"makeArrayOfStrings",{enumerable:!0,get:function(){return ar.default}});var Ze=g(te()),er=g(ne()),rr=g(ae()),tr=g(ue()),nr=g(oe()),ar=g(se());function g(r){return r&&r.__esModule?r:{default:r}}});var fe=u(E=>{"use strict";Object.defineProperty(E,"__esModule",{value:!0});E.default=void 0;var ir=D(),q=w();function ur(r,e){if(!(r instanceof e))throw new TypeError("Cannot call a class as a function")}function de(r,e){for(var t=0;t<e.length;t++){var n=e[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(r,n.key,n)}}function or(r,e,t){return e&&de(r.prototype,e),t&&de(r,t),r}function y(r,e,t){return e in r?Object.defineProperty(r,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):r[e]=t,r}var sr=function(){function r(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=e.sentencesPerParagraph,n=t===void 0?{max:7,min:3}:t,a=e.wordsPerSentence,o=a===void 0?{max:15,min:5}:a,d=e.random,m=e.seed,s=e.words,v=s===void 0?ir.WORDS:s;if(ur(this,r),y(this,"sentencesPerParagraph",void 0),y(this,"wordsPerSentence",void 0),y(this,"random",void 0),y(this,"words",void 0),n.min>n.max)throw new Error("Minimum number of sentences per paragraph (".concat(n.min,") cannot exceed maximum (").concat(n.max,")."));if(o.min>o.max)throw new Error("Minimum number of words per sentence (".concat(o.min,") cannot exceed maximum (").concat(o.max,")."));this.sentencesPerParagraph=n,this.words=v,this.wordsPerSentence=o,this.random=d||Math.random}return or(r,[{key:"generateRandomInteger",value:function(t,n){return Math.floor(this.random()*(n-t+1)+t)}},{key:"generateRandomWords",value:function(t){var n=this,a=this.wordsPerSentence,o=a.min,d=a.max,m=t||this.generateRandomInteger(o,d);return(0,q.makeArrayOfLength)(m).reduce(function(s,v){return"".concat(n.pluckRandomWord()," ").concat(s)},"").trim()}},{key:"generateRandomSentence",value:function(t){return"".concat((0,q.capitalize)(this.generateRandomWords(t)),".")}},{key:"generateRandomParagraph",value:function(t){var n=this,a=this.sentencesPerParagraph,o=a.min,d=a.max,m=t||this.generateRandomInteger(o,d);return(0,q.makeArrayOfLength)(m).reduce(function(s,v){return"".concat(n.generateRandomSentence()," ").concat(s)},"").trim()}},{key:"pluckRandomWord",value:function(){var t=0,n=this.words.length-1,a=this.generateRandomInteger(t,n);return this.words[a]}}]),r}(),dr=sr;E.default=dr});var me=u(U=>{"use strict";Object.defineProperty(U,"__esModule",{value:!0});U.default=void 0;var M=W(),ce=re(),fr=cr(fe()),L=w();function cr(r){return r&&r.__esModule?r:{default:r}}function lr(r,e){if(!(r instanceof e))throw new TypeError("Cannot call a class as a function")}function le(r,e){for(var t=0;t<e.length;t++){var n=e[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(r,n.key,n)}}function mr(r,e,t){return e&&le(r.prototype,e),t&&le(r,t),r}function gr(r,e,t){return e in r?Object.defineProperty(r,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):r[e]=t,r}var vr=function(){function r(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:M.FORMAT_PLAIN,n=arguments.length>2?arguments[2]:void 0;if(lr(this,r),this.format=t,this.suffix=n,gr(this,"generator",void 0),M.FORMATS.indexOf(t.toLowerCase())===-1)throw new Error("".concat(t," is an invalid format. Please use ").concat(M.FORMATS.join(" or "),"."));this.generator=new fr.default(e)}return mr(r,[{key:"getLineEnding",value:function(){return this.suffix?this.suffix:!(0,L.isReactNative)()&&(0,L.isNode)()&&(0,L.isWindows)()?ce.LINE_ENDINGS.WIN32:ce.LINE_ENDINGS.POSIX}},{key:"formatString",value:function(t){return this.format===M.FORMAT_HTML?"<p>".concat(t,"</p>"):t}},{key:"formatStrings",value:function(t){var n=this;return t.map(function(a){return n.formatString(a)})}},{key:"generateWords",value:function(t){return this.formatString(this.generator.generateRandomWords(t))}},{key:"generateSentences",value:function(t){return this.formatString(this.generator.generateRandomParagraph(t))}},{key:"generateParagraphs",value:function(t){var n=this.generator.generateRandomParagraph.bind(this.generator);return this.formatStrings((0,L.makeArrayOfStrings)(t,n)).join(this.getLineEnding())}}]),r}(),_r=vr;U.default=_r});var ve=u(_=>{"use strict";Object.defineProperty(_,"__esModule",{value:!0});Object.defineProperty(_,"LoremIpsum",{enumerable:!0,get:function(){return ge.default}});_.loremIpsum=void 0;var pr=W(),l=ee(),hr=D(),ge=Pr(me());function Pr(r){return r&&r.__esModule?r:{default:r}}var Nr=function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=e.count,n=t===void 0?1:t,a=e.format,o=a===void 0?pr.FORMAT_PLAIN:a,d=e.paragraphLowerBound,m=d===void 0?3:d,s=e.paragraphUpperBound,v=s===void 0?7:s,Pe=e.random,C=e.sentenceLowerBound,Ne=C===void 0?5:C,F=e.sentenceUpperBound,Re=F===void 0?15:F,G=e.units,Se=G===void 0?l.UNIT_SENTENCES:G,H=e.words,Oe=H===void 0?hr.WORDS:H,$=e.suffix,Te=$===void 0?"":$,Ie={random:Pe,sentencesPerParagraph:{max:v,min:m},words:Oe,wordsPerSentence:{max:Re,min:Ne}},x=new ge.default(Ie,o,Te);switch(Se){case l.UNIT_PARAGRAPHS:case l.UNIT_PARAGRAPH:return x.generateParagraphs(n);case l.UNIT_SENTENCES:case l.UNIT_SENTENCE:return x.generateSentences(n);case l.UNIT_WORDS:case l.UNIT_WORD:return x.generateWords(n);default:return""}};_.loremIpsum=Nr});var Or={};Le(Or,{default:()=>he});var b=require("@raycast/api");var Rr=require("@raycast/api"),_e=Ue(ve()),Sr=new _e.LoremIpsum({sentencesPerParagraph:{max:8,min:4},wordsPerSentence:{max:16,min:4}}),pe=()=>Sr.generateSentences(10);async function he(){let r=pe();return await(0,b.copyTextToClipboard)(r),await(0,b.showHUD)("Copied to clipboard!"),null}module.exports=be(Or);0&&(module.exports={});