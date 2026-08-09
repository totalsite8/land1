"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Knot() {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < 1100; i += 1) {
      const t = (i / 1100) * Math.PI * 12;
      const r = 1.15 + 0.26 * Math.sin(5 * t) + 0.08 * Math.sin(13 * t);
      positions.push(r * Math.cos(t), 0.68 * Math.sin(3 * t), r * Math.sin(t));
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.16;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.16) * 0.18;
  });

  return <points ref={points} geometry={geometry}><pointsMaterial color="#e7ff7b" size={0.024} sizeAttenuation transparent opacity={0.92} /></points>;
}

export default function HeroVisual() {
  return <Canvas camera={{ position: [0, 0, 4.3], fov: 46 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
    <Knot />
  </Canvas>;
}
