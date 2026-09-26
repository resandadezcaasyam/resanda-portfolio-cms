import { notFound } from "next/navigation";
import { ServerJourney } from "@/components/world/server-journey";
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  if (
    ![
      "about",
      "experience",
      "projects",
      "skills",
      "achievements",
      "contact",
    ].includes(page)
  )
    notFound();
  return <ServerJourney initial={page} />;
}
