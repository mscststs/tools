var mp4Remux=function(){"use strict";var Q=Object.defineProperty;var X=(m,i,b)=>i in m?Q(m,i,{enumerable:!0,configurable:!0,writable:!0,value:b}):m[i]=b;var v=(m,i,b)=>(X(m,typeof i!="symbol"?i+"":i,b),b);const m=Object.freeze(Object.defineProperty({__proto__:null,get edts(){return J},get free(){return D},get ftyp(){return F},get mdat(){return G},get mdia(){return H},get mfhd(){return P},get moof(){return y},get moov(){return C},get mvex(){return V},get mvhd(){return R},get sidx(){return O},get tfdt(){return L},get tfhd(){return A},get tkhd(){return q},get traf(){return B},get trak(){return T},get trex(){return b},get trun(){return M},get udta(){return W}},Symbol.toStringTag,{value:"Module"}));class i{constructor(t){v(this,"stream",new Uint8Array);v(this,"dv",new DataView(new Uint8Array().buffer));v(this,"boxs",[]);v(this,"boxPos",0);this.stream=t,this.dv=new DataView(t.buffer)}set size(t){this.writeUint(4,t)}get size(){return this.readUint(4)}get type(){return this.readString(4,4)}get raw(){if(this.boxPos){let t=this.boxPos;const e=this.boxs.map(u=>{const p=u.raw;return t+=p.length,p});this.size=t;const r=this.stream.slice(0,this.boxPos),s=new Uint8Array(t);let a=0;for(const u of[r,...e])s.set(u,a),a+=u.length;return s}return this.stream}writeUint(t,e,r=0){const s=this.dv;switch(t){case 1:s.setUint8(r,e);break;case 2:s.setUint16(r,e);break;case 4:s.setUint32(r,e);break}}writeInt(t,e,r=0){const s=this.dv;switch(t){case 1:s.setInt8(r,e);break;case 2:s.setInt16(r,e);break;case 4:s.setInt32(r,e);break}}readInt(t=4,e=0){const r=this.dv;switch(t){case 1:return r.getInt8(e);case 2:return r.getInt16(e);case 4:return r.getInt32(e)}}readUint(t,e=0){const r=this.dv;switch(t){case 1:return r.getUint8(e);case 2:return r.getUint16(e);case 4:return r.getUint32(e)}}readString(t,e=0){let r="";for(let s=0;s<t;s++)r+=String.fromCharCode(this.readUint(1,e+s));return r}parse(t){this.boxPos=t;let e=t;for(;e<=this.stream.length-8;){const r=this.readUint(4,e),s=this.readString(4,4+e);if(r<=this.stream.length){const a=this.stream.slice(e,e+r),u=m[s]||D;this.boxs.push(new u(a))}e+=r}}}class b extends i{get version(){return this.readUint(1,8)}get track_id(){return this.readUint(4,12)}set track_id(t){this.writeUint(4,t,12)}}class M extends i{get sample_count(){return this.readUint(4,12)}get data_offset(){return this.readInt(4,16)}set data_offset(t){this.writeInt(4,t,16)}}class L extends i{}class A extends i{get version(){return this.readUint(1,8)}get track_id(){return this.readUint(4,12)}set track_id(t){this.writeUint(4,t,12)}}class B extends i{constructor(t){super(t),this.parse(8)}get tfhd(){return this.boxs.find(t=>t instanceof A)}get trun(){return this.boxs.find(t=>t instanceof M)}}class P extends i{get sequence_number(){return this.readUint(4,12)}}class W extends i{}class H extends i{}class F extends i{}class D extends i{}class C extends i{constructor(t){super(t),this.parse(8)}get mvhd(){return this.boxs.find(t=>t instanceof R)}get mvex(){return this.boxs.find(t=>t instanceof V)}get trak(){return this.boxs.find(t=>t instanceof T)}}class y extends i{constructor(t){super(t),this.parse(8)}get mfhd(){return this.boxs.find(t=>t instanceof P)}get traf(){return this.boxs.find(t=>t instanceof B)}}class O extends i{get version(){return this.readUint(1,8)}get reference_ID(){return this.readUint(4,12)}get timescale(){return this.readUint(4,16)}get reserved(){let t=28;return this.version!==0&&(t=36),this.readUint(2,t)}get reference_count(){let t=28;return this.version!==0&&(t=36),t+=2,this.readUint(2,t)}get refList(){let t=32;this.version!==0&&(t=40);const e=this.reference_count,r=[];for(let s=0;s<e;s++){const a=t+s*12;let u=this.readUint(4,a);const p=u>>31&1,S=u&2147483647,d=this.readUint(4,a+4);u=this.readUint(4,a+8);const w=u>>31&1,U=u>>28&7,z=u&268435455;r.push({reference_type:p,referenced_size:S,subsegment_duration:d,starts_with_SAP:w,SAP_type:U,SAP_delta_time:z})}return r}}class G extends i{push(t){const e=new Uint8Array(this.stream.length+t.length);e.set(this.stream),e.set(t,this.stream.length),this.stream=e,this.dv=new DataView(this.stream.buffer),this.size=e.length}}class R extends i{get version(){return this.readUint(1,8)}get next_track_ID(){return this.version===0?this.readUint(4,104):this.readUint(4,116)}set next_track_ID(t){this.version===0?this.writeUint(4,t,104):this.writeUint(4,t,116)}}class V extends i{constructor(t){super(t),this.parse(8)}get trex(){return this.boxs.find(t=>t instanceof b)}}class q extends i{get version(){return this.readUint(1,8)}get track_id(){return this.version===1?this.readUint(4,28):this.readUint(4,20)}set track_id(t){this.version===1?this.writeUint(4,t,28):this.writeUint(4,t,20)}}class T extends i{constructor(t){super(t),this.parse(8)}get tkhd(){return this.boxs.find(t=>t instanceof q)}}class J extends i{}class j{constructor(){v(this,"stream",new Uint8Array);v(this,"dv",new DataView(new Uint8Array().buffer));v(this,"boxs",[]);v(this,"isEnd",!1)}get sidx(){return this.boxs.find(t=>t instanceof O)}get moov(){return this.boxs.find(t=>t instanceof C)}push(t){const e=new Uint8Array(this.stream.length+t.length);e.set(this.stream),e.set(t,this.stream.length),this.stream=e,this.dv=new DataView(this.stream.buffer)}slice(t){const e=this.stream.slice(0,t),r=new Uint8Array(this.stream.length-t);return r.set(this.stream.slice(t)),this.stream=r,this.dv=new DataView(this.stream.buffer),e}readUint(t,e=0){const r=this.dv;switch(t){case 1:return r.getUint8(e);case 2:return r.getUint16(e);case 4:return r.getUint32(e)}}readString(t,e=0){let r="";for(let s=0;s<t;s++)r+=String.fromCharCode(this.readUint(1,e+s));return r}parse(){if(this.stream.length<8)return;const t=this.readUint(4),e=this.readString(4,4);if(t<=this.stream.length){const r=this.slice(t),s=m[e]||D;this.boxs.push(new s(r)),this.parse()}}end(){this.isEnd=!0}}function K(o,t){const e=o.getReader(),r=t.getReader(),s=new j,a=new j,{readable:u,writable:p}=new TransformStream,S=p.getWriter();let d=-1;function w(x){S.write(x)}async function U(){if(d===-1){const x=s.moov,g=a.moov;if(x&&g){const n=x.mvex,f=g.mvex;if(n&&f){const c=n.trex,l=f.trex;c.track_id=1,l.track_id=2,n.boxs=n.boxs.filter(I=>!(I instanceof b)),c&&n.boxs.push(c),l&&n.boxs.push(l)}const h=x.trak,_=g.trak;if(h&&_){h.tkhd.track_id=1,_.tkhd.track_id=2,x.boxs.push(_);for(const c of s.boxs)if(w(c.raw),c===x)break;d=1}}}if(!(!s.sidx||!a.sidx)&&d!==-1){const x=s.sidx.reference_count,g=a.sidx.reference_count;if(d<=x&&d<=g){const n=s.boxs.find(c=>c instanceof y&&(c==null?void 0:c.mfhd.sequence_number)===d),f=a.boxs.find(c=>c instanceof y&&(c==null?void 0:c.mfhd.sequence_number)===d),h=n&&s.boxs[s.boxs.indexOf(n)+1],_=f&&a.boxs[a.boxs.indexOf(f)+1];if(n&&h&&f&&_){const c=n.traf,l=f.traf;if(c.tfhd.track_id=1,l.tfhd.track_id=2,c!=null&&c.trun&&(l!=null&&l.trun)){const I=l.size,E=n.size,N=h.size;c.trun.data_offset=E+I+8,l.trun.data_offset=E+I+N,n.boxs.push(l),w(n.raw),h.push(_.raw.slice(8)),w(h.raw),s.boxs=s.boxs.filter(k=>k!==n),s.boxs=s.boxs.filter(k=>k!==h),a.boxs=a.boxs.filter(k=>k!==f),a.boxs=a.boxs.filter(k=>k!==_),d+=1,U()}}}else if(d>x&&d<=g){const n=a.boxs.find(h=>h instanceof y&&(h==null?void 0:h.mfhd.sequence_number)===d);n.traf.tfhd.track_id=2;const f=n&&a.boxs[a.boxs.indexOf(n)+1];n&&f&&(w(n.raw),w(f.raw),d+=1,U())}else if(d>g&&d<=x){const n=s.boxs.find(h=>h instanceof y&&(h==null?void 0:h.mfhd.sequence_number)===d);n.traf.tfhd.track_id=1;const f=n&&s.boxs[s.boxs.indexOf(n)+1];n&&f&&(w(n.raw),w(f.raw),d+=1,U())}else d>x&&d>g&&(d=-2,S.close())}}async function z(x,g){for(;;){const{done:n,value:f}=await x.read();if(f&&(g.push(f),g.parse(),U()),n){g.end(),U();break}}}return z(e,s),z(r,a),u}return K}();
//# sourceMappingURL=mp4-remux.iife.js.map