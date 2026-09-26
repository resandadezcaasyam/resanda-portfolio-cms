'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import {Component,useCallback,useEffect,useRef,useState,type ReactNode} from 'react';

const ModelCanvas=dynamic(()=>import('./three/coastal-canvas'),{ssr:false});
export type SceneVariant='home'|'about'|'experience'|'projects'|'achievements'|'contact'|'case'|'admin';
const copy:Record<SceneVariant,[string,string,string]>={
 home:['CONNECTED BY CURIOSITY','An idea, taking shape.','Scroll to change perspective ↓'], about:['THE WIDER PICTURE','A small world. A bigger picture.','Scroll to uncover the details ↓'], experience:['A JOURNEY IN PROGRESS','Each stop taught me something.','Follow the route ↓'], projects:['SYSTEMS IN MOTION','Many moving parts, one direction.','Watch the pieces connect ↓'], achievements:['MOMENTS THAT MATTER','Small milestones. Lasting momentum.','See the next milestone ↓'], contact:['OPEN FREQUENCY','A conversation can start anywhere.','Send a signal ↓'], case:['THE WORK, IN CONTEXT','A system built around real decisions.','Trace the story ↓'], admin:['THE STUDIO DESK','The public story, ready to evolve.','Keep the work moving ↓']
};
class CanvasBoundary extends Component<{children:ReactNode;onFailure:()=>void},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}componentDidCatch(){this.props.onFailure();}render(){return this.state.failed?null:this.props.children;}}
export function SpatialScene({story=false,variant='about'}:{story?:boolean;variant?:SceneVariant}){
 const host=useRef<HTMLDivElement>(null);const [near,setNear]=useState(false),[supported,setSupported]=useState(false),[ready,setReady]=useState(false);const showModel=useCallback(()=>setReady(true),[]);const showFallback=useCallback(()=>{setReady(false);setSupported(false);},[]);
 useEffect(()=>{const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setNear(true);observer.disconnect();}},{rootMargin:'300px'});if(host.current)observer.observe(host.current);try{const probe=document.createElement('canvas');const gl=probe.getContext('webgl2');setSupported(Boolean(gl));gl?.getExtension('WEBGL_lose_context')?.loseContext();}catch{setSupported(false);}return()=>observer.disconnect();},[]);
 const [label,title,hint]=copy[variant];
 return <div ref={host} className={'spatial-scene scene-'+variant+' '+(ready?'model-ready':'')} data-model-state={ready?'ready':supported?'loading':'fallback'} role="img" aria-label="Three-dimensional coastal town with a train, houses and cherry blossom trees. Its view follows your scroll."><div className="model-backdrop" aria-hidden="true"><span/><span/></div>{!ready&&<Image src="/images/anime-city.png" className="model-fallback" alt="" fill sizes="(max-width:760px) 90vw, 600px"/>}{near&&supported&&<CanvasBoundary onFailure={showFallback}><ModelCanvas host={host} story={story} variant={variant} onReady={showModel} onFailure={showFallback}/></CanvasBoundary>}<div className="model-caption" aria-hidden="true"><small>{label}</small><b>{title}</b><span>{ready?hint:'Explore the next chapter ↓'}</span></div></div>;
}
