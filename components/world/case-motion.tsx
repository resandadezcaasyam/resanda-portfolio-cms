"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { worldState } from "./state";
import Lenis from "lenis";
gsap.registerPlugin(ScrollTrigger);
export function CaseMotion() {
  useEffect(() => {
    worldState.chapter = 3;
    worldState.local = 0;
    worldState.progress = 0.5;
    let lenis: Lenis | undefined;
    const sync = () => {
      lenis?.destroy();
      if (
        !matchMedia("(prefers-reduced-motion: reduce)").matches &&
        localStorage.getItem("portfolio-motion") !== "off"
      ) {
        lenis = new Lenis({
          autoRaf: true,
          anchors: true,
          duration: 1,
        });
        lenis.on("scroll", ScrollTrigger.update);
      }
    };
    sync();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".world-case-header",
        { y: 30 },
        { y: 0, duration: worldState.reduced ? 0 : 0.7 },
      );
      ScrollTrigger.create({
        trigger: ".world-case",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          worldState.chapter = 3;
          worldState.local = self.progress;
          worldState.progress = 0.48 + self.progress * 0.2;
          window.dispatchEvent(new Event("world-frame"));
        },
      });
    });
    window.addEventListener("portfolio-motion-change", sync);
    return () => {
      ctx.revert();
      lenis?.destroy();
      window.removeEventListener("portfolio-motion-change", sync);
    };
  }, []);
  return null;
}
