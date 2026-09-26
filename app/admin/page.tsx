import Admin from "@/components/admin-workspace";
import Link from "next/link";
export default function AdminPage() {
  return (
    <>
      <div className="config-access">
        <Link href="/admin/world">Edit skills, achievements & links →</Link>
      </div>
      <Admin />
    </>
  );
}
