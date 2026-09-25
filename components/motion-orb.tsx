'use client';
import {useState} from 'react';
export function MotionOrb(){const [p,setP]=useState({x:0,y:0});return <div className="orb-wrap" onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();setP({x:(e.clientX-r.left)/r.width-.5,y:(e.clientY-r.top)/r.height-.5})}} onMouseLeave={()=>setP({x:0,y:0})}><div className="orb" style={{transform:`rotateX(${p.y*-16}deg) rotateY(${p.x*20}deg)`}}><span></span><span></span><span></span><b>PM<br/>+ AI</b></div><small>Move your cursor</small></div>}
