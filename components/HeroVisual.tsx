"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Vec3 = [number, number, number];
type Kind = "pain" | "tool" | "result";

type NodeDef = { id: number; kind: Kind; base: Vec3; size: number; phase: number; ring: boolean };

const PAIN_BASES: Vec3[] = [
  [-2.0, 1.05, -0.6],
  [-2.45, 0.1, 0.2],
  [-1.9, -0.9, -0.3],
  [-1.15, 1.35, 0.5],
  [-1.05, -1.3, 0.6],
  [-2.3, 0.75, 0.9]
];
const TOOL_BASES: Vec3[] = [
  [-0.45, 0.85, -0.2],
  [0.05, 0.15, 0.55],
  [-0.5, -0.75, 0.1],
  [0.35, 1.25, -0.7],
  [0.55, -1.05, -0.5],
  [-0.15, -0.15, -0.85]
];
const RESULT_BASES: Vec3[] = [
  [1.45, 0.85, 0.15],
  [1.65, -0.05, -0.35],
  [1.45, -0.95, 0.45]
];

// Связи «боль → инструмент» и «инструмент → результат» (индексы внутри своих групп).
const PAIN_TO_TOOLS: number[][] = [[0, 3], [1, 5], [2, 4], [0, 3], [2, 4], [1, 5]];
const TOOL_TO_RESULT: number[] = [0, 0, 1, 1, 2, 2];

const KIND_COLOR: Record<Kind, string> = { pain: "#ed4b36", tool: "#a8c93f", result: "#151714" };
const KIND_HOT: Record<Kind, string> = { pain: "#ff6f57", tool: "#c8ef55", result: "#3d3f39" };

function buildGraph() {
  const nodes: NodeDef[] = [
    ...PAIN_BASES.map((base, i) => ({ id: i, kind: "pain" as Kind, base, size: 0.16, phase: i * 1.7, ring: true })),
    ...TOOL_BASES.map((base, i) => ({ id: 6 + i, kind: "tool" as Kind, base, size: 0.14, phase: i * 2.3, ring: false })),
    ...RESULT_BASES.map((base, i) => ({ id: 12 + i, kind: "result" as Kind, base, size: 0.17, phase: i * 2.9, ring: true }))
  ];
  const adj = new Map<number, number[]>();
  const link = (a: number, b: number) => {
    adj.set(a, [...(adj.get(a) ?? []), b]);
    adj.set(b, [...(adj.get(b) ?? []), a]);
  };
  const edges: Array<[number, number, "pain" | "tool"]> = [];
  PAIN_TO_TOOLS.forEach((tools, pain) => {
    tools.forEach((tool) => {
      link(pain, 6 + tool);
      edges.push([pain, 6 + tool, "pain"]);
    });
  });
  TOOL_TO_RESULT.forEach((result, tool) => {
    link(6 + tool, 12 + result);
    edges.push([6 + tool, 12 + result, "tool"]);
  });
  return { nodes, adj, edges };
}

const { nodes, adj, edges } = buildGraph();

type Shared = { positions: THREE.Vector3[]; hovered: number | null };

function Node({ def, shared, setHovered }: { def: NodeDef; shared: Shared; setHovered: (id: number | null) => void }) {
  const mesh = useRef<THREE.Mesh>(null);
  const ringMesh = useRef<THREE.Mesh>(null);
  const isHot = shared.hovered === def.id;
  const isLinked = shared.hovered !== null && (adj.get(shared.hovered) ?? []).includes(def.id);
  const target = isHot ? 1.6 : isLinked ? 1.28 : 1;

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    // Мягкое «дыхание» узлов.
    const bob = 0.05 * Math.sin(t * 1.1 + def.phase);
    // Мировая позиция указателя и отталкивание узлов.
    const halfW = state.viewport.width / 2;
    const halfH = state.viewport.height / 2;
    const mx = state.pointer.x * halfW;
    const my = state.pointer.y * halfH;
    const dx = def.base[0] - mx;
    const dy = def.base[1] - my;
    const dist = Math.hypot(dx, dy);
    const radius = 1.05;
    const push = dist < radius ? ((radius - dist) / radius) * 0.4 : 0;
    const px = def.base[0] + (dist > 0.001 ? (dx / dist) * push : 0);
    const py = def.base[1] + bob + (dist > 0.001 ? (dy / dist) * push : 0);
    m.position.set(px, py, def.base[2] + 0.06 * Math.cos(t * 0.9 + def.phase));
    shared.positions[def.id].copy(m.position);
    const s = THREE.MathUtils.damp(m.scale.x, target, 8, delta);
    m.scale.setScalar(s);
    if (ringMesh.current) {
      ringMesh.current.rotation.x += delta * 0.5;
      ringMesh.current.rotation.y += delta * 0.35;
      ringMesh.current.scale.setScalar(s);
    }
  });

  const color = isHot ? KIND_HOT[def.kind] : KIND_COLOR[def.kind];
  const over = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(def.id);
  };
  const out = () => setHovered(null);

  return (
    <mesh ref={mesh} position={def.base} onPointerOver={over} onPointerOut={out}>
      <sphereGeometry args={[def.size, 24, 24]} />
      <meshBasicMaterial color={color} />
      {def.ring && (
        <mesh ref={ringMesh}>
          <torusGeometry args={[def.size * 1.7, 0.014, 8, 44]} />
          <meshBasicMaterial color={def.kind === "pain" ? "#ed4b36" : "#151714"} transparent opacity={isHot || isLinked ? 0.85 : 0.4} />
        </mesh>
      )}
    </mesh>
  );
}

