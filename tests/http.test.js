'use strict';
const test=require('node:test');const assert=require('node:assert/strict');const http=require('node:http');
const {handler}=require('../server');
async function withServer(fn){const server=http.createServer(handler);await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;try{await fn(base)}finally{await new Promise(r=>server.close(r))}}
test('API quiz sans corrigés et endpoint de santé',async()=>withServer(async base=>{
 const health=await fetch(base+'/api/health');assert.equal(health.status,200);assert.equal((await health.json()).ok,true);
 const res=await fetch(base+'/api/quiz');assert.equal(res.status,200);
 const j=await res.json();assert.equal(j.durationMinutes,30);assert.equal(j.maxPoints,20);assert.equal(j.questions.length,12);
 assert.ok(!Object.hasOwn(j.questions[0],'answer'));assert.ok(!Object.hasOwn(j.questions[5],'criteria'));
}));
test('API correction retourne explication et refuse options invalides',async()=>withServer(async base=>{
 const ok=await fetch(base+'/api/grade',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({questionId:'q01',answer:'a'})});
 assert.equal(ok.status,200);const result=await ok.json();assert.equal(result.earned,1);assert.ok(result.explanation.length>10);
 const bad=await fetch(base+'/api/grade',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({questionId:'q01',answer:'z'})});assert.equal(bad.status,400);
}));
test('serveur n’expose pas les fichiers privés',async()=>withServer(async base=>{
 const html=await fetch(base+'/');assert.equal(html.status,200);assert.match(await html.text(),/Les données ont des liens/);
 const privateFile=await fetch(base+'/src/question-bank.js');assert.equal(privateFile.status,404);
}));
