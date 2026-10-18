import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base='https://335083474.github.io/love-notes',rows=[];
for(const path of ['/','/en/',...['love-language','communication-style','conflict-style','apology-style','date-style'].flatMap(id=>['/tests/'+id+'/','/en/tests/'+id+'/'])]){
 const r=await fetch(base+path,{cache:'no-store'}),html=await r.text();assert.equal(r.status,200);assert(html.includes('rel="canonical" href="'+base+path+'"'));assert(html.includes('hreflang="en"'));assert(!html.includes('content="noindex'));assert(!html.includes('.chatgpt.site'));rows.push({path,status:r.status,canonical:true,bilingual:true,indexable:true});
}
const sitemap=await (await fetch(base+'/sitemap.xml')).text();assert(!sitemap.includes('/compare/'));assert(!sitemap.includes('/created/'));
const release=await (await fetch(base+'/release.json',{cache:'no-store'})).json();assert.equal(release.quizzes,5);assert.equal(release.backend,'https://love-notes-api.test-garden.workers.dev');
await fs.mkdir('artifacts/release',{recursive:true});await fs.writeFile('artifacts/release/public-pages.json',JSON.stringify({passed:true,rows,sitemapExcludesPrivateAndGenerated:true,release},null,2));console.log(JSON.stringify({passed:true,pages:rows.length,source:release.source,quizzes:release.quizzes}));
