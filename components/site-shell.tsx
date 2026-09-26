'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect,useState} from 'react';
const links=[['/about','About'],['/experience','Experience'],['/projects','Projects'],['/achievements','Achievements'],['/contact','Contact']] as const;
export function Nav(){
 const [open,setOpen]=useState(false);const path=usePathname();
 useEffect(()=>{setOpen(false)},[path]);
 useEffect(()=>{const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close)},[]);
 return <><a className="skip-link" href="#main-content">Skip to content</a><header className="nav"><Link className="brand" href="/"><span className="brand-icon">R</span><span className="brand-name">RESANDA DEZCA<small>PRODUCT & POSSIBILITIES</small></span></Link><button className="menu" aria-controls="site-navigation" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?'Close ✕':'Menu ☰'}</button><nav id="site-navigation" className={open?'open':''}>{links.map(([href,label])=><Link aria-current={path===href||path.startsWith(href+'/')?'page':undefined} className={path===href||path.startsWith(href+'/')?'active':''} href={href} key={href} onClick={()=>setOpen(false)}>{label}</Link>)}</nav><Link className="nav-contact" href="/contact">Say hello ↗</Link></header></>
}
export function Footer(){return <footer><Link className="footer-brand" href="/">RESANDA DEZCA <span>✦</span></Link><span>Built with curiosity. Made for people.<br/><small>© 2026 · From curiosity to clarity.</small></span><div><Link href="/projects">Work ↗</Link><Link href="/contact">Contact ↗</Link><Link href="/admin">Studio ↗</Link></div></footer>}
