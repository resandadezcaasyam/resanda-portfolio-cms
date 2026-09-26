import { getWorldConfig } from "@/lib/world-store";
import { ConfigEditor } from "@/components/world/config-editor";
export const dynamic = "force-dynamic";
export default async function WorldEditor() {
  return <ConfigEditor initial={await getWorldConfig()} />;
}