function EdgeLines({ shared, hovered }: { shared: Shared; hovered: number | null }) {
  const normalRef = useRef<THREE.BufferGeometry>(null);
  const hotRef = useRef<THREE.BufferGeometry>(null);

  const { normalEdges, hotEdges } = useMemo(() => {
    if (hovered === null) return { normalEdges: edges, hotEdges: [] as typeof edges };
    const linked = adj.get(hovered) ?? [];
    const hot = edges.filter(([a, b]) => a === hovered || b === hovered || (linked.includes(a) && linked.includes(b) && (a === hovered || b === hovered)));
    const hotSet = new Set(hot);
    return { normalEdges: edges.filter((edge) => !hotSet.has(edge)), hotEdges: hot };
  }, [hovered]);

  useFrame(() => {
    const write = (geometry: THREE.BufferGeometry | null, list: typeof edges) => {
      if (!geometry) return;
      const array = geometry.getAttribute("position") as THREE.BufferAttribute;
      list.forEach(([a, b], i) => {
        const pa = shared.positions[a];
        const pb = shared.positions[b];
        array.setXYZ(i * 2, pa.x, pa.y, pa.z);
        array.setXYZ(i * 2 + 1, pb.x, pb.y, pb.z);
      });
      array.needsUpdate = true;
    };
    write(normalRef.current, normalEdges);
    write(hotRef.current, hotEdges);
  });

  return (
    <>
      <lineSegments key={`n-${normalEdges.length}`} frustumCulled={false}>
        <bufferGeometry ref={normalRef}>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(normalEdges.length * 6), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#151714" transparent opacity={0.3} />
      </lineSegments>
      {hotEdges.length > 0 && (
        <lineSegments key={`h-${hotEdges.length}`} frustumCulled={false}>
          <bufferGeometry ref={hotRef}>
            <bufferAttribute attach="attributes-position" args={[new Float32Array(hotEdges.length * 6), 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#7ba01a" transparent opacity={0.95} />
        </lineSegments>
      )}
    </>
  );
}

function Threads() {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < 900; i += 1) {
      const t = (i / 900) * Math.PI * 12;
      const r = 1.35 + 0.3 * Math.sin(5 * t) + 0.09 * Math.sin(13 * t);
      positions.push(r * Math.cos(t), 0.75 * Math.sin(3 * t), r * Math.sin(t));
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, []);
  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.05;
  });
  return <points ref={points} geometry={geometry}><pointsMaterial color="#b5ce51" size={0.02} sizeAttenuation transparent opacity={0.35} /></points>;
}

function Scene({ hovered, setHovered }: { hovered: number | null; setHovered: (id: number | null) => void }) {
  const group = useRef<THREE.Group>(null);
  const shared = useMemo<Shared>(() => ({ positions: nodes.map((n) => new THREE.Vector3(...n.base)), hovered: null }), []);
  shared.hovered = hovered;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    // Параллакс за курсором + медленный автообзор.
    const targetY = state.pointer.x * 0.4 + Math.sin(t * 0.12) * 0.12;
    const targetX = -state.pointer.y * 0.3 + Math.cos(t * 0.1) * 0.08;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 3.5, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 3.5, delta);
  });

  return (
    <group ref={group}>
      <Threads />
      <EdgeLines shared={shared} hovered={hovered} />
      {nodes.map((def) => <Node key={def.id} def={def} shared={shared} setHovered={setHovered} />)}
    </group>
  );
}

export default function HeroVisual() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (reduced) return null; // статичный CSS-fallback остаётся видимым

  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 44 }}
      dpr={[1, 1.6]}
      gl={{ alpha: true, antialias: true }}
      style={{ pointerEvents: "auto" }}
      onCreated={() => {
        const fallback = document.querySelector<HTMLElement>(".knotFallback");
        if (fallback) {
          fallback.style.transition = "opacity .8s ease";
          fallback.style.opacity = "0";
        }
      }}
    >
      <Scene hovered={hovered} setHovered={setHovered} />
    </Canvas>
  );
}
