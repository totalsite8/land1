"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * «Студийный» hero: центральный глянцевый узел, вокруг — клубок хаотичных нитей (боли),
 * справа — ровные линии с бегущими пакетами (распутанные процессы).
 * Камера параллаксит за курсором, ноды реагируют на hover, пыль отталкивается от указателя.
 */

type Vec3 = [number, number, number];

const NODES_LEFT: Vec3[] = [
  [-2.15, 0.95, 0.35],
  [-2.55, -0.15, 0.6],
  [-1.95, -1.0, 0.1]
];
const NODES_RIGHT: Vec3[] = [
  [2.45, 1.25, -0.2],
  [2.7, 0.65, 0.25],
  [2.6, 0.0, -0.45],
  [2.75, -0.65, 0.35],
  [2.5, -1.25, -0.1]
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Клубок хаотичных нитей вокруг узла (боли). */
function ChaosThreads() {
  const group = useRef<THREE.Group>(null);
  const tubes = useMemo(() => {
    const rand = seededRandom(42);
    const list: { geometry: THREE.TubeGeometry; color: string; opacity: number; spin: Vec3 }[] = [];
    for (let i = 0; i < 26; i += 1) {
      const points: THREE.Vector3[] = [];
      const shell = 1.35 + rand() * 0.55;
      const tilt = rand() * Math.PI;
      for (let j = 0; j < 6; j += 1) {
        const a = (j / 6) * Math.PI * 2;
        const wobble = 0.55 + rand() * 0.75;
        points.push(new THREE.Vector3(
          Math.cos(a) * shell * wobble - 0.35,
          Math.sin(a + tilt) * shell * 0.55 * wobble,
          Math.sin(a) * shell * 0.6 * wobble
        ));
      }
      const curve = new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.9);
      const geometry = new THREE.TubeGeometry(curve, 72, 0.014 + rand() * 0.008, 6, true);
      list.push({ geometry, color: i % 5 === 0 ? "#151714" : "#ed4b36", opacity: i % 5 === 0 ? 0.5 : 0.62, spin: [(rand() - 0.5) * 0.3, (rand() - 0.5) * 0.3, (rand() - 0.5) * 0.3] });
    }
    return list;
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.rotation.y += delta * 0.07;
    g.rotation.x = Math.sin(t * 0.14) * 0.1;
    tubes.forEach((tube, i) => {
      const child = g.children[i];
      if (child) {
        child.rotation.x += delta * tube.spin[0];
        child.rotation.y += delta * tube.spin[1];
      }
    });
  });

  return (
    <group ref={group}>
      {tubes.map((tube, i) => (
        <mesh key={i} geometry={tube.geometry}>
          <meshBasicMaterial color={tube.color} transparent opacity={tube.opacity} />
        </mesh>
      ))}
    </group>
  );
}

/** Центральная скульптура — узел. */
function KnotBody() {
  const mesh = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.TorusKnotGeometry(1.02, 0.3, 260, 32), []);
  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * 0.16;
    mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.11) * 0.14;
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.012;
    mesh.current.scale.setScalar(breathe);
  });
  return (
    <mesh ref={mesh} geometry={geometry}>
      <meshPhysicalMaterial color="#151714" roughness={0.28} metalness={0.15} clearcoat={0.6} clearcoatRoughness={0.35} />
    </mesh>
  );
}

