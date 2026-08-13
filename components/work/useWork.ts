"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type WorkItem<T> = { id: string; data: T; createdAt: number; updatedAt: number };
export type WorkState = "loading" | "ok" | "missing" | "error";

/**
 * Доска рабочего пространства: загрузка, опрос каждые 15 секунд,
 * обновления через API. Одна ссылка — одна общая доска на команду.
 */
export default function useWork<T>(ws: string) {
  const [items, setItems] = useState<WorkItem<T>[]>([]);
  const [name, setName] = useState("");
  const [state, setState] = useState<WorkState>("loading");
  const busy = useRef(false);

  const load = useCallback(async (silent = false) => {
    if (busy.current) return;
    busy.current = true;
    try {
      const res = await fetch(`/api/w/${ws}`, { cache: "no-store" });
      if (res.status === 404) { setState("missing"); return; }
      if (!res.ok) throw new Error(`http ${res.status}`);
      const json = await res.json() as { workspace: { name: string }; items: WorkItem<T>[] };
      setItems(json.items);
      setName(json.workspace.name);
      setState("ok");
    } catch {
      if (!silent) setState("error");
    } finally {
      busy.current = false;
    }
  }, [ws]);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") void load(true); }, 15000);
    const onVis = () => { if (document.visibilityState === "visible") void load(true); };
    document.addEventListener("visibilitychange", onVis);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", onVis); };
  }, [load]);

  const create = useCallback(async (data: T) => {
    try {
      const res = await fetch(`/api/w/${ws}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data })
      });
      if (!res.ok) return false;
      await load(true);
      return true;
    } catch { return false; }
  }, [ws, load]);

  const patch = useCallback(async (id: string, data: T) => {
    try {
      const res = await fetch(`/api/w/${ws}/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data })
      });
      if (!res.ok) return false;
      await load(true);
      return true;
    } catch { return false; }
  }, [ws, load]);

  const remove = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/w/${ws}/items/${id}`, { method: "DELETE" });
      if (!res.ok) return false;
      await load(true);
      return true;
    } catch { return false; }
  }, [ws, load]);

  return { items, name, state, create, patch, remove, reload: load };
}
