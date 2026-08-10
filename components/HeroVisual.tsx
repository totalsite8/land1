"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Классический «студийный» эффект: облако частиц складывается в русские слова,
 * курсор их разгоняет, пружинная физика возвращает обратно на место.
 * Частицы — точки, сэмплированные с растеризованного текста; смена слова = смена «домов» частиц.
 */

const WORDS = [
  "ХАОС", "ТРАФИК", "ЛИДЫ", "ЗАЯВКИ", "КЛИЕНТЫ", "СДЕЛКИ", "ПРОДАЖИ", "ВЫРУЧКА",
  "КОНВЕРСИЯ", "ОХВАТ", "ВОРОНКА", "МАРЖА", "ПОТОК", "ПРОЦЕСС", "ПОРЯДОК", "ЯСНОСТЬ"
];
const WORD_TIME = 3.4;
const MAX_PARTICLES = 6500;
const INK = "#232620";
const HOT = "#ed4b36";
const LIME = "#86a51c";

type WordData = { homes: Float32Array; count: number };

function sampleWord(word: string): WordData {
  const width = 1280;
  const height = 400;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { homes: new Float32Array(0), count: 0 };

  let fontSize = 250;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `800 ${fontSize}px Manrope, Arial, sans-serif`;
  while (ctx.measureText(word).width > width - 80 && fontSize > 70) {
    fontSize -= 10;
    ctx.font = `800 ${fontSize}px Manrope, Arial, sans-serif`;
  }
  ctx.fillStyle = "#000";
  ctx.fillText(word, width / 2, height / 2);

  const pixels = ctx.getImageData(0, 0, width, height).data;
  const stepX = 4;
  const stepY = 4;
  const raw: number[] = [];
  for (let y = 0; y < height; y += stepY) {
    for (let x = 0; x < width; x += stepX) {
      if (pixels[(y * width + x) * 4 + 3] > 120) {
        // Поле уже и смещено вправо, чтобы не заходить на заголовок.
        raw.push((x - width / 2) / 295 + 0.55, -(y - height / 2) / 295, (Math.random() - 0.5) * 0.45);
      }
    }
  }
  const stride = Math.max(1, Math.ceil(raw.length / 3 / MAX_PARTICLES));
  const homes: number[] = [];
  for (let i = 0; i < raw.length; i += stride * 3) {
    homes.push(raw[i], raw[i + 1], raw[i + 2]);
  }
  return { homes: new Float32Array(homes), count: homes.length / 3 };
}

