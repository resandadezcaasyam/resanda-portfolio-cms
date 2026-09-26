const {chromium}=require('playwright');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:3000',{waitUntil:'networkidle'});await page.locator('[data-world-state=ready]').waitFor({timeout:30000});await page.waitForTimeout(1200);
 await page.screenshot({path:'artifacts/world-desktop.png'});
 const canvas=await page.locator('.universe canvas').elementHandle();
 console.log('home',await page.locator('h1').innerText(),'canvas',await page.locator('canvas').count());
 await page.locator('.world-nav a[href="#experience"]').click();await page.waitForTimeout(1700);console.log('experience',await page.locator('canvas').getAttribute('data-chapter'));await page.screenshot({path:'artifacts/world-experience.png'});
 await page.locator('.world-nav a[href="#projects"]').click();await page.waitForTimeout(1700);await page.screenshot({path:'artifacts/world-projects.png'});
 await page.locator('.project-plane a').first().click();await page.waitForURL('**/projects/*');await page.waitForTimeout(1000);console.log('case',page.url(),'persistent canvas',await canvas.evaluate(el=>el.isConnected));
 await page.screenshot({path:'artifacts/world-case.png'});
 for(const route of ['/about','/experience','/projects','/skills','/achievements','/contact','/admin','/admin/projects','/admin/experiences','/admin/profile','/admin/world','/resume']){const res=await page.goto('http://localhost:3000'+route,{waitUntil:'networkidle'});await page.waitForTimeout(500);console.log(route,res.status(),'overflow',await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));}
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:1});await mobile.goto('http://localhost:3000',{waitUntil:'networkidle'});await mobile.waitForTimeout(1000);await mobile.screenshot({path:'artifacts/world-mobile.png'});console.log('mobile overflow',await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth));await mobile.getByRole('button',{name:'Explore',exact:true}).click();await mobile.locator('.world-nav nav a[href="#contact"]').click();await mobile.waitForTimeout(1700);await mobile.screenshot({path:'artifacts/world-contact-mobile.png'});
 const reduced=await browser.newPage({reducedMotion:'reduce',viewport:{width:1280,height:900}});await reduced.goto('http://localhost:3000/skills',{waitUntil:'networkidle'});console.log('reduced',await reduced.locator('html').getAttribute('data-motion'));await reduced.getByRole('button',{name:'04 Data & Analytics'}).click();console.log('skill panel',await reduced.locator('.expertise-detail h3').innerText());
 const noGL=await browser.newPage();await noGL.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.includes('webgl')?null:original.call(this,type,...args);};});await noGL.goto('http://localhost:3000/contact',{waitUntil:'networkidle'});console.log('fallback',await noGL.locator('[data-world-state]').getAttribute('data-world-state'),'contact',await noGL.locator('.contact-email').innerText());
 console.log('PAGE_ERRORS',JSON.stringify(errors));fs.writeFileSync('artifacts/world-audit-errors.json',JSON.stringify(errors,null,2));await browser.close();if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1);});
