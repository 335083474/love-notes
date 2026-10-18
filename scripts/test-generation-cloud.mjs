import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import cloud from '../cloudflare.config.mjs';
const token=crypto.randomUUID().replaceAll('-','')+crypto.randomUUID().replaceAll('-','');
const report={passed:false,steps:[]};
const call=async(action,input={})=>{const r=await fetch(cloud.apiOrigin+'/api/studio/'+action,{method:'POST',headers:{Origin:cloud.webOrigin,Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({locale:'en',...input}),signal:AbortSignal.timeout(210000)});const value=await r.json();if(!r.ok)throw Error(action+': '+(value.error||r.status));return value;};
try{
 let reply=await call('chat',{message:'We are adults in a long-distance relationship across time zones. Please offer a new original reflection quiz specifically about planning a mutually comfortable communication rhythm, not a diagnosis or compatibility prediction. We want a practical, gentle tone.',consent:false});
 for(let i=0;reply.action==='ask'&&i<2;i++)reply=await call('chat',{conversationId:reply.conversationId,message:'Explore flexible contact windows, advance notice, asynchronous messages and time alone, as ordinary preferences. Both partners choose voluntarily.'});
 assert.equal(reply.action,'offer');const index=reply.choices.findIndex(c=>c.kind==='generate');assert(index>=0);report.steps.push('Real AI offers a relevant creation outline');console.log(JSON.stringify({step:'outline',title:reply.choices[index].title}));
 const selected=await call('select',{conversationId:reply.conversationId,index});assert.equal(selected.created,true);const id=selected.url.split('/').filter(Boolean).at(-1);report.id=id;
 const en=(await call('quiz',{quizId:id})).quiz,zh=(await call('quiz',{quizId:id,locale:'zh'})).quiz;assert.equal(en.questions.length,8);assert.equal(zh.questions.length,8);assert.equal(Object.keys(en.profiles).length,4);assert.notEqual(en.questions[0].prompt,zh.questions[0].prompt);assert(en.generated&&zh.generated);
 const answers=en.questions.map(q=>q.answers[0].id);assert.equal((await call('complete',{quizId:id,version:en.version,answers})).result.total,8);report.steps.push('Real generated quiz has eight bilingual questions, four profiles and working server scoring');report.url='https://335083474.github.io/love-notes/en/created/?id='+id;report.title=en.title;report.passed=true;
}catch(e){report.error=e.message;process.exitCode=1;}finally{try{report.syntheticVisitorDeleted=(await call('forget')).deleted===true;}catch{report.syntheticVisitorDeleted=false;}await fs.mkdir('artifacts/release',{recursive:true});await fs.writeFile('artifacts/release/generation.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
