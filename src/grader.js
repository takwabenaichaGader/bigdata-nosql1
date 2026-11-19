'use strict';
const {questions} = require('./question-bank');
function normalize(s){return String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();}
function gradeAnswer(q,answer){
 let earned=0, criteria=[];
 if(q.type==='single') earned=answer===q.answer?q.points:0;
 else if(q.type==='multi'){
   const chosen = [...new Set(Array.isArray(answer)?answer:[])];
   const right = q.answer;
   const rightSelected=chosen.filter(v=>right.includes(v)).length;
   const wrongSelected=chosen.filter(v=>!right.includes(v)).length;
   const incorrectTotal=q.options.length-right.length;
   const ratio=Math.max(0,rightSelected/right.length-(incorrectTotal?wrongSelected/incorrectTotal:0));
   earned=Math.round(q.points*ratio*4)/4;
 } else if(q.type==='short'){
   earned=q.answer.some(v=>normalize(v)===normalize(answer))?q.points:0;
 } else if(q.type==='written'||q.type==='code'){
   const txt=normalize(answer);
   criteria=q.criteria.map(c=>({label:c.label,met:c.patterns.some(p=>new RegExp(p,'i').test(txt))}));
   earned=Math.round(q.points*(criteria.filter(c=>c.met).length/criteria.length)*4)/4;
 }
 const correct=earned===q.points;
 return {id:q.id,earned,possible:q.points,correct,partial:earned>0&&!correct,criteria,
    explanation:q.explanation,expected:q.expected,
    correctOptionIds:(q.type==='single'?[q.answer]:q.type==='multi'?q.answer:undefined)};
}
function sanitize(q){const {answer,criteria,explanation,expected,source,...publicItem}=q;return publicItem;}
function validate(q,answer){
 if(q.type==='single')return typeof answer==='string'&&q.options.some(o=>o.id===answer);
 if(q.type==='multi')return Array.isArray(answer)&&answer.length<=q.options.length&&answer.every(a=>typeof a==='string'&&q.options.some(o=>o.id===a));
 return typeof answer==='string'&&answer.length>0&&answer.length<=1500;
}
module.exports={gradeAnswer,sanitize,validate,normalize};
