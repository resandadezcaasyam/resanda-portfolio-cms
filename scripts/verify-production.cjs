const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base='http://localhost:3000';
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=[];
 page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/projects/linehaul-operations',{waitUntil:'networkidle'});await page.locator('[data-world-state=ready]').waitFor();const canvas=await page.locator('.universe canvas').elementHandle();
 await page.locator('.world-nav nav').getByRole('link',{name:'About',exact:true}).click();await page.waitForURL('**/about');await page.waitForTimeout(500);assert(await canvas.evaluate(el=>el.isConnected));console.log('PASS: canvas persists through detail-to-chapter navigation.');
 await page.getByRole('button',{name:'Pause motion'}).click();await page.waitForTimeout(300);assert.equal(await page.locator('html').getAttribute('data-motion'),'off');await page.getByRole('button',{name:'Enable motion'}).click();await page.waitForTimeout(300);assert.equal(await page.locator('html').getAttribute('data-motion'),'on');console.log('PASS: pause and resume update the global scene.');
 const mobile=await browser.newPage({viewport:{width:320,height:740},reducedMotion:'reduce'});for(const route of ['/','/skills','/contact']){await mobile.goto(base+route,{waitUntil:'networkidle'});assert(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}console.log('PASS: narrow 320px viewport has no horizontal overflow.');
 const projects=await fetch(base+'/api/projects').then(r=>r.json());const draft={...projects[0],id:'verification-draft',slug:'verification-draft',title:'Verification draft only',featured:false,status:'draft'};
 try{const created=await fetch(base+'/api/projects',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(draft)});assert.equal(created.status,201);assert.equal((await fetch(base+'/projects/verification-draft')).status,404);assert(!require('fs').readFileSync('data/portfolio.json','utf8').includes('undefined'));}finally{await fetch(base+'/api/projects?id=verification-draft',{method:'DELETE'});}assert.deepEqual(await fetch(base+'/api/projects').then(r=>r.json()),projects);console.log('PASS: durable project CRUD, hidden draft routing, original data restored.');
 assert.deepEqual(errors,[]);console.log('PASS: production console and runtime clean.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
