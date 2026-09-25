import Link from 'next/link';
import {notFound} from 'next/navigation';
import {Nav,Footer} from '@/components/site-shell';
import {ProjectVisual,ChapterEnd} from '@/components/portfolio-ui';
import {getProject,getProjects} from '@/lib/store';
export const dynamic='force-dynamic';
export default async function Project({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const p=await getProject(slug);if(!p)notFound();
 const all=await getProjects();const next=all[(all.findIndex(x=>x.id===p.id)+1)%all.length];
 return <><Nav/><main id="main-content"><section className="case-hero section"><Link className="text-link" href="/projects">← Back to projects</Link><div className="case-intro"><div><p className="eyebrow">PROJECT NOTES / {p.category.toUpperCase()}</p><h1>{p.title}</h1><p className="lead">{p.summary}</p></div><div className="case-art" data-tilt><ProjectVisual project={p}/></div></div><div className="case-meta">{[['ROLE',p.role||'Product'],['PERIOD',p.duration||'Project exploration'],['FOCUS',p.tags.join(' · ')]].map(([k,v])=><div key={k}><small>{k}</small><b>{v}</b></div>)}</div></section>
 <section className="section case-content"><aside className="case-index"><p className="eyebrow">IN THIS STORY</p><a href="#challenge">01 / The challenge</a><a href="#approach">02 / The approach</a><a href="#outcome">03 / The outcome</a></aside><div>{[['challenge','01','The challenge','Find the real friction.',p.challenge||p.summary],['approach','02','The approach','Design for the decision.',p.case_study||p.summary],['outcome','03','The outcome','Make work move forward.',p.outcome||'Further project outcomes have not been published.']].map(([id,n,label,title,copy])=><article className="case-panel panel" id={id} key={id}><span className="note-index">{n}</span><p className="eyebrow">{label}</p><h2>{title}</h2><p>{copy}</p></article>)}
 {p.destination_type!=='internal'&&p.destination_url&&<a className="primary" href={p.destination_url} target="_blank" rel="noreferrer">Open project resource ↗</a>}
 {next&&next.id!==p.id&&<Link className="next-project" href={'/projects/'+next.slug}><small>CONTINUE EXPLORING</small><h3>{next.title} ↗</h3></Link>}</div></section><ChapterEnd/></main><Footer/></>
}
