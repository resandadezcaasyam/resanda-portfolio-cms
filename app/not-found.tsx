import Link from "next/link";
import { WorldNav } from "@/components/world/journey";
export default function NotFound() {
  return (
    <div className="public-world">
      <WorldNav />
      <main id="main-content" className="world-section lost-world">
        <p className="world-eyebrow">404 / UNCHARTED TERRITORY</p>
        <h1>
          A different
          <br />
          direction.
        </h1>
        <p>This page is not here. Your next chapter is.</p>
        <Link className="world-button" href="/">
          Return to the journey ↗
        </Link>
      </main>
    </div>
  );
}
