'use client';
import {useEffect,useRef,useState} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {SpatialScene} from './spatial-scene';
gsap.registerPlugin(ScrollTrigger);
const steps=[
 ['01','Find the signal.','Start with the people, decisions, and constraints. Look at the whole system before deciding what to build.'],
 ['02','Connect the pieces.','Turn scattered needs into a shared direction. Connect workflows, information, and the teams doing the work.'],
 ['03','Make it work together.','Bring the details into place, validate the journey, and keep improving what reaches the real world.']
];
export function ScrollStory(){
 const section=useRef<HTMLElement>(null);
 const [active,setActive]=useState(0);
 useEffect(()=>{
   const triggers=Array.from(section.current?.querySelectorAll('.story-step')||[]).map((step,i)=>ScrollTrigger.create({trigger:step,start:'top 60%',end:'bottom 60%',onEnter:()=>setActive(i),onEnterBack:()=>setActive(i)}));
   return()=>triggers.forEach(t=>t.kill());
 },[]);
 return <section className="scroll-story" ref={section} aria-label="How I approach a product challenge">
   <div className="story-sticky"><div className="story-stage-title"><p className="eyebrow">FROM CURIOSITY TO CLARITY</p><h2>See the system.<br/><i>Shape the journey.</i></h2></div><SpatialScene story variant="home"/><div className="story-dots" aria-label={'Step '+(active+1)+' of 3'}>{steps.map(([n,title],i)=><a href={'#process-'+n} className={i===active?'active':''} aria-current={i===active?'step':undefined} key={n}>{n}<span className="sr-only"> {title}</span></a>)}</div></div>
   <div className="story-steps">{steps.map(([n,title,copy],i)=><article id={'process-'+n} className={'story-step '+(active===i?'active':'')} key={n}><span>{n} / THE PROCESS</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
 </section>
}
