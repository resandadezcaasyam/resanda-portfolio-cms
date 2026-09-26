"use client";
import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  Environment,
  Lightformer,
  PerformanceMonitor,
} from "@react-three/drei";
import * as THREE from "three";
import { worldState as w } from "./state";

const vertex = `varying vec3 vNormal; varying vec3 vPosition; void main(){vNormal=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.);vPosition=p.xyz;gl_Position=projectionMatrix*p;}`;
const fragment = `varying vec3 vNormal;varying vec3 vPosition;uniform float phase;void main(){vec3 n=normalize(vNormal);float rim=pow(1.-abs(dot(n,normalize(-vPosition))),2.4);float bands=sin(vPosition.y*5.+phase*2.)*.5+.5;vec3 ink=vec3(.045,.075,.095);vec3 silver=vec3(.62,.81,.78);gl_FragColor=vec4(mix(ink,silver,rim*.9+bands*.12),.96);}`;
const count = 32;
function destination(
  i: number,
  chapter: number,
  t: number,
  target: THREE.Vector3,
) {
  const a = (i / count) * Math.PI * 2,
    active = Math.max(
      1,
      [
        count,
        5,
        w.counts.experience,
        w.counts.projects,
        w.counts.skills,
        w.counts.achievements,
        count,
      ][chapter],
    );
  if (chapter === 0)
    target.set(Math.cos(a) * 2.35, Math.sin(a) * 2.35, Math.sin(a * 3) * 0.45);
  if (chapter === 1)
    target.set(Math.cos(a) * 3.25, Math.sin(a) * 2.2, Math.sin(a * 2) * 1.1);
  if (chapter === 2)
    target.set(
      Math.sin(i * 0.8) * 1.65,
      (i % 2 ? 1 : -1) * 0.65,
      -i * 0.68 + t * active * 0.68,
    );
  if (chapter === 3)
    target.set(
      Math.sin(a + t * 1.4) * 3.4,
      Math.cos(a) * 1.1,
      Math.cos(a + t * 1.4) * 2.4,
    );
  if (chapter === 4)
    target.set(Math.cos(a) * 2.7, Math.sin(a) * 2.4, Math.sin(a * 3) * 1.2);
  if (chapter === 5)
    target.set(Math.cos(a) * 1.8, Math.sin(a) * 1.8, ((i % 3) - 1) * 0.9);
  if (chapter === 6)
    target.set(
      Math.cos(a) * (0.8 + t * 0.35),
      Math.sin(a) * (0.8 + t * 0.35),
      Math.sin(a * 4) * 0.5,
    );
  return target;
}
function World({
  mobile,
  reduced,
  onReady,
}: {
  mobile: boolean;
  reduced: boolean;
  onReady: () => void;
}) {
  const nodes = useRef<THREE.InstancedMesh>(null),
    rings = useRef<THREE.Group>(null),
    core = useRef<THREE.Mesh>(null),
    network = useRef<THREE.LineSegments>(null),
    particles = useRef<THREE.Points>(null),
    keyLight = useRef<THREE.PointLight>(null),
    stations = useRef<THREE.InstancedMesh>(null),
    panels = useRef<THREE.InstancedMesh>(null),
    milestones = useRef<THREE.InstancedMesh>(null);
  const { camera, invalidate, gl } = useThree();
  const state = useMemo(
    () => ({
      dummy: new THREE.Object3D(),
      from: new THREE.Vector3(),
      to: new THREE.Vector3(),
      look: new THREE.Vector3(),
      cam: new THREE.Vector3(),
      positions: new Float32Array(count * 6),
      uniforms: { phase: { value: 0 } },
      time: 0,
    }),
    [],
  );
  const dust = useMemo(() => {
    const data = new Float32Array((mobile ? 70 : 220) * 3);
    for (let i = 0; i < data.length; i++)
      data[i] = (Math.sin(i * 127.1 + 31.7) * 0.5 + 0.5 - 0.5) * 28;
    return data;
  }, [mobile]);
  useEffect(() => {
    onReady();
    const listener = () => invalidate();
    window.addEventListener("world-frame", listener);
    return () => window.removeEventListener("world-frame", listener);
  }, [onReady, invalidate]);
  useFrame((_, dt) => {
    const ch = Math.min(6, Math.floor(w.chapter)),
      blend = THREE.MathUtils.smoothstep(w.local, 0.65, 1),
      next = Math.min(ch + 1, 6),
      damp = 1 - Math.exp(-Math.min(dt, 0.05) * 5);
    state.time += reduced ? 0 : dt;
    const px = reduced ? 0 : w.pointerX * 0.15,
      py = reduced ? 0 : w.pointerY * 0.12;
    const cameraPos = [
      [0, 0.2, 8.5],
      [0.6, 0.4, 9.6],
      [1, 0.3, 7],
      [-0.8, 0.6, 9],
      [0, 0.4, 9.4],
      [0.6, 0.3, 8.5],
      [0, 0, 7.6],
    ];
    const p = cameraPos[ch],
      q = cameraPos[next];
    state.cam.set(
      THREE.MathUtils.lerp(p[0], q[0], blend) + px,
      THREE.MathUtils.lerp(p[1], q[1], blend) + py,
      THREE.MathUtils.lerp(p[2], q[2], blend) + (mobile ? 2 : 0),
    );
    if (reduced) state.cam.set(0, 0.2, mobile ? 11 : 9);
    camera.position.lerp(state.cam, reduced ? 1 : damp);
    state.look.set(mobile ? 0 : -2.15, mobile ? 0.3 : 0, 0);
    camera.lookAt(state.look);
    if (core.current) {
      core.current.rotation.set(
        w.progress * 0.7 + py,
        w.progress * 4 + px,
        0.3 + w.progress,
      );
      const scales = [1, 0.35, 0.09, 0.15, 0.2, 0.08, 1.2];
      const target = THREE.MathUtils.lerp(scales[ch], scales[next], blend);
      core.current.scale.lerp(state.to.setScalar(target), reduced ? 1 : damp);
    }
    state.uniforms.phase.value = reduced
      ? 0
      : w.progress * 10 + state.time * 0.06;
    if (rings.current) {
      rings.current.rotation.set(
        0.7 + w.progress * 0.8 + py,
        0.25 + w.progress * 2 + px,
        0.2,
      );
      const sizes = [1, 1.2, 0.08, 0.22, 1.25, 0.15, 0.85];
      const scale = THREE.MathUtils.lerp(sizes[ch], sizes[next], blend);
      rings.current.scale.lerp(state.to.setScalar(scale), reduced ? 1 : damp);
    }
    // One instanced geometry per chapter object. Counts come from the CMS payload.
    const visibility = (chapter: number) =>
      ch === chapter ? 1 - blend : next === chapter ? blend : 0;
    for (let i = 0; i < 32; i++) {
      if (stations.current) {
        const visible = i < w.counts.experience ? visibility(2) : 0;
        state.dummy.position.set(
          Math.sin(i * 0.7) * 0.9,
          Math.cos(i * 0.65) * 0.45,
          -i * 2.1 + w.local * w.counts.experience * 2.1,
        );
        state.dummy.rotation.set(0, 0, i * 0.08);
        state.dummy.scale.setScalar(visible * 1.15);
        state.dummy.updateMatrix();
        stations.current.setMatrixAt(i, state.dummy.matrix);
      }
      if (panels.current) {
        const visible = i < w.counts.projects ? visibility(3) : 0;
        const a = (i - w.local * w.counts.projects) * 0.85;
        state.dummy.position.set(
          Math.sin(a) * 3.7,
          Math.sin(i) * 0.4,
          -Math.abs(i - w.local * w.counts.projects) * 1.7,
        );
        state.dummy.rotation.set(0.05, -a * 0.5, 0.06);
        state.dummy.scale.set(visible * 2.1, visible * 1.35, visible * 0.04);
        state.dummy.updateMatrix();
        panels.current.setMatrixAt(i, state.dummy.matrix);
      }
      if (milestones.current) {
        const visible = i < w.counts.achievements ? visibility(5) : 0;
        const a = (i - w.local * w.counts.achievements) * 1.5;
        state.dummy.position.set(Math.sin(a) * 2.4, 0.2, Math.cos(a) * 1.2 - 1);
        state.dummy.rotation.set(0.2, w.progress * 4 + i, 0.15);
        state.dummy.scale.set(visible * 0.65, visible * 1.1, visible * 0.65);
        state.dummy.updateMatrix();
        milestones.current.setMatrixAt(i, state.dummy.matrix);
      }
    }
    if (stations.current) {
      stations.current.instanceMatrix.needsUpdate = true;
      stations.current.count = Math.min(32, w.counts.experience);
      stations.current.visible = visibility(2) > 0.001;
    }
    if (panels.current) {
      panels.current.instanceMatrix.needsUpdate = true;
      panels.current.count = Math.min(32, w.counts.projects);
      panels.current.visible = visibility(3) > 0.001;
    }
    if (milestones.current) {
      milestones.current.instanceMatrix.needsUpdate = true;
      milestones.current.count = Math.min(32, w.counts.achievements);
      milestones.current.visible = visibility(5) > 0.001;
    }
    if (nodes.current) {
      for (let i = 0; i < count; i++) {
        destination(i, ch, w.local, state.from);
        destination(i, next, 0, state.to);
        state.from.lerp(state.to, blend);
        state.dummy.position.copy(state.from);
        state.dummy.rotation.set(
          i * 0.3 + w.progress,
          i * 0.2 + w.progress * 2,
          0,
        );
        const size =
          (i === w.hover ? 0.16 : i % 4 === 0 ? 0.095 : 0.035) *
          (mobile ? 0.8 : 1);
        state.dummy.scale.setScalar(size);
        state.dummy.updateMatrix();
        nodes.current.setMatrixAt(i, state.dummy.matrix);
        const j = i * 6;
        state.positions[j] = state.from.x;
        state.positions[j + 1] = state.from.y;
        state.positions[j + 2] = state.from.z;
        destination((i + 5) % count, ch, w.local, state.to);
        state.positions[j + 3] = state.to.x;
        state.positions[j + 4] = state.to.y;
        state.positions[j + 5] = state.to.z;
      }
      nodes.current.instanceMatrix.needsUpdate = true;
    }
    if (network.current) {
      network.current.geometry.attributes.position.needsUpdate = true;
      (network.current.material as THREE.LineBasicMaterial).opacity =
        ch === 1 || ch === 4 ? 0.2 : 0.065;
    }
    if (particles.current) {
      particles.current.rotation.y = w.progress * 0.3;
      particles.current.position.z = w.progress * 2;
    }
    if (keyLight.current) {
      keyLight.current.intensity = 12 + Math.sin(w.progress * Math.PI) * 8;
      keyLight.current.color.set(ch === 5 ? "#e3c3a0" : "#a4cfc6");
    }
    gl.domElement.dataset.chapter = String(ch);
    gl.domElement.dataset.progress = w.progress.toFixed(3);
  });
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight ref={keyLight} position={[3, 4, 4]} intensity={15} />
      <pointLight position={[-4, -2, 1]} intensity={12} color="#8497b0" />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={3} position={[0, 4, 3]} scale={[8, 2, 1]} />
        <Lightformer
          intensity={2}
          position={[-5, 0, 2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[3, 8, 1]}
        />
      </Environment>
      <group position={[0, 0.1, 0]}>
        <mesh ref={core}>
          <icosahedronGeometry args={[1.2, mobile ? 2 : 4]} />
          <shaderMaterial
            vertexShader={vertex}
            fragmentShader={fragment}
            uniforms={state.uniforms}
          />
        </mesh>
        <group ref={rings}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} rotation={[i * 0.85, 0.35 + i * 0.55, i * 0.4]}>
              <torusGeometry
                args={[
                  1.85 + i * 0.26,
                  i === 1 ? 0.085 : 0.032,
                  mobile ? 8 : 12,
                  mobile ? 64 : 120,
                ]}
              />
              <meshStandardMaterial
                color={i === 1 ? "#c7d9d5" : "#728b8c"}
                metalness={0.95}
                roughness={0.24}
              />
            </mesh>
          ))}
        </group>
        <instancedMesh ref={nodes} args={[undefined, undefined, count]}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#b6d7cb"
            metalness={0.6}
            roughness={0.2}
          />
        </instancedMesh>
        <lineSegments ref={network}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[state.positions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#789e9a" transparent opacity={0.15} />
        </lineSegments>
        <instancedMesh
          ref={stations}
          args={[undefined, undefined, 32]}
          frustumCulled={false}
        >
          <torusGeometry args={[1.7, 0.035, 8, mobile ? 40 : 70]} />
          <meshStandardMaterial
            color="#96b4ab"
            metalness={0.8}
            roughness={0.3}
          />
        </instancedMesh>
        <instancedMesh
          ref={panels}
          args={[undefined, undefined, 32]}
          frustumCulled={false}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#476465"
            metalness={0.7}
            roughness={0.28}
            transparent
            opacity={0.24}
            depthWrite={false}
          />
        </instancedMesh>
        <instancedMesh
          ref={milestones}
          args={[undefined, undefined, 32]}
          frustumCulled={false}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#c0ad8c"
            metalness={0.85}
            roughness={0.24}
          />
        </instancedMesh>
      </group>
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={mobile ? 0.025 : 0.018}
          color="#a5b9b6"
          transparent
          opacity={0.35}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <AdaptiveDpr pixelated />
    </>
  );
}
export default function Universe({
  mobile,
  reduced,
  onReady,
  onFailure,
}: {
  mobile: boolean;
  reduced: boolean;
  onReady: () => void;
  onFailure: () => void;
}) {
  const [degraded, setDegraded] = useState(false);
  return (
    <Canvas
      frameloop={reduced ? "demand" : "always"}
      dpr={degraded ? 0.85 : mobile ? 1 : 1.5}
      camera={{ position: [0, 0, 9], fov: 42, near: 0.1, far: 60 }}
      performance={{ min: 0.6 }}
      gl={{ alpha: true, antialias: !mobile, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", onFailure, {
          once: true,
        });
      }}
    >
      <PerformanceMonitor
        flipflops={1}
        onDecline={() => setDegraded(true)}
        onFallback={() => setDegraded(true)}
      />
      <World mobile={mobile} reduced={reduced} onReady={onReady} />
    </Canvas>
  );
}
