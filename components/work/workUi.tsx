"use client";

import { RotateCcw } from "lucide-react";
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
