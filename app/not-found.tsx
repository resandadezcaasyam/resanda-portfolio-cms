import Link from 'next/link';
import {Nav,Footer} from '@/components/site-shell';
export default function NotFound(){return <><Nav/><main id="main-content"><section className="section not-found"><p className="eyebrow">404 / AN UNWRITTEN CHAPTER</p><h1>A small detour.<br/><i>Let’s find your way.</i></h1><p>This page is not here, but there are more stories to explore.</p><Link className="primary" href="/">Back to the beginning ↗</Link></section></main><Footer/></>}
