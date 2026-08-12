"use client";

import { useEffect, useRef } from "react";

/** Движущаяся лента слов: базовая скорость + ускорение от скролла, замедление при наведении. */
export default function Marquee({ words, tone = "hot" }: { words: readonly string[]; tone?: "hot" | "ink" }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner = innerRef.current;
    const wrap = wrapRef.current;
    if (!inner || !wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let speed = 0;
    let boost = 0;
    let slow = 0;
    let skew = 0;
    let lastY = window.scrollY;
    let raf = 0;
    let last = performance.now();

    const onEnter = () => { slow = 1; };
    const onLeave = () => { slow = 0; };
    wrap.addEventListener("pointerenter", onEnter);
    wrap.addEventListener("pointerleave", onLeave);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const y = window.scrollY;
      const dy = y - lastY;
      boost += (Math.min(Math.abs(dy) * 3.2, 260) - boost) * 0.08;
      lastY = y;
      const skewGoal = dy === 0 ? 0 : Math.sign(dy) * Math.min(Math.abs(dy) * 0.28, 3);
      skew += (skewGoal - skew) * 0.06;
      const base = 42 * (1 - slow * 0.82);
      speed += (base + boost - speed) * 0.1;
      x -= speed * dt;
      const half = inner.scrollWidth / 2;
      if (half > 0 && -x >= half) x += half;
      inner.style.transform = `translate3d(${x.toFixed(2)}px,0,0) skewX(${skew.toFixed(2)}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const row = (key: string) => (
    <span className="tapeRow" key={key} aria-hidden={key === "b" || undefined}>
      {words.map((word, index) => (
        <span className={index % 2 ? "em" : ""} key={`${key}-${word}`}>{word}<i>·</i></span>
      ))}
    </span>
  );

  return (
    <div className={`tape tape-${tone}`} ref={wrapRef}>
      <div className="tapeInner" ref={innerRef}>{row("a")}{row("b")}</div>
    </div>
  );
}
