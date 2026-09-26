import { getExperiences, getProfile, getProjects } from "@/lib/store";
import { getWorldConfig } from "@/lib/world-store";
import { Journey } from "./journey";
export async function ServerJourney({
  initial = "home",
}: {
  initial?: string;
}) {
  const [profile, projects, experiences, config] = await Promise.all([
    getProfile(),
    getProjects(),
    getExperiences(),
    getWorldConfig(),
  ]);
  return <Journey {...{ profile, projects, experiences, config, initial }} />;
}
