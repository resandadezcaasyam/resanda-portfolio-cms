import './globals.css';
import {MotionSystem} from '@/components/motion-system';
import type { Metadata } from 'next';
export const metadata: Metadata={title:'Resanda Dezca | Product Portfolio',description:'Product systems, data and AI work by Resanda Dezca.',openGraph:{title:'Resanda Dezca | Product Portfolio',description:'Product systems, data and AI work.'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}<MotionSystem/></body></html>}
