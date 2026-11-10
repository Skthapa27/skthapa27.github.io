const C='jbpb-202611091140';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
function withTimeout(p,ms){return new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('timeout')),ms);p.then(v=>{clearTimeout(t);res(v);},e=>{clearTimeout(t);rej(e);});});}
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(u.origin===location.origin){
    e.respondWith(withTimeout(fetch(req),2500).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(req,cp));}return r;})
      .catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
  }else if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(req,cp));return res;}).catch(()=>r)));
  }
});
