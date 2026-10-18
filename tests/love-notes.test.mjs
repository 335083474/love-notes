import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {getQuizzes,getCatalog} from '../src/i18n/content.mjs';
import {scoreQuiz} from '../src/engine.mjs';
import {pages} from '../src/render.mjs';
import cloud from '../cloudflare.config.mjs';
const ids=['love-language','communication-style','conflict-style','apology-style','date-style'];
for(const id of ids)test(id+': bilingual identities, reachable results, rotation and multi-way ties',()=>{
 const en=getQuizzes('en').find(q=>q.id===id),zh=getQuizzes('zh').find(q=>q.id===id),keys=Object.keys(en.profiles),n=en.questions.length;
 assert.equal(n,id==='love-language'?15:12);assert.equal(new Set(en.questions.map(q=>q.id)).size,n);
 for(const key of keys){const answers=en.questions.map(q=>q.answers.find(a=>a.profile===key).id);assert.deepEqual(scoreQuiz(en,answers),scoreQuiz(zh,answers));assert.equal(scoreQuiz(en,answers).counts[key],n);for(let slot=0;slot<keys.length;slot++)assert.equal(en.questions.filter(q=>q.answers[slot].profile===key).length,n/keys.length);}
 en.questions.forEach((q,i)=>{assert.notEqual(q.prompt,zh.questions[i].prompt);assert.deepEqual(q.answers.map(a=>[a.id,a.profile]),zh.questions[i].answers.map(a=>[a.id,a.profile]));assert.equal(new Set(q.answers.map(a=>a.profile)).size,keys.length);assert(zh.questions[i].answers.every(a=>/\p{Script=Han}/u.test(a.text)));});
 const balanced=scoreQuiz(en,en.questions.map((q,i)=>q.answers.find(a=>a.profile===keys[i%keys.length]).id));assert.equal(balanced.leaders.length,keys.length);
});
test('dedicated catalog, API, browser identity and database stay separate from Test Garden',async()=>{
 assert.deepEqual(getCatalog('en').map(q=>q.id),ids);assert.equal(cloud.basePath,'/love-notes');assert.equal(cloud.apiOrigin,'https://love-notes-api.test-garden.workers.dev');
 const cfg=JSON.parse(await fs.readFile('wrangler.jsonc','utf8'));assert.equal(cfg.name,'love-notes-api');assert.equal(cfg.d1_databases[0].database_id,'03170a13-16a3-4cd5-998f-4bd5780f98c2');assert(!JSON.stringify(cfg).includes('MINIMAX_API_KEY'));
 const client=await fs.readFile('src/cloud-client.mjs','utf8');assert(client.includes("const tokenKey='love-notes-cloud-session-v1'"));
});
test('all original bilingual landing pages expose unique indexable methods, FAQs, free app schema and actual quiz links',()=>{
 const output=pages();for(const locale of ['zh','en']){const prefix=locale==='en'?'/en':'';const home=output.find(p=>p.path===prefix+'/').html;assert(home.includes('data-studio-form'));assert(home.includes('data-studio-conversation'));assert(!home.includes('/tests/past-life-animal/'));
 for(const id of ids){assert(home.includes(prefix+'/tests/'+id+'/'));const html=output.find(p=>p.path===prefix+'/tests/'+id+'/').html;assert(!html.includes('content="noindex'));assert(html.includes('WebApplication'));assert(html.includes('rel="canonical"'));assert(html.includes('hreflang="en"'));assert(html.includes('hreflang="zh-Hans"'));assert(html.includes('data-quiz="'+id+'"'));assert(html.includes('/methodology/'));assert(html.includes('2026-10-18'));}
 }assert.equal(new Set(output.map(p=>p.path)).size,output.length);
});
