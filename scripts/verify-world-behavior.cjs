const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base='http://localhost:3000';
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1440,height:960},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const config=await fetch(base+'/api/world').then(r=>r.json());
 try{
  const changed=structuredClone(config);changed.skills[0].name='Verified product discipline';
  let res=await fetch(base+'/api/world',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(changed)});assert.equal(res.status,200);
  await page.goto(base+'/skills',{waitUntil:'networkidle'});assert(await page.getByRole('button',{name:/Verified product discipline/}).isVisible());
  changed.links.github='javascript:alert(1)';res=await fetch(base+'/api/world',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(changed)});assert.equal(res.status,400);
 }finally{const restored=await fetch(base+'/api/world',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(config)});assert.equal(restored.status,200);}
 console.log('PASS: CMS edit reflected in scene controls; unsafe link rejected; original content restored.');
 await page.goto(base+'/projects',{waitUntil:'networkidle'});const projects=await fetch(base+'/api/projects').then(r=>r.json());const visible=projects.filter(p=>p.status==='published');assert.equal(await page.locator('.project-plane').count(),visible.length);
 await page.getByPlaceholder('Find a project…').fill('not-a-project-987654');assert.equal(await page.locator('.project-plane').count(),0);await page.getByRole('button',{name:'Reset filters'}).click();assert.equal(await page.locator('.project-plane').count(),visible.length);
 const canvas=await page.locator('.universe canvas').elementHandle();await page.locator('.project-plane a').first().click();await page.waitForURL('**/projects/*');assert(await canvas.evaluate(el=>el.isConnected));assert.equal(await page.locator('.universe canvas').count(),1);
 console.log('PASS: CMS project counts, search reset and persistent canvas through case navigation.');
 await page.goto(base+'/contact',{waitUntil:'networkidle'});const email=await page.locator('.contact-email').getAttribute('href');assert(email.startsWith('mailto:'));const resume=await page.getByRole('link',{name:'Resume ↗'}).getAttribute('href');assert.equal((await fetch(base+resume)).status,200);
 await page.goto(base+'/admin/world',{waitUntil:'networkidle'});await page.getByRole('button',{name:'Save portfolio content'}).click();await page.getByRole('status').filter({hasText:'Saved.'}).waitFor();assert.equal(await page.locator('.universe').count(),0);
 console.log('PASS: contact links, original resume PDF and conventional CMS save.');
 const noJS=await browser.newPage({javaScriptEnabled:false});await noJS.goto(base);assert((await noJS.locator('body').innerText()).includes(visible[0].title));assert(await noJS.locator('#contact').count());console.log('PASS: core content available without JavaScript/WebGL.');
 await page.goto(base+'/skills',{waitUntil:'networkidle'});await page.locator('#skills').scrollIntoViewIfNeeded();await page.screenshot({path:'artifacts/world-skills.png'});
 await page.goto(base+'/experience',{waitUntil:'networkidle'});await page.locator('.career-station').first().scrollIntoViewIfNeeded();await page.screenshot({path:'artifacts/world-career-detail.png'});
 assert.deepEqual(errors,[]);console.log('PASS: no browser runtime errors.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
