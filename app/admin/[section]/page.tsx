import { notFound } from "next/navigation";
import Link from "next/link";
import Admin, { type Tab } from "@/components/admin-workspace";
export default async function AdminSection({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!["projects", "experiences", "profile"].includes(section)) notFound();
  return (
    <>
      <div className="config-access">
        <Link href="/admin/world">Edit skills, achievements & links →</Link>
      </div>
      <Admin initialTab={section as Tab} />
    </>
  );
}
