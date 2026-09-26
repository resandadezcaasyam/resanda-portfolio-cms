"use client";
import {
  Component,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { worldState } from "./state";
const Universe = dynamic(() => import("./universe"), { ssr: false });
class Boundary extends Component<
  { children: ReactNode; fail: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.fail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function WorldProvider() {
  const path = usePathname(),
    admin = path.startsWith("/admin");
  const [supported, setSupported] = useState(false),
    [ready, setReady] = useState(false),
    [reduced, setReduced] = useState(true),
    [mobile, setMobile] = useState(false),
    [visible, setVisible] = useState(true);
  const fail = useCallback(() => {
      setSupported(false);
      setReady(false);
    }, []),
    loaded = useCallback(() => setReady(true), []);
  useEffect(() => {
    const sync = () => {
      const off =
        matchMedia("(prefers-reduced-motion: reduce)").matches ||
        localStorage.getItem("portfolio-motion") === "off";
      setReduced(off);
      worldState.reduced = off;
      document.documentElement.dataset.motion = off ? "off" : "on";
      setMobile(innerWidth < 760);
    };
    sync();
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    media.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    window.addEventListener("portfolio-motion-change", sync);
    const visibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    try {
      const gl = document.createElement("canvas").getContext("webgl2");
      setSupported(Boolean(gl));
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      fail();
    }
    const pointer = (e: PointerEvent) => {
      worldState.pointerX = (e.clientX / innerWidth) * 2 - 1;
      worldState.pointerY = -((e.clientY / innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", pointer, { passive: true });
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
      window.removeEventListener("portfolio-motion-change", sync);
      window.removeEventListener("pointermove", pointer);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [fail]);
  useEffect(() => {
    document.documentElement.dataset.site = admin ? "admin" : "public";
  }, [admin]);
  if (admin) return null;
  return (
    <>
      <div className="universe-fallback" aria-hidden="true">
        <div />
        <div />
        <div />
      </div>
      <div
        className="universe"
        aria-hidden="true"
        data-world-state={ready ? "ready" : supported ? "loading" : "fallback"}
      >
        {supported && (
          <Boundary fail={fail}>
            <Universe
              mobile={mobile}
              reduced={reduced || !visible}
              onReady={loaded}
              onFailure={fail}
            />
          </Boundary>
        )}
      </div>
      <button
        className="world-motion"
        onClick={() => {
          localStorage.setItem("portfolio-motion", reduced ? "on" : "off");
          window.dispatchEvent(new Event("portfolio-motion-change"));
        }}
        aria-pressed={reduced}
      >
        {reduced ? "Enable motion" : "Pause motion"}{" "}
        <span aria-hidden="true">{reduced ? "▷" : "Ⅱ"}</span>
      </button>
    </>
  );
}
