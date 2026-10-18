import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {getQuizzes} from '../src/i18n/content.mjs';
import cloud from '../cloudflare.config.mjs';
const tokens=Object.fromEntries(['a','b','c'].map(k=>[k,crypto.randomUUID().replaceAll('-','')+crypto.randomUUID().replaceAll('-','')]));
const report={passed:false,quizzes:[],checks:[]};
const call=async(action,input={},who='a')=>{const r=await fetch(cloud.apiOrigin+'/api/studio/'+action,{method:'POST',headers:{Origin:cloud.webOrigin,Authorization:'Bearer '+tokens[who],'Content-Type':'application/json'},body:JSON.stringify({locale:'zh',...input})});return{status:r.status,value:await r.json()};};
try{
 const catalog=await call('catalog');assert.equal(catalog.status,200);assert.equal(catalog.value.entries.filter(x=>!x.generated).length,5);assert(catalog.value.entries.every(x=>!['animal-personality','historical-character','work-style'].includes(x.id)));
 for(const q of getQuizzes('zh')){
  const keys=Object.keys(q.profiles),answers=q.questions.map((x,i)=>x.answers.find(a=>a.profile===keys[i%keys.length]).id),body={quizId:q.id,version:q.version,answers,consent:true};
  const bad=await call('complete',{...body,answers:['invalid']});assert.equal(bad.status,400);
  assert.equal((await call('complete',body)).status,200);assert.equal((await call('complete',body)).value.counted,false);
  const made=await call('pair-create',body);assert.equal(made.status,200);const token=made.value.token;
  assert.equal((await call('pair-view',{token},'b')).value.comparison,null);
  const frozen=await call('quiz',{quizId:q.id,comparisonToken:token,locale:'en'},'b');assert.equal(frozen.status,200);assert.equal(frozen.value.quiz.questions.length,q.questions.length);assert(!/\p{Script=Han}/u.test(frozen.value.quiz.questions[0].prompt));
  assert.equal((await call('pair-join',{...body,token,consent:false},'b')).status,400);
  const joined=await call('pair-join',{...body,locale:'en',token},'b');assert.equal(joined.status,200);assert.equal(joined.value.comparison.rows.length,keys.length);
  assert.equal((await call('pair-join',{...body,token},'c')).status,409);assert.equal((await call('pair-revoke',{token})).status,200);assert.equal((await call('pair-view',{token},'b')).status,410);
  report.quizzes.push({id:q.id,questions:q.questions.length,profiles:keys.length,independentEnglishComparison:true,consentRequired:true,revocation:true});
 }
 report.checks.push('Five independent bilingual questionnaires score and compare on the dedicated public API','Invalid answers and unconsented joins are rejected; third-party replacement is blocked','Completions deduplicate and revoked comparisons return 410');report.passed=true;
}finally{report.syntheticVisitorsDeleted=(await Promise.all(Object.keys(tokens).map(k=>call('forget',{},k)))).every(r=>r.status===200);await fs.mkdir('artifacts/release',{recursive:true});await fs.writeFile('artifacts/release/cloud-relationships.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
