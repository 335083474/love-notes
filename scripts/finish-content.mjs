import fs from 'node:fs/promises';
const edit=async(f,fn)=>fs.writeFile(f,fn(await fs.readFile(f,'utf8')));
await edit('src/romance.css',s=>s.replace('`n@media','\n@media'));
await edit('scripts/lib/studio-runtime.mjs',s=>s.replaceAll('Love Notes\'s bilingual recommendation editor.','Love Notes\'s bilingual adult relationship reflection editor. Only relationship topics are in scope.').replaceAll('story result','preference result').replaceAll('storyResult','preferenceResult').replaceAll('a friend can','a partner can').replaceAll('Explain friends','Explain partners').replaceAll('fictional quiz','reflection quiz').replaceAll('和朋友玩','一起尝试').replaceAll('With a friend','Together').replaceAll('new general-audience fictional/reflection quiz','new adult relationship reflection quiz'));
await edit('src/love-pages.mjs',s=>s.replace('</article>`;',`<h2>More relationship quizzes / 更多关系测试</h2><ul><li><a href="\u0024{r('/tests/conflict-style/')}">\u0024{s('伴侣冲突处理测试','Conflict style quiz for couples')}</a></li><li><a href="\u0024{r('/tests/apology-style/')}">\u0024{s('道歉与修复偏好测试','Apology style quiz')}</a></li><li><a href="\u0024{r('/tests/date-style/')}">\u0024{s('约会偏好测试','Date night quiz for couples')}</a></li></ul></article>\u0060;`));
// Setup-only helpers are not part of the finished repository.
await fs.rm('scripts/update-diagnostic.mjs',{force:true});
console.log('Relationship recommendations and mobile typography updated.');
