const {chromium}=require('@playwright/test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sharp=require('sharp');
(async()=>{
 const entries=[['/','casual','.portrait-stage'],['/about','seated','.photo-seated'],['/contact','seated','.photo-contact'],['/experience','marker','.photo-marker']];
 const browser=await chromium.launch();
 const page=await browser.newPage({reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 fs.mkdirSync('artifacts/portraits',{recursive:true});
 for(const [,name] of entries){
   const stats=await sharp('public/images/resanda-'+name+'.png').stats();
   assert.equal(stats.isOpaque,false,name+' alpha');
 }
 for(const width of [1440,390,320]){
   await page.setViewportSize({width,height:950});
   for(const [route,name,selector] of entries){
     const response=await page.goto('http://localhost:3000'+route,{waitUntil:'networkidle'});
     assert.equal(response.status(),200);
     const frame=page.locator(selector);
     await frame.scrollIntoViewIfNeeded();
     const photo=frame.locator('img');
     await photo.evaluate(img=>img.decode());
     assert.ok((await photo.getAttribute('src')).includes('resanda-'+name+'.png'));
     assert.equal(await photo.evaluate(img=>getComputedStyle(img).objectFit),'contain');
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,name+' overflow '+width);
     assert.ok(await photo.evaluate(img=>img.naturalWidth>0));
     if(width!==320){
       await frame.screenshot({path:'artifacts/portraits/'+name+'-'+width+'.png'});
       await page.screenshot({path:'artifacts/portraits/'+name+'-page-'+width+'.png',fullPage:true});
     }
   }
 }
 assert.deepEqual(errors,[]);
 await browser.close();
 console.log('PASS: all four transparent portraits mapped to correct pages; images decode; contain framing; no overflow at 1440, 390, 320px; no page errors.');
})().catch(e=>{console.error(e);process.exit(1)});
