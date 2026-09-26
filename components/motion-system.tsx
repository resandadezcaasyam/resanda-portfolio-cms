'use client';

import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {usePathname,useRouter} from 'next/navigation';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function MotionSystem(){
 const path=usePathname(),router=useRouter();
 const [paused,setPaused]=useState(false);
 const curtain=useRef<HTMLDivElement>(null);
 const bar=useRef<HTMLDivElement>(null);
 const busy=useRef(false);
 const safety=useRef<ReturnType<typeof setTimeout>|null>(null);

 useEffect(()=>{
   const media=matchMedia('(prefers-reduced-motion: reduce)');
   const sync=()=>setPaused(media.matches||localStorage.getItem('portfolio-motion')==='off');
   sync();media.addEventListener('change',sync);
   return()=>media.removeEventListener('change',sync);
 },[]);
 useEffect(()=>{
   document.documentElement.dataset.motion=paused?'off':'on';
   window.dispatchEvent(new Event('portfolio-motion-change'));
 },[paused]);

 useLayoutEffect(()=>{
   if(safety.current)clearTimeout(safety.current);
   const wasCovered=busy.current;
   busy.current=false;
   const root=document.documentElement,main=document.querySelector('main');
   root.dataset.routePhase=paused?'idle':'entering';
   gsap.set(curtain.current,{y:0,yPercent:wasCovered?0:-105});
   if(paused){gsap.set(curtain.current,{y:0,yPercent:-105});return;}
   const ctx=gsap.context(()=>{
     const enter=gsap.timeline({onComplete:()=>{root.dataset.routePhase='idle';}});
     enter.to(curtain.current,{yPercent:-105,duration:.55,ease:'power3.inOut'},0);
     if(main)enter.fromTo(main,{opacity:.3,y:24},{opacity:1,y:0,duration:.7,ease:'power3.out',clearProps:'transform,opacity'},.12);
     document.querySelectorAll<HTMLElement>('main section').forEach((section,index)=>{
       if(section.classList.contains('scroll-story'))return;
       const targets=section.querySelectorAll(':scope > .section-heading, :scope > h2, :scope > p, :scope > .about-grid, :scope > .skill-grid > article, :scope > .project-grid > article, :scope > .journey-layout > .journey-timeline > article, :scope > .award-grid > article, :scope > .contact-grid > div, :scope > .story-notes > article, :scope > .impact-grid > article, :scope > div > .case-panel');
       const items=targets.length?Array.from(targets):Array.from(section.children).filter(el=>el.tagName!=='ASIDE');
       if(index===0)return;
       gsap.fromTo(items,{y:46,opacity:.16},{y:0,opacity:1,duration:.8,stagger:.075,ease:'power3.out',scrollTrigger:{trigger:section,start:'top 86%',toggleActions:'play none none reverse',invalidateOnRefresh:true},clearProps:'transform',onStart:()=>{section.dataset.sectionMotion='playing';},onComplete:()=>{section.dataset.sectionMotion='shown';}});
     });
     if(bar.current)gsap.fromTo(bar.current,{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:document.body,start:'top top',end:'bottom bottom',scrub:true}});
   });
   const refresh=()=>ScrollTrigger.refresh();
   window.addEventListener('load',refresh);
   document.fonts.ready.then(refresh);
   const timer=setTimeout(refresh,500);
   return()=>{clearTimeout(timer);window.removeEventListener('load',refresh);ctx.revert();};
 },[path,paused]);

 useEffect(()=>{
   const click=(e:MouseEvent)=>{
     if(paused||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.defaultPrevented)return;
     const a=(e.target as Element).closest<HTMLAnchorElement>('a[href]');
     if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
     const url=new URL(a.href,location.href);
     if(url.origin!==location.origin||url.pathname===location.pathname)return;
     if(!['http:','https:'].includes(url.protocol))return;
     e.preventDefault();e.stopPropagation();
     if(busy.current)return;
     busy.current=true;
     document.documentElement.dataset.routePhase='leaving';
     router.prefetch(url.pathname);
     gsap.killTweensOf(curtain.current);
     gsap.fromTo(curtain.current,{y:0,yPercent:105},{y:0,yPercent:0,duration:.38,ease:'power3.inOut',onComplete:()=>{
       document.documentElement.dataset.routePhase='loading';
       router.push(url.pathname+url.search+url.hash);
     }});
     safety.current=setTimeout(()=>{
       busy.current=false;document.documentElement.dataset.routePhase='idle';
       gsap.to(curtain.current,{yPercent:-105,duration:.3});
     },8000);
   };
   document.addEventListener('click',click,true);
   return()=>{document.removeEventListener('click',click,true);if(safety.current)clearTimeout(safety.current);};
 },[paused,router]);
 return <><div ref={bar} className="reading-progress" aria-hidden="true"/><div ref={curtain} className="route-curtain" aria-hidden="true"><span>RESANDA DEZCA</span><b>On to the next chapter.</b><i>✦</i></div><button className="motion-toggle" aria-pressed={paused} onClick={()=>{localStorage.setItem('portfolio-motion',paused?'on':'off');setPaused(!paused)}}>{paused?'▷ Motion off':'Ⅱ Pause motion'}</button></>;
}
