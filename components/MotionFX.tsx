"use client";

import { useEffect } from "react";

/**
 * Живые фоны и отклики (без кастомного курсора):
 * прогресс-бар скролла, дрейф размытого фона «Диагноза», сдвиг арт-фонов карточек,
 * дрейф аврор в цветных секциях, магнитные кнопки [data-mag], tilt .caseFlow,
 * параллакс заголовков [data-plx]. Тяжёлое — только на мыши; при reduced-motion всё выключено.
 */
export default function MotionFX() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    /* прогресс-бар чтения */
    const bar = document.createElement("div");
    bar.className = "fxProgress";
    document.body.append(bar);

    let mx = window.innerWidth / 2, my = window.innerHeight / 2, smx = 0.5, smy = 0.5;
    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    /* магнитные кнопки + tilt — только при мыши */
    const magHandlers: { el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }[] = [];
    const tiltHandlers: { el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }[] = [];
    const plx: { el: HTMLElement; sp: number; y: number }[] = [];
    if (fine) {
      document.querySelectorAll<HTMLElement>("[data-mag]").forEach((el) => {
        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          el.style.transform = `translate(${((e.clientX - (r.left + r.width / 2)) * 0.28).toFixed(1)}px, ${((e.clientY - (r.top + r.height / 2)) * 0.32).toFixed(1)}px)`;
        };
        const leave = () => { el.style.transform = ""; };
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", leave);
        magHandlers.push({ el, move, leave });
      });
      document.querySelectorAll<HTMLElement>(".caseFlow").forEach((el) => {
        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = `perspective(900px) rotateX(${(-ny * 4).toFixed(2)}deg) rotateY(${(nx * 5).toFixed(2)}deg) translateY(-3px)`;
        };
        const leave = () => { el.style.transform = ""; };
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", leave);
        tiltHandlers.push({ el, move, leave });
      });
      document.querySelectorAll<HTMLElement>("[data-plx]").forEach((el) => {
        plx.push({ el, sp: parseFloat(el.dataset.plx || "0.06"), y: 0 });
      });
    }

    /* фоны: диагноз, арт-карточки, авроры */
    const diagBg = document.querySelector<HTMLElement>(".secBg");
    const artBgs = Array.from(document.querySelectorAll<HTMLElement>(".solutionBg"));
    const auroras = Array.from(document.querySelectorAll<HTMLElement>(".au")).map((el, i) => ({ el, i, bx: 0, by: 0 }));

    let raf = 0, prog = 0;
    const loop = (now: number) => {
      const t = now * 0.001;
      smx += (mx / window.innerWidth - smx) * 0.06;
      smy += (my / window.innerHeight - smy) * 0.06;

      const max = document.documentElement.scrollHeight - window.innerHeight;
      prog += ((max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0) - prog) * 0.12;
      bar.style.transform = `scaleX(${prog.toFixed(4)})`;

      if (diagBg) {
        const dx = (smx - 0.5) * 26 + Math.sin(t * 0.22) * 10;
        const dy = (smy - 0.5) * 18 + Math.cos(t * 0.18) * 8;
        diagBg.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      }
      for (const s of artBgs) {
        s.style.transform = `translate3d(${((smx - 0.5) * -18).toFixed(1)}px, ${((smy - 0.5) * -12).toFixed(1)}px, 0) scale(1.2)`;
      }
      for (const a of auroras) {
        const f = a.i + 1;
        a.bx += (Math.sin(t * 0.16 + f * 1.7) * 34 + (smx - 0.5) * 26 * f - a.bx) * 0.05;
        a.by += (Math.cos(t * 0.13 + f * 1.3) * 28 + (smy - 0.5) * 20 * f - a.by) * 0.05;
        a.el.style.transform = `translate3d(${a.bx.toFixed(1)}px, ${a.by.toFixed(1)}px, 0)`;
      }
      for (const p of plx) {
        const r = p.el.getBoundingClientRect();
        if (r.bottom < -80 || r.top > window.innerHeight + 80) continue;
        const target = Math.max(-56, Math.min(56, (window.innerHeight / 2 - (r.top + r.height / 2)) * p.sp * -1));
        p.y += (target - p.y) * 0.08;
        p.el.style.transform = `translate3d(0, ${p.y.toFixed(2)}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      if (fine) window.removeEventListener("pointermove", onMove);
      magHandlers.forEach(({ el, move, leave }) => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); el.style.transform = ""; });
      tiltHandlers.forEach(({ el, move, leave }) => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); el.style.transform = ""; });
      plx.forEach((p) => { p.el.style.transform = ""; });
      bar.remove();
    };
  }, []);

  return null;
}
