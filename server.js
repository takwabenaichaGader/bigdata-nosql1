'use strict';
/** Serveur HTTP minimal pour l'application formatrice. Dépendances externes : aucune. */
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {sections,questions,durationMinutes,maxPoints}=require('./src/question-bank');
const {gradeAnswer,sanitize,validate}=require('./src/grader');
const webRoot=path.resolve(__dirname,'public');
const byId=new Map(questions.map(q=>[q.id,q]));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.json':'application/json; charset=utf-8','.ico':'image/x-icon'};
const send=(res,status,obj)=>{const json=JSON.stringify(obj);res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(json)};
function handler(req,res){
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/api/health'&&req.method==='GET')return send(res,200,{ok:true,service:'ISIMA Evaluation'});
 if(url.pathname==='/api/quiz'&&req.method==='GET')return send(res,200,{title:'Relations et jointures : SQL & MongoDB',audience:'Licence IoT 1 GLSI',course:'Big Data',durationMinutes,maxPoints,sections,questions:questions.map(sanitize)});
 if(url.pathname==='/api/grade'&&req.method==='POST'){
   let text='';req.on('data',chunk=>{text+=chunk;if(text.length>20000){res.writeHead(413);res.end('Taille dépassée');req.destroy();}});
   req.on('end',()=>{try{const data=JSON.parse(text);const q=byId.get(data.questionId);if(!q||!validate(q,data.answer))return send(res,400,{error:'Réponse invalide. Vérifiez votre choix ou votre saisie.'});return send(res,200,gradeAnswer(q,data.answer));}
     catch(e){if(!res.writableEnded)send(res,400,{error:'Requête JSON invalide.'});}});return;
 }
 if(req.method!=='GET'&&req.method!=='HEAD')return send(res,405,{error:'Méthode non autorisée.'});
 const pathname=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
 const target=path.resolve(webRoot,'.'+pathname);
 if(target!==webRoot&&!target.startsWith(webRoot+path.sep))return send(res,403,{error:'Accès refusé.'});
 fs.stat(target,(err,stats)=>{
   if(err||!stats.isFile())return send(res,404,{error:'Ressource introuvable.'});
   const ext=path.extname(target).toLowerCase();
   res.writeHead(200,{'Content-Type':mime[ext]||'application/octet-stream','Cache-Control':ext==='.html'?'no-cache':'public, max-age=3600','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY'});
   if(req.method==='HEAD')return res.end();fs.createReadStream(target).pipe(res);
 });
}
if(require.main===module){const port=Number(process.env.PORT||3000);http.createServer(handler).listen(port,'0.0.0.0',()=>console.log(`ISIMA Quiz → http://localhost:${port}`));}
module.exports={handler};