/** Ровные линии «распутанных процессов» + бегущие по ним пакеты. */
function OrderLines() {
  const packets = useRef<(THREE.Mesh | null)[]>([]);
  const lines = useMemo(() => {
    return NODES_RIGHT.map((end, i) => {
      const start: Vec3 = [0.55 + (i % 3) * 0.12, end[1] * 0.28, end[2] * 0.3];
      const curve = new THREE.LineCurve3(new THREE.Vector3(...start), new THREE.Vector3(end[0] - 0.22, end[1], end[2]));
      return { geometry: new THREE.TubeGeometry(curve, 1, 0.013, 6), curve, offset: i / NODES_RIGHT.length, speed: 0.22 + (i % 3) * 0.05 };
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    lines.forEach((line, i) => {
      const p = packets.current[i];
      if (!p) return;
      const u = (t * line.speed + line.offset) % 1;
      const pos = line.curve.getPoint(u);
      p.position.copy(pos);
      const fade = u < 0.12 ? u / 0.12 : u > 0.9 ? (1 - u) / 0.1 : 1;
      p.scale.setScalar(0.45 + fade * 0.55);
    });
  });

  return (
    <group>
      {lines.map((line, i) => (
        <mesh key={`l${i}`} geometry={line.geometry}>
          <meshBasicMaterial color="#7ba01a" transparent opacity={0.75} />
        </mesh>
      ))}
      {lines.map((_, i) => (
        <mesh key={`p${i}`} ref={(el) => { packets.current[i] = el; }}>
          <sphereGeometry args={[0.05, 14, 14]} />
          <meshBasicMaterial color="#c8ef55" />
        </mesh>
      ))}
    </group>
  );
}

/** Красные орбитальные «остатки боли» вокруг узла. */
function PainOrbiters() {
  const items = useRef<(THREE.Mesh | null)[]>([]);
  const orbits = useMemo(() => {
    const rand = seededRandom(7);
    return Array.from({ length: 6 }, () => ({
      radius: 1.55 + rand() * 0.75,
      tilt: rand() * Math.PI,
      speed: 0.35 + rand() * 0.4,
      offset: rand() * Math.PI * 2,
      size: 0.035 + rand() * 0.025
    }));
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    orbits.forEach((orbit, i) => {
      const m = items.current[i];
      if (!m) return;
      const a = t * orbit.speed + orbit.offset;
      m.position.set(
        Math.cos(a) * orbit.radius - 0.3,
        Math.sin(a) * orbit.radius * 0.45 * Math.cos(orbit.tilt),
        Math.sin(a) * orbit.radius * Math.sin(orbit.tilt)
      );
    });
  });
  return (
    <group>
      {orbits.map((orbit, i) => (
        <mesh key={i} ref={(el) => { items.current[i] = el; }}>
          <sphereGeometry args={[orbit.size, 12, 12]} />
          <meshBasicMaterial color="#ed4b36" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/** Реактивная пыль: расступается от указателя. */
function Dust() {
  const points = useRef<THREE.Points>(null);
  const { base, geometry } = useMemo(() => {
    const rand = seededRandom(99);
    const count = 620;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (rand() - 0.5) * 7.5;
      positions[i * 3 + 1] = (rand() - 0.5) * 5;
      positions[i * 3 + 2] = (rand() - 0.5) * 3 - 0.4;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions.slice(), 3));
    return { base: positions, geometry: g };
  }, []);

  useFrame((state) => {
    const pts = points.current;
    if (!pts) return;
    const t = state.clock.elapsedTime;
    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const halfW = state.viewport.width / 2;
    const halfH = state.viewport.height / 2;
    const mx = state.pointer.x * halfW;
    const my = state.pointer.y * halfH;
    for (let i = 0; i < attr.count; i += 1) {
      const bx = base[i * 3];
      const by = base[i * 3 + 1] + Math.sin(t * 0.35 + i * 0.7) * 0.05;
      const dx = bx - mx;
      const dy = by - my;
      const dist = Math.hypot(dx, dy);
      const radius = 1.1;
      const push = dist < radius && dist > 0.001 ? ((radius - dist) / radius) * 0.42 : 0;
      attr.setXYZ(i, bx + (dx / (dist || 1)) * push, by + (dy / (dist || 1)) * push, base[i * 3 + 2]);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial color="#8a887f" size={0.022} sizeAttenuation transparent opacity={0.55} />
    </points>
  );
}

/** Интерактивные глянцевые ноды. */
function GlossNode({ position, color, hovered, onHover }: { position: Vec3; color: string; hovered: boolean; onHover: (h: boolean) => void }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!mesh.current) return;
    const target = hovered ? 1.5 : 1 + Math.sin(state.clock.elapsedTime * 1.3 + position[0]) * 0.04;
    const s = THREE.MathUtils.damp(mesh.current.scale.x, target, 9, delta);
    mesh.current.scale.setScalar(s);
  });
  return (
    <mesh
      ref={mesh}
      position={position}
      onPointerOver={(event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); onHover(true); }}
      onPointerOut={() => onHover(false)}
    >
      <sphereGeometry args={[color === "#ed4b36" ? 0.085 : 0.1, 28, 28]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.18}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.15}
        emissive={color}
        emissiveIntensity={hovered ? 0.55 : 0.12}
      />
    </mesh>
  );
}

/** Камера параллаксит за любым движением мыши; вся сцена плавно доворачивается. */
function Rig() {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();
  useFrame((state, delta) => {
    camera.position.x = THREE.MathUtils.damp(camera.position.x, state.pointer.x * 0.85, 2.6, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, state.pointer.y * 0.55, 2.6, delta);
    camera.lookAt(0.2, 0, 0);
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, state.pointer.x * 0.22, 2.4, delta);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -state.pointer.y * 0.14, 2.4, delta);
    }
  });
  return (
    <group ref={group}>
      <KnotBody />
      <ChaosThreads />
      <OrderLines />
      <PainOrbiters />
      <Dust />
    </group>
  );
}

function Scene({ hovered, setHovered }: { hovered: string | null; setHovered: (id: string | null) => void }) {
  return (
    <>
      <hemisphereLight args={["#f4f1e9", "#c9c2b2", 0.75]} />
      <directionalLight position={[4.5, 6, 8]} intensity={1.5} />
      <directionalLight position={[-4, -2, 3]} intensity={0.5} />
      <pointLight position={[3, 0.4, 1.6]} intensity={14} distance={7} color="#d9ff5a" />
      <pointLight position={[-3.4, 0.4, 1.2]} intensity={10} distance={6} color="#ed4b36" />
      <Rig />
      {NODES_LEFT.map((pos, i) => (
        <GlossNode key={`L${i}`} position={pos} color="#ed4b36" hovered={hovered === `L${i}`} onHover={(h) => setHovered(h ? `L${i}` : null)} />
      ))}
      {NODES_RIGHT.map((pos, i) => (
        <GlossNode key={`R${i}`} position={pos} color="#d9ff5a" hovered={hovered === `R${i}`} onHover={(h) => setHovered(h ? `R${i}` : null)} />
      ))}
    </>
  );
}

export default function HeroVisual() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (reduced) return null; // статичный CSS-fallback остаётся видимым

  return (
    <Canvas
      camera={{ position: [0, 0, 5.4], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
      onCreated={() => {
        const fallback = document.querySelector<HTMLElement>(".knotFallback");
        if (fallback) {
          fallback.style.transition = "opacity .8s ease";
          fallback.style.opacity = "0";
        }
      }}
      onPointerMissed={() => setHovered(null)}
    >
      <Scene hovered={hovered} setHovered={setHovered} />
    </Canvas>
  );
}
