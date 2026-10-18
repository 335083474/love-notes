import fs from 'node:fs/promises';
const f='src/server/cloudflare-api.mjs';let s=await fs.readFile(f,'utf8');s=s.replaceAll("safe.has(e.message)?e.message:'internal_error');","safe.has(e.message)?e.message:'internal_error',diagnostic(e));");await fs.writeFile(f,s);
