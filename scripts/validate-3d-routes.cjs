const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const routes=['/','/about','/experience','/projects','/achievements','/contact','/projects/linehaul-allocation','/admin','/missing-page'];
 for(const route of routes){
  await page.goto('http://localhost:3000'+route,{waitUntil:'domcontentloaded',timeout:20000});await page.waitForTimeout(1300);
  const state=await page.locator('[data-model-state]').first().getAttribute('data-model-state').catch(()=>null);
  const japanese=/[\u3040-\u30ff\u3400-\u9fff]/.test(await page.locator('body').innerText());
  console.log(`${route} | model=${state} | japanese=${japanese} | title=${await page.title()}`);
 }
 await page.goto('http://localhost:3000/about',{waitUntil:'networkidle'});
 await page.locator('[data-model-state=ready]').waitFor({timeout:10000});
 const before=await page.locator('[data-model-state=ready]').first().getAttribute('data-model-pose');
 await page.mouse.wheel(0,600);await page.waitForTimeout(700);
 const after=await page.locator('[data-model-state=ready]').first().getAttribute('data-model-pose');
 console.log(`scroll pose ${before} -> ${after}`);
 await page.screenshot({path:'artifacts/3d-route-validation.png',fullPage:false});
 await page.locator('a[href="/contact"]').first().click();await page.waitForTimeout(1100);
 console.log(`transition route=${new URL(page.url()).pathname} curtain=${await page.locator('.route-curtain').evaluate(e=>getComputedStyle(e).transform)}`);
 await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
