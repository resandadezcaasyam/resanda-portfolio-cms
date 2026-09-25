'use client';

import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';

export function MotionSystem(){
  const path=usePathname();
  const [paused,setPaused]=useState(false);
  useEffect(()=>{
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    const sync=()=>setPaused(localStorage.getItem('portfolio-motion')==='off'||media.matches);
    sync();media.addEventListener('change',sync);
    return()=>media.removeEventListener('change',sync);
  },[]);
  useEffect(()=>{
    document.documentElement.dataset.motion=paused?'off':'on';
    if(paused)return;
    const elements=document.querySelectorAll('main section, .chapter-card, .journey-card, .award-card, .case-panel');
    const animations:Animation[]=[];
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){
        animations.push(entry.target.animate([{opacity:.3,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.2,.7,.2,1)'}));
        observer.unobserve(entry.target);
      }});
    },{threshold:.08});
    elements.forEach(el=>observer.observe(el));
    let frame=0;let active:HTMLElement|null=null;
    const reset=()=>{if(active){active.style.removeProperty('transform');active=null;}};
    const move=(e:PointerEvent)=>{
      if(e.pointerType!=='mouse')return;
      const card=(e.target as HTMLElement).closest<HTMLElement>('[data-tilt]');
      if(!card){reset();return;}
      if(active!==card)reset();active=card;
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        card.style.transform='perspective(1000px) rotateX('+(-y*7)+'deg) rotateY('+(x*9)+'deg) translateY(-3px)';
      });
    };
    document.addEventListener('pointermove',move,{passive:true});
    document.addEventListener('pointerleave',reset);
    return()=>{observer.disconnect();animations.forEach(a=>a.cancel());cancelAnimationFrame(frame);reset();document.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',reset);};
  },[paused,path]);
  return <button className="motion-toggle" aria-pressed={paused} onClick={()=>{localStorage.setItem('portfolio-motion',paused?'on':'off');setPaused(!paused)}}>{paused?'▷ Motion off':'Ⅱ Pause motion'}</button>;
}
