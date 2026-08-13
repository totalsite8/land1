"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import type { WorkState } from "./useWork";

/** Состояния доски рабочей версии: загрузка / нет такой комнаты / ошибка связи. */
export function WorkStateBox({ state, onRetry }: { state: WorkState; onRetry: () => void }) {
  if (state === "ok") return null;
  if (state === "loading") return <div className="demoEmpty">Загружаем доску пространства…</div>;
  if (state === "missing") return (
    <div className="demoEmpty">
      Такой комнаты нет — ссылка либо с опечаткой, либо пространство не создавалось.<br />
      Создайте новое со страницы демо-инструмента или проверьте адрес.
    </div>
  );
  return (
    <div className="demoEmpty">
      Не связались с сервером.<br />
      <button type="button" className="demoGhostBtn" style={{ marginTop: 12 }} onClick={onRetry}><RotateCcw size={13} /> Попробовать снова</button>
    </div>
  );
}

/**
 * Двухшаговое удаление без потерь: первый клик вооружает кнопку («Удалить?»),
 * второй — действительно удаляет; через 4 секунды кнопка сама остывает.
 * Работает и в общих досках, и в демо: случайный клик больше не стирает запись.
 */
export function ConfirmKill({ onKill, label, disabled }: { onKill: () => void; label: string; disabled?: boolean }) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);
  function click() {
    if (armed) {
      if (timer.current) window.clearTimeout(timer.current);
      setArmed(false);
      onKill();
      return;
    }
    setArmed(true);
    timer.current = window.setTimeout(() => setArmed(false), 4000);
  }
  return (
    <button
      type="button"
      className={`demoKill${armed ? " armed" : ""}`}
      onClick={click}
      disabled={disabled}
      aria-label={armed ? "Нажмите ещё раз для подтверждения удаления" : label}
    >
      {armed ? "Удалить?" : <Trash2 size={14} />}
    </button>
  );
}

/** Отметка свежести общей доски: время последней удачной сверки с сервером. */
export function SyncMark({ ts }: { ts: number | null }) {
  if (!ts) return <span>обновление каждые 15 сек</span>;
  return (
    <span>
      проверено {new Date(ts).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} · каждые 15 сек
    </span>
  );
}
