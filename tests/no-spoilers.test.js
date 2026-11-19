'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {questions}=require('../src/question-bank');
const {sanitize,gradeAnswer}=require('../src/grader');
const ASSETS=path.resolve(__dirname,'../public/assets');
test('Les 12 questions possèdent une illustration neutre puis un corrigé visuel',()=>{
 assert.equal(questions.length,12);
 for(const q of questions){
   assert.ok(q.visual?.endsWith('.svg'),q.id+' image d’énoncé absente');
   assert.ok(q.feedbackVisual?.endsWith('-corrige.svg'),q.id+' image de correction absente');
   assert.ok(fs.existsSync(path.join(ASSETS,q.visual)),q.id+' image neutre inexistante');
   assert.ok(fs.existsSync(path.join(ASSETS,q.feedbackVisual)),q.id+' image de correction inexistante');
   assert.equal(sanitize(q).feedbackVisual,undefined,'Corrigé visuel jamais exposé avant correction');
 }
});
test('Le diagramme de la question 8 ne révèle pas le tri MongoDB',()=>{
 const q=questions.find(x=>x.id==='q08');
 const image=fs.readFileSync(path.join(ASSETS,q.visual),'utf-8');
 assert.doesNotMatch(image,/sort\s*\(|createdAt\s*:\s*-1|ordre\s+d[eé]croissant|le plus r[eé]cent|le plus ancien/i);
 assert.doesNotMatch(q.hint,/-1|createdAt\s*:\s*-1|\.sort\s*\(/i);
 const feedback=gradeAnswer(q,'a');
 assert.equal(feedback.feedbackVisual,q.feedbackVisual);
 assert.equal(feedback.earned,1);
});
test('Les schémas de contexte ne présentent aucune stratégie explicitement correcte',()=>{
 const banned={
  'sql-join.svg':/une jointure rapproche|id\s*=\s*etudiant_id/i,
  'embedding.svg':/embedding|imbrication|document imbriqu/i,
  'referencing.svg':/referencing|collection reviews|sans agrandir|documents séparés/i,
  'embedding-versus-referencing.svg':/EMBEDDING|REFERENCING|dans le même document|dans une collection séparée/i,
  'index.svg':/createIndex|IXSCAN|COLLSCAN|index composé|productId\s*:\s*1/i
 };
 for(const [filename,regexp] of Object.entries(banned)){
  const text=fs.readFileSync(path.join(ASSETS,filename),'utf8');
  assert.doesNotMatch(text,regexp,filename+' donne une réponse');
 }
});
