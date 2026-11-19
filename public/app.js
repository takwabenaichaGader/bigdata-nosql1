'use strict';
/* Interface sans framework, accessible et utilisable hors bibliothèque externe.
   La correction est assurée par le backend : aucun corrigé n'est livré ici. */
const STORAGE='isima-bigdata-relations-quiz-v1';
const $=selector=>document.querySelector(selector);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let quiz=null;
let state=readState();
let loading=false;
let timerHandle=null;
function newState(){return {startedAt:null,current:0,answers:{},drafts:{},hints:{},finished:false,student:'',group:''};}
function readState(){try{return {...newState(),...JSON.parse(localStorage.getItem(STORAGE)||'{}')};}catch{return newState()}}
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(state))}catch{}}
function toast(message){const e=$('#toast');e.textContent=message;e.hidden=false;setTimeout(()=>e.hidden=true,3500)}
const qnow=()=>quiz.questions[state.current];
const completed=()=>Object.keys(state.answers).length;
const score=()=>Object.values(state.answers).reduce((sum,x)=>sum+x.earned,0);
const readable=n=>Number(n.toFixed(2)).toLocaleString('fr-FR',{maximumFractionDigits:2});
const remaining=()=>!state.startedAt?quiz.durationMinutes*60:Math.max(0,quiz.durationMinutes*60-Math.floor((Date.now()-state.startedAt)/1000));
function show(id){for(const key of ['landing','quiz-screen','results-screen'])$('#'+key).hidden=key!==id;window.scrollTo({top:0,behavior:'instant'});}
async function fetchQuiz(){const res=await fetch('/api/quiz',{cache:'no-store'});if(!res.ok)throw new Error('Le serveur ne répond pas.');return res.json();}
function start(){state=newState();state.startedAt=Date.now();state.student=$('#student-name').value.trim().slice(0,90);state.group=$('#student-group').value.trim().slice(0,50);save();show('quiz-screen');renderQuiz();startClock();}
function startClock(){if(timerHandle)clearInterval(timerHandle);updateClock();timerHandle=setInterval(()=>{updateClock();if(remaining()===0&&!state.finished)finish(true)},1000);}
function updateClock(){if(!quiz)return;const s=remaining();const min=String(Math.floor(s/60)).padStart(2,'0');const sec=String(s%60).padStart(2,'0');$('#time-left').textContent=`${min}:${sec}`;$('#timer-card').classList.toggle('urgent',s<=300);}
function renderQuiz(){renderTop();renderNav();renderQuestion();}
function renderTop(){const n=completed();$('#progress-label').textContent=`${n} / ${quiz.questions.length} questions corrigées`;$('#score-label').textContent=`${readable(score())} / ${quiz.maxPoints} points`;$('#progress-fill').style.width=(100*n/quiz.questions.length)+'%';}
function renderNav(){
 $('#question-nav').innerHTML=quiz.questions.map((q,i)=>{const a=state.answers[q.id];const cls=a?(a.correct?'done':a.partial?'partial':'wrong'):'';return `<button type="button" class="nav-q ${cls} ${i===state.current?'active':''}" data-index="${i}" aria-label="Question ${i+1}${a?' corrigée':''}" aria-current="${i===state.current?'step':'false'}">${i+1}</button>`}).join('');
 $('#question-nav').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{state.current=Number(b.dataset.index);save();renderQuiz()}));
}
function selectedDraft(q){return state.drafts[q.id]??(q.type==='multi'?[]:'')}
function renderChoice(q,corrected){
 const selected=corrected?corrected.userAnswer:selectedDraft(q);
 const multiple=q.type==='multi';
 return `<p class="select-note">${multiple?'Plusieurs réponses peuvent être correctes.':'Une seule réponse est attendue.'}</p><div class="options-list" role="group" aria-label="Réponses proposées">${q.options.map((o,i)=>{
 const chosen=multiple?(Array.isArray(selected)&&selected.includes(o.id)):selected===o.id;
 const good=corrected&&corrected.correctOptionIds?.includes(o.id);
 const bad=corrected&&chosen&&!good;
 return `<label class="answer-option ${chosen?'selected':''} ${corrected?'locked':''} ${good?'good':''} ${bad?'bad':''}"><input name="qchoice" type="${multiple?'checkbox':'radio'}" value="${esc(o.id)}" ${chosen?'checked':''} ${corrected?'disabled':''}><span><strong>${String.fromCharCode(65+i)}.</strong> ${esc(o.text)}</span></label>`}).join('')}</div>`;
}
function renderText(q,corrected){return `<textarea class="text-response ${q.type==='code'?'code':''}" id="written-answer" name="answer" aria-label="Votre réponse" placeholder="${esc(q.placeholder||'Votre réponse…')}" ${corrected?'disabled':''} maxlength="1500">${esc(corrected?corrected.userAnswer:selectedDraft(q))}</textarea><p class="answer-helper">${q.type==='code'?'La syntaxe est analysée sans exécuter votre code.':'Répondez librement. Les idées essentielles sont recherchées automatiquement.'}</p>`;}
function renderFeedback(a){const msg=a.correct?'Bonne réponse':a.partial?'Réponse partiellement correcte':'À revoir';const cls=a.correct?'':a.partial?'partial':'wrong';return `<div class="answer-feedback ${cls}" role="status"><div class="feedback-title"><span>${esc(msg)}</span><span>${readable(a.earned)} / ${a.possible} pt${a.possible>1?'s':''}</span></div><p>${esc(a.explanation)}</p><div class="feedback-expected"><strong>Réponse attendue :</strong> ${esc(a.expected)}</div>${a.criteria?.length?`<ul class="criteria-list">${a.criteria.map(c=>`<li class="${c.met?'':'not-met'}">${c.met?'✓':'○'} ${esc(c.label)}</li>`).join('')}</ul>`:''}</div>`;}
function renderQuestion(){
 const q=qnow();const ans=state.answers[q.id];const i=state.current;const isLast=i===quiz.questions.length-1;const typeLabels={single:'QCM · réponse unique',multi:'QCM · réponses multiples',short:'Réponse courte',written:'Argumentation écrite',code:'Requête MongoDB'};
 const illustration=ans?.feedbackVisual||q.visual;
 const visual=illustration?`<figure class="figure-card"><img src="/assets/${esc(illustration)}?v=2" loading="lazy" alt="${ans?'Schéma corrigé':'Situation à analyser'} : ${esc(q.title)}"><figcaption>${ans?'Après votre réponse · schéma explicatif':'Avant votre réponse · schéma sans solution'} · ${esc(q.tag)}</figcaption></figure>`:'';
 const input=['single','multi'].includes(q.type)?renderChoice(q,ans):renderText(q,ans);
 const question=$('#question-panel');
 question.innerHTML=`<div class="question-meta"><span>QUESTION ${String(i+1).padStart(2,'0')} / ${quiz.questions.length}</span><span class="question-tag">${esc(typeLabels[q.type])} · ${q.points} pt${q.points>1?'s':''}</span></div><h2 class="question-heading">${esc(q.title)}</h2><p class="question-context">${esc(q.context)}</p>${visual}<div class="prompt-box">${esc(q.prompt)}</div><form id="answer-form">${input}<div class="hint-row"><button class="hint-button" id="hint-toggle" type="button" aria-expanded="${!!state.hints[q.id]}">${state.hints[q.id]?'Masquer l’indice':'Besoin d’un indice ?'}</button><span class="question-tag">${esc(q.tag)}</span></div>${state.hints[q.id]?`<div class="hint-box"><strong>Indication :</strong> ${esc(q.hint)}</div>`:''}${ans?renderFeedback(ans):''}<div class="answer-actions"><button class="secondary-button" id="previous-question" type="button" ${i===0?'disabled':''}>← Question précédente</button>${ans?`<button class="primary-button" id="next-question" type="button">${isLast?'Voir mon bilan':'Question suivante'} <span>↗</span></button>`:`<button class="primary-button" id="submit-answer" type="submit" ${loading?'disabled':''}>${loading?'Correction…':'Valider et corriger'} <span>↗</span></button>`}</div></form>`;
 question.querySelector('#previous-question').addEventListener('click',()=>navTo(Math.max(0,state.current-1)));
 const hint=question.querySelector('#hint-toggle');hint.addEventListener('click',()=>{state.hints[q.id]=!state.hints[q.id];save();renderQuestion()});
 if(ans){question.querySelector('#next-question').addEventListener('click',()=>isLast?finishOrNext():navTo(state.current+1));}
 else{
  const form=question.querySelector('#answer-form');form.addEventListener('submit',event=>{event.preventDefault();submitAnswer(q)});
  if(['single','multi'].includes(q.type))form.querySelectorAll('input').forEach(inp=>inp.addEventListener('change',()=>{
   state.drafts[q.id]=q.type==='multi'?[...form.querySelectorAll('input:checked')].map(x=>x.value):form.querySelector('input:checked')?.value||'';
   save();form.querySelectorAll('.answer-option').forEach(label=>label.classList.toggle('selected',label.querySelector('input').checked));
  }));
  else form.querySelector('textarea').addEventListener('input',event=>{state.drafts[q.id]=event.target.value;save()});
 }
}
function navTo(index){state.current=index;save();renderQuiz();window.scrollTo({top:80,behavior:'smooth'});}
async function submitAnswer(q){
 if(loading||state.finished)return;
 if(remaining()===0){finish(true);return;}
 const answer=selectedDraft(q);
 if((Array.isArray(answer)&&answer.length===0)||(!Array.isArray(answer)&&!String(answer).trim())){toast('Choisissez ou saisissez une réponse avant de valider.');return;}
 loading=true;renderQuestion();
 try{
  const res=await fetch('/api/grade',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({questionId:q.id,answer})});
  const data=await res.json();if(!res.ok)throw new Error(data.error||'Correction indisponible.');
  state.answers[q.id]={...data,userAnswer:answer,helpUsed:!!state.hints[q.id]};save();renderQuiz();
  if(completed()===quiz.questions.length)toast('Toutes les questions sont corrigées. Consultez votre bilan !');
 }catch(err){toast(`Impossible de corriger pour le moment : ${err.message}`)}finally{loading=false;renderQuiz()}
}
function finishOrNext(){if(completed()===quiz.questions.length)finish(false);else{const idx=quiz.questions.findIndex(q=>!state.answers[q.id]);if(idx>=0)navTo(idx);else finish(false)}}
function finish(expired){if(!expired&&completed()<quiz.questions.length&&!window.confirm(`Il reste ${quiz.questions.length-completed()} question(s) non corrigée(s). Terminer maintenant ?`))return;state.finished=true;save();if(timerHandle)clearInterval(timerHandle);renderResults();show('results-screen');}
function renderResults(){
 const total=score();$('#final-score').textContent=readable(total);
 $('#score-caption').textContent=`${completed()} question(s) corrigée(s) sur ${quiz.questions.length}`;
 $('#result-message').textContent=total>=16?'Vous maîtrisez l’essentiel du parcours. Relisez les corrections pour affiner vos justifications.':total>=10?'Les bases sont acquises. Les explications ci-dessous vous aideront à consolider les points restants.':'Cette évaluation sert à progresser : parcourez les corrections et reprenez les exemples du cours.';
 $('#section-scores').innerHTML=quiz.sections.map(section=>{
  const qs=quiz.questions.filter(q=>q.section===section.id);const possible=qs.reduce((s,q)=>s+q.points,0);const earned=qs.reduce((s,q)=>s+(state.answers[q.id]?.earned||0),0);
  return `<div class="section-score"><label>${esc(section.title.replace(/\d+ — /,''))}</label><strong>${readable(earned)} / ${possible}</strong><div class="bar"><div style="width:${100*earned/possible}%"></div></div></div>`;
 }).join('');
 $('#review-list').innerHTML=quiz.questions.map((q,i)=>{const a=state.answers[q.id];return `<details class="review-item"><summary class="review-title"><strong>${String(i+1).padStart(2,'0')}. ${esc(q.title)}</strong><span>${a?`${readable(a.earned)} / ${q.points} pt${q.points>1?'s':''}`:'Non répondu · 0 point'}</span></summary><p>${esc(a?.explanation||'La question n’a pas été corrigée pendant cette tentative.')}</p>${a?`<div class="review-extra"><strong>Réponse attendue :</strong> ${esc(a.expected)}${a.criteria?.length?`<br><strong>Critères :</strong> ${a.criteria.map(c=>`${c.met?'✓':'○'} ${esc(c.label)}`).join(' · ')}`:''}</div>`:''}</details>`}).join('');
}
function downloadReport(){
 const name=state.student||'Anonyme';const sep=';';const safe=value=>{let s=String(value??'').replace(/\r?\n/g,' ');if(/^[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};
 const rows=[['Nom','Groupe','Formation','Matière','Note','Question','Compétence','Points obtenus','Points possibles','Réponse fournie','Correction attendue']];
 for(const q of quiz.questions){const a=state.answers[q.id];const supplied=a?Array.isArray(a.userAnswer)?a.userAnswer.join(', '):a.userAnswer:'';rows.push([name,state.group,'Licence IoT 1 GLSI','Big Data',readable(score()),q.id,q.title,readable(a?.earned||0),q.points,supplied,a?.expected||'Non corrigée'])}
 const content='\ufeff'+rows.map(row=>row.map(safe).join(sep)).join('\r\n');const blob=new Blob([content],{type:'text/csv;charset=utf-8;'});
 const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=`bilan-big-data-${new Date().toISOString().slice(0,10)}.csv`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),3000);
}
async function init(){
 try{quiz=await fetchQuiz();if(state.startedAt&&state.finished){renderResults();show('results-screen');}
 else if(state.startedAt){if(remaining()===0){state.finished=true;save();renderResults();show('results-screen')}else{show('quiz-screen');renderQuiz();startClock()}}
 else show('landing');
 $('#start-btn').addEventListener('click',start);
 $('#finish-early').addEventListener('click',()=>finish(false));
 $('#download-report').addEventListener('click',downloadReport);
 $('#print-report').addEventListener('click',()=>window.print());
 $('#restart-btn').addEventListener('click',()=>{if(!window.confirm('Recommencer une nouvelle tentative ? Le bilan de la tentative actuelle sera effacé localement.'))return;state=newState();localStorage.removeItem(STORAGE);show('landing')});
 }catch(err){$('#landing-error').hidden=false;$('#landing-error').textContent='Impossible de joindre le backend. Vérifiez que le serveur Node.js est démarré. '+err.message;$('#start-btn').disabled=true;}
}
init();
