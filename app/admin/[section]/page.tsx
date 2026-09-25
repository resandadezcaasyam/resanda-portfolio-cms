import {notFound} from 'next/navigation';
import Admin,{type Tab} from '@/components/admin-workspace';
export default async function AdminSection({params}:{params:Promise<{section:string}>}){const {section}=await params;if(!['projects','experiences','profile'].includes(section))notFound();return <Admin initialTab={section as Tab}/>}
