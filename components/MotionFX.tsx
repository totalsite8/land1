"use client";

import { useEffect } from "react";

/**
 * Единый rAF-цикл эффектов уровня «всё откликается»:
 * кастомный курсор (dot + лерпированное кольцо), магнитные кнопки [data-mag],
 * параллакс заголовков [data-plx], плавающее превью-фото у строк [data-preview],
 * tilt-наклон карточек .caseFlow. Только для мыши (hover:hover) и без reduced-motion.
 */
export default function MotionFX() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;

    /* ---- курсор и плавающее превью ---- */
    const dot = document.createElement("div"); dot.className = "fxDot";
    const ring = document.createElement("div"); ring.className = "fxRing";
    const peek = document.createElement("img"); peek.className = "hoverPeek"; peek.alt = "";
    document.body.append(dot, ring, peek);

    let mx = window.innerWidth / 2, my = -100, rx = mx, ry = my, dx = mx, dy = my;
    let grow = 0, growT = 0;
    let px = 0, py = 0, ptx = 0, pty = 0, pop = 0, popT = 0, rot = 0, rotT = 0, lastMx = mx;
    let seen = false;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX; my = e.clientY;
      if (!seen) { seen = true; rx = dx = mx; ry = dy = my; px = ptx = mx; py = pty = my; dot.style.opacity = "1"; ring.style.opacity = ".6"; }
      const hit = (e.target as HTMLElement).closest?.("a,button,summary,select,label,[data-mag]");
      growT = hit ? 1 : 0;
      const row = (e.target as HTMLElement).closest?.("[data-preview]") as HTMLElement | null;
      if (row) {
        const src = row.dataset.preview!;
        if (peek.dataset.cur !== src) { peek.src = src; peek.dataset.cur = src; }
        popT = 1;
      } else if (popT === 1) popT = 0;
    };
    const onLeaveWin = () => { dot.style.opacity = "0"; ring.style.opacity = "0"; popT = 0; };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWin);

    /* ---- предзагрузка превью ---- */
    document.querySelectorAll<HTMLElement>("[data-preview]").forEach((el) => {
      const src = el.dataset.preview;
      if (src) { const im = new Image(); im.src = src; }
    });

    /* ---- магнитные элементы ---- */
    const magnetics = Array.from(document.querySelectorAll<HTMLElement>("[data-mag]"));
    const magHandlers = magnetics.map((el) => {
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const ddx = e.clientX - (r.left + r.width / 2);
        const ddy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${(ddx * 0.28).toFixed(1)}px, ${(ddy * 0.32).toFixed(1)}px)`;
      };
      const leave = () => { el.style.transform = ""; };
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      return { el, move, leave };
    });

    /* ---- параллакс ---- */
    const plx = Array.from(document.querySelectorAll<HTMLElement>("[data-plx]")).map((el) => ({
      el, sp: parseFloat(el.dataset.plx || "0.06"), y: 0
    }));

    /* ---- tilt карточек схем ---- */
    const tilts = Array.from(document.querySelectorAll<HTMLElement>(".caseFlow"));
    const tiltHandlers = tilts.map((el) => {
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-ny * 4).toFixed(2)}deg) rotateY(${(nx * 5).toFixed(2)}deg) translateY(-3px)`;
      };
      const leave = () => { el.style.transform = ""; };
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      return { el, move, leave };
    });

    let raf = 0;
    const loop = () => {
      /* курсор */
      dx += (mx - dx) * 0.5; dy += (my - dy) * 0.5;
      rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
      grow += (growT - grow) * 0.16;
      dot.style.transform = `translate3d(${(dx - 3).toFixed(1)}px, ${(dy - 3).toFixed(1)}px, 0)`;
      ring.style.transform = `translate3d(${(rx - 19).toFixed(1)}px, ${(ry - 19).toFixed(1)}px, 0) scale(${(1 + grow * 0.7).toFixed(3)})`;
      ring.style.borderColor = grow > 0.4 ? "rgba(237,75,54,.9)" : "rgba(255,255,255,.9)";

      /* плавающее превью */
      rotT = Math.max(-10, Math.min(10, (mx - lastMx) * 0.45)); lastMx = mx;
      rot += (rotT - rot) * 0.12;
      ptx = mx; pty = my;
      px += (ptx - px) * 0.12; py += (pty - py) * 0.12;
      pop += (popT - pop) * 0.14;
      peek.style.opacity = pop.toFixed(3);
      peek.style.transform = `translate3d(${(px + 26).toFixed(1)}px, ${(py - 110).toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${(0.6 + pop * 0.4).toFixed(3)})`;

      /* параллакс заголовков */
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
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeaveWin);
      magHandlers.forEach(({ el, move, leave }) => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); el.style.transform = ""; });
      tiltHandlers.forEach(({ el, move, leave }) => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); el.style.transform = ""; });
      plx.forEach((p) => { p.el.style.transform = ""; });
      dot.remove(); ring.remove(); peek.remove();
    };
  }, []);

  return null;
}
