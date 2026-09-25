const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const assert = require('node:assert/strict');

(async () => {
 const browser = await chromium.launch({headless:true});
 const context = await browser.newContext();
 const page = await context.newPage();
 const errors = [];
 page.on('pageerror', error => errors.push(error.message));
 const routes=['/','/about','/experience','/projects','/achievements','/contact','/projects/linehaul-operations','/projects/retail-beauty-academy','/projects/k-owl-question-bank','/admin','/admin/projects','/admin/experiences','/admin/profile','/missing-chapter'];
 fs.mkdirSync('artifacts/ui',{recursive:true});
 for(const width of [1440,390,320,768]){
   await page.setViewportSize({width,height:900});
   for(const route of routes){
     const response=await page.goto('http://localhost:3000'+route,{waitUntil:'networkidle'});
     assert.equal(response.status(),route==='/missing-chapter'?404:200,route+' status');
     await page.locator('h1').waitFor();
     await page.evaluate(()=>document.fonts.ready);
     const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
     assert.equal(overflow,false,route+' overflows at '+width);
     const bad=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src));
     assert.equal(bad.length,0,route+' broken images');
     if([1440,390].includes(width)){
       await page.getByRole('button',{name:/Pause motion|Motion off/}).evaluate(button=>{if(button.getAttribute('aria-pressed')==='false')button.click()});
       await page.screenshot({path:'artifacts/ui/'+(route==='/'?'home':route.slice(1).replaceAll('/','-'))+'-'+width+'.png',fullPage:true});
     }
   }
 }
 await page.setViewportSize({width:390,height:844});
 await page.goto('http://localhost:3000/about');
 await page.getByRole('button',{name:'Menu ☰'}).click();
 await page.locator('#site-navigation').getByRole('link',{name:'Projects'}).click();
 await page.waitForURL('**/projects');
 await page.getByRole('button',{name:'AI Product',exact:true}).click();
 assert.equal(await page.locator('.chapter-card').count(),1);
 await page.getByLabel('Search projects').fill('no-such-project');
 assert.equal(await page.locator('.chapter-card').count(),0);
 await page.getByRole('button',{name:'Reset filters'}).click();
 assert.ok(await page.locator('.chapter-card').count()>1);
 await page.goto('http://localhost:3000/experience');
 await page.locator('summary').first().click();
 assert.equal(await page.locator('details').first().getAttribute('open'),'');
 await page.goto('http://localhost:3000/admin/projects');
 await page.getByRole('button',{name:'+ New',exact:true}).click();
 await page.getByLabel('Title',{exact:true}).fill('Interface check');
 assert.equal(await page.getByLabel('Title',{exact:true}).inputValue(),'Interface check');
 await page.getByRole('button',{name:'Cancel',exact:true}).click();
 await page.goto('http://localhost:3000/contact');
 await page.getByLabel('Your name',{exact:true}).fill('Test reader');
 await page.getByLabel('Your idea',{exact:true}).fill('I would like to discuss a product idea.');
 assert.equal(await page.locator('form').evaluate(f=>f.checkValidity()),true);
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 await page.getByRole('button',{name:'Copy email address'}).click();
 await page.getByRole('button',{name:'Email copied ✓'}).waitFor();
 await page.getByRole('button',{name:/Pause motion|Motion off/}).evaluate(b=>{if(b.getAttribute('aria-pressed')==='false')b.click()});
 assert.equal(await page.evaluate(()=>document.documentElement.dataset.motion),'off');
 const reduced=await browser.newContext({reducedMotion:'reduce'});
 const rp=await reduced.newPage();await rp.goto('http://localhost:3000/projects');
 await rp.waitForFunction(()=>document.documentElement.dataset.motion==='off');
 assert.equal(await rp.locator('.cube').evaluate(el=>getComputedStyle(el).animationName),'none');
 assert.equal(errors.length,0,errors.join('\n'));
 console.log('PASS: 14 routes × 4 viewport widths; navigation, filters, timeline, admin form, email copy, motion controls; no page errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