function ParticleWords() {
  const points = useRef<THREE.Points>(null);
  const wordIndex = useRef(0);
  const prevWordIndex = useRef(0);
  const lastSwitch = useRef(0);
  const sim = useRef<{ positions: Float32Array; velocities: Float32Array } | null>(null);

  const { words, geometry } = useMemo(() => {
    const sampled = WORDS.map(sampleWord);
    const maxCount = Math.max(...sampled.map((w) => w.count), 1);
    // Выравниваем слова до одинакового числа частиц: «лишние» стартуют из случайного хаоса.
    const wordsPadded = sampled.map((word) => {
      if (word.count === maxCount) return word.homes;
      const padded = new Float32Array(maxCount * 3);
      padded.set(word.homes);
      for (let i = word.count * 3; i < maxCount * 3; i += 3) {
        padded[i] = (Math.random() - 0.5) * 9;
        padded[i + 1] = (Math.random() - 0.5) * 5.5;
        padded[i + 2] = (Math.random() - 0.5) * 2.5;
      }
      return padded;
    });

    const positions = new Float32Array(maxCount * 3);
    const colors = new Float32Array(maxCount * 3);
    const velocities = new Float32Array(maxCount * 3);
    const colorInk = new THREE.Color(INK);
    const colorHot = new THREE.Color(HOT);
    const colorLime = new THREE.Color(LIME);
    for (let i = 0; i < maxCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      const roll = Math.random();
      const c = roll < 0.78 ? colorInk : roll < 0.9 ? colorHot : colorLime;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    sim.current = { positions, velocities };
    return { words: { list: wordsPadded, count: maxCount }, geometry: g };
  }, []);

  useFrame((state) => {
    const pts = points.current;
    const s = sim.current;
    if (!pts || !s) return;

    const t = state.clock.elapsedTime;
    if (t - lastSwitch.current > WORD_TIME) {
      lastSwitch.current = t;
      prevWordIndex.current = wordIndex.current;
      wordIndex.current = (wordIndex.current + 1) % words.list.length;
    }
    const current = words.list[wordIndex.current];
    const previous = words.list[prevWordIndex.current];
    // Плавный перелив слово→слово: цели частиц кроссфейдятся ~1.1 с.
    const morph = Math.min(1, (t - lastSwitch.current) / 1.1);
    const blend = morph * morph * (3 - 2 * morph);

    // Мировые координаты курсора на плоскости частиц.
    const halfW = state.viewport.width / 2;
    const halfH = state.viewport.height / 2;
    const mx = state.pointer.x * halfW;
    const my = state.pointer.y * halfH;

    const { positions, velocities } = s;
    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    // Шёлковая физика: слабая пружина, живой микродрейф каждой частицы
    // и широкое мягкое обтекание курсора с тангенциальной завивкой.
    const springK = 0.012;
    const friction = 0.94;
    const repelRadius = 1.8;
    const repelPower = 0.07;
    const swirlPower = 0.05;
    const driftAmp = 0.045;

    for (let i = 0; i < positions.length; i += 3) {
      let vx = velocities[i];
      let vy = velocities[i + 1];
      let vz = velocities[i + 2];
      const px = positions[i];
      const py = positions[i + 1];
      const pz = positions[i + 2];

      // Цель: переливающийся «дом» + собственное дыхание частицы.
      const phase = (i / 3) * 0.618;
      const homeX = previous[i] + (current[i] - previous[i]) * blend + Math.sin(t * 0.8 + phase) * driftAmp;
      const homeY = previous[i + 1] + (current[i + 1] - previous[i + 1]) * blend + Math.cos(t * 0.62 + phase * 1.31) * driftAmp;
      const homeZ = previous[i + 2] + (current[i + 2] - previous[i + 2]) * blend + Math.sin(t * 0.5 + phase * 0.73) * 0.03;

      vx += (homeX - px) * springK;
      vy += (homeY - py) * springK;
      vz += (homeZ - pz) * springK;

      const dx = px - mx;
      const dy = py - my;
      const dist = Math.hypot(dx, dy);
      if (dist < repelRadius && dist > 0.0001) {
        const t01 = 1 - dist / repelRadius;
        const ease = t01 * t01;
        const nx = dx / dist;
        const ny = dy / dist;
        vx += nx * ease * repelPower + (-ny) * ease * swirlPower;
        vy += ny * ease * repelPower + nx * ease * swirlPower;
      }

      vx *= friction;
      vy *= friction;
      vz *= friction;
      velocities[i] = vx;
      velocities[i + 1] = vy;
      velocities[i + 2] = vz;
      attr.setXYZ(i / 3, px + vx, py + vy, pz + vz);
    }
    attr.needsUpdate = true;

    // Едва заметный наклон всей фразы за курсором.
    pts.rotation.y = state.pointer.x * 0.06;
    pts.rotation.x = -state.pointer.y * 0.04;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial size={0.032} sizeAttenuation vertexColors transparent opacity={0.95} />
    </points>
  );
}

export default function HeroVisual() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (reduced) return null; // статичный CSS-fallback остаётся видимым

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
      onCreated={() => {
        const fallback = document.querySelector<HTMLElement>(".knotFallback");
        if (fallback) {
          fallback.style.transition = "opacity .8s ease";
          fallback.style.opacity = "0";
        }
      }}
    >
      <ParticleWords />
    </Canvas>
  );
}
