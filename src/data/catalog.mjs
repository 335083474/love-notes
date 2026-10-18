import {quizzes} from './quizzes.mjs';
export const externalEntries=[];
export const catalog=[...quizzes.map(q=>({id:q.id,type:'native',kind:q.kind,discovery:q.discovery,title:q.title,category:q.category,color:q.color,art:q.art,
 summary:q.description,url:`/tests/${q.id}/`,tags:[q.category,'Free result',...(q.discoveryTags||[])],mode:'compare',players:'Solo · compare with 2+',
 duration:null,questionCount:q.questions.length,freeScope:'All questions and the complete basic result are free.',login:'No account or email.',
 checkedAt:'2026-10-18',verification:'implemented',relationship:'none',discussion:q.profiles[Object.keys(q.profiles)[0]].conversation})),...externalEntries];
