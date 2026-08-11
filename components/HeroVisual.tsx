"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Классический «студийный» эффект: облако частиц складывается в русские слова,
 * курсор мягко расталкивает их (только на устройствах с настоящим hover),
 * пружинная физика возвращает обратно на место.
 * Частицы — точки, сэмплированные с растеризованного текста; смена слова = смена «домов» частиц.
 */

const WORDS = [
  "ХАОС", "ТРАФИК", "ЛИДЫ", "ЗАЯВКИ", "КЛИЕНТЫ", "СДЕЛКИ", "ПРОДАЖИ", "ВЫРУЧКА",
  "КОНВЕРСИЯ", "ОХВАТ", "ВОРОНКА", "МАРЖА", "ПОТОК", "ПРОЦЕСС", "ПОРЯДОК", "ЯСНОСТЬ"
];
const WORD_TIME = 3.4;
const MAX_PARTICLES = 12000;
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
  const stepX = 3;
  const stepY = 3;
  const raw: number[] = [];
  for (let y = 0; y < height; y += stepY) {
    for (let x = 0; x < width; x += stepX) {
      if (pixels[(y * width + x) * 4 + 3] > 120) {
        raw.push((x - width / 2) / 280, -(y - height / 2) / 280, (Math.random() - 0.5) * 0.45);
      }
    }
  }
  const stride = Math.max(1, Math.ceil(raw.length / 3 / MAX_PARTICLES));
  const homes: number[] = [];
  for (let i = 0; i < raw.length; i += stride * 3) {
    homes.push(raw[i], raw[i + 1], raw[i + 2]);
  }
  // Авто-вписывание: слово никогда не выходит за боковые рамки видимой зоны.
  let maxAbsX = 0.0001;
  for (let i = 0; i < homes.length; i += 3) maxAbsX = Math.max(maxAbsX, Math.abs(homes[i]));
  const fit = Math.min(1, 1.85 / maxAbsX);
  const out = new Float32Array(homes.length);
  for (let i = 0; i < homes.length; i += 3) {
    out[i] = homes[i] * fit + 0.3;
    out[i + 1] = homes[i + 1];
    out[i + 2] = homes[i + 2];
  }
  return { homes: out, count: homes.length / 3 };
}

function ParticleWords({ hoverEnabled, centered }: { hoverEnabled: boolean; centered: boolean }) {
  const points = useRef<THREE.Points>(null);
  const wordIndex = useRef(0);
  const prevWordIndex = useRef(0);
  const lastSwitch = useRef(0);
  const sim = useRef<{ positions: Float32Array; velocities: Float32Array } | null>(null);
  // Жёсткая привязка к курсору мыши: state.pointer у r3f обновляется, только когда
  // курсор над canvas, а до первого события он в (0,0) — центре слов. Поэтому
  // позицию берём сами: window pointermove → client-координаты → координаты мира.
  // Пока мышь ни разу не двигалась, зоны влияния не существует вовсе.
  const rawClient = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const onMove = (e: PointerEvent) => { rawClient.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // На узких экранах контейнер — узкая «строка слов»: камера придвигается,
  // чтобы слово заполняло её по высоте без пустых полей сверху и снизу.
  // Именно придвигаем (а не zoom): точки растут вместе с буквами. На десктопе — как было.
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    camera.position.z = centered ? 2.4 : 6;
  }, [camera, centered]);

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

    // Мировые координаты реального курсора на плоскости частиц.
    // Пересчёт идёт из client-координат через rect canvas: зона влияния всегда ровно
    // там, где курсор сейчас — а когда курсор далеко от блока слов, она далеко и от частиц.
    const halfW = state.viewport.width / 2;
    const halfH = state.viewport.height / 2;
    let mx = 0;
    let my = 0;
    let pointerActive = false;
    if (rawClient.current) {
      const rect = state.gl.domElement.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const nx = ((rawClient.current.x - rect.left) / rect.width) * 2 - 1;
        const ny = -(((rawClient.current.y - rect.top) / rect.height) * 2 - 1);
        mx = nx * halfW;
        my = ny * halfH;
        pointerActive = true;
      }
    }

    const { positions, velocities } = s;
    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    // Мягкая, «плавающая» физика: слабая пружина, собственное дыхание каждой частицы.
    // Под курсором — крошечная зона, где частицы лишь слегка, плавно расступаются.
    const springK = 0.012;
    const friction = 0.93;
    const partRadius = 0.55;   // маленький радиус: влияние только в точке курсора
    const partPower = 0.0021;  // очень слабый толчок: расступание едва заметно
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

      // Расступание под курсором — только где есть настоящий hover (мышь/трекпад)
      // и только когда известна честная позиция курсора (была хоть одна pointermove).
      if (hoverEnabled && pointerActive) {
        const dx = px - mx;
        const dy = py - my;
        const dist = Math.hypot(dx, dy);
        if (dist < partRadius && dist > 0.0001) {
          const t01 = 1 - dist / partRadius;
          // Smoothstep-затухание без краёв: мягкий максимум в точке курсора,
          // к границе радиуса сила плавно сходит на ноль вместе с производной.
          const ease = t01 * t01 * (3 - 2 * t01);
          const push = ease * partPower;
          vx += (dx / dist) * push; // чистое расступание в стороны, в плоскости слова
          vy += (dy / dist) * push;
        }
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

    // Едва заметный наклон всей фразы за курсором — тоже только при наличии hover.
    if (hoverEnabled) {
      pts.rotation.y = state.pointer.x * 0.06;
      pts.rotation.x = -state.pointer.y * 0.04;
    } else {
      pts.rotation.y = 0;
      pts.rotation.x = 0;
    }
    // На узких экранах блок стоит в потоке под заголовком:
    // убираем десктопный сдвиг слова +0.3, чтобы оно было по центру.
    pts.position.x = centered ? -0.3 : 0;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial size={0.021} sizeAttenuation vertexColors transparent opacity={0.95} />
    </points>
  );
}

export default function HeroVisual() {
  // Компонент рендерится только на клиенте (ssr: false) — window доступен сразу.
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [hoverEnabled, setHoverEnabled] = useState(
    () => !window.matchMedia("(hover: none)").matches
  );
  const [centered, setCentered] = useState(
    () => window.matchMedia("(max-width: 780px)").matches
  );

  useEffect(() => {
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqHover = window.matchMedia("(hover: none)");
    const mqNarrow = window.matchMedia("(max-width: 780px)");
    const sync = () => {
      setReduced(mqReduced.matches);
      setHoverEnabled(!mqHover.matches);
      setCentered(mqNarrow.matches);
    };
    mqReduced.addEventListener("change", sync);
    mqHover.addEventListener("change", sync);
    mqNarrow.addEventListener("change", sync);
    return () => {
      mqReduced.removeEventListener("change", sync);
      mqHover.removeEventListener("change", sync);
      mqNarrow.removeEventListener("change", sync);
    };
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
      <ParticleWords hoverEnabled={hoverEnabled} centered={centered} />
    </Canvas>
  );
}
