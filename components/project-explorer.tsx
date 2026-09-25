'use client';
import {useState} from 'react';
import type {Project} from '@/lib/content';
import {ProjectCard} from './portfolio-ui';
export function ProjectExplorer({projects}:{projects:Project[]}){
 const [filter,setFilter]=useState('All'),[query,setQuery]=useState('');
 const categories=['All',...Array.from(new Set(projects.map(p=>p.category)))];
 const filtered=projects.filter(p=>(filter==='All'||p.category===filter)&&(p.title+' '+p.summary+' '+p.tags.join(' ')).toLowerCase().includes(query.toLowerCase()));
 return <><div className="explorer-toolbar"><div className="filter-tabs" aria-label="Project categories">{categories.map(c=><button aria-pressed={filter===c} className={filter===c?'selected':''} key={c} onClick={()=>setFilter(c)}>{c}</button>)}</div><label className="search-label">Search projects<input type="search" placeholder="Search a topic…" value={query} onChange={e=>setQuery(e.target.value)}/></label></div><p className="result-count" aria-live="polite">{filtered.length} projects in this chapter</p><div className="project-grid">{filtered.map((p,i)=><ProjectCard key={p.id} project={p} index={i}/>)}</div>{!filtered.length&&<div className="empty-state"><h3>No matching projects</h3><p>Try a different topic or explore all categories.</p><button className="secondary" onClick={()=>{setQuery('');setFilter('All')}}>Reset filters</button></div>}</>
}
