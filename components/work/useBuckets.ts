"use client";

import useWork from "./useWork";

/**
 * Доступ к записям пространства по «корзинам»: у каждой записи в data.b лежит
 * имя корзины ("row", "lead", "comp", "change", "idea"), настройки доски —
 * корзина "meta" (одна запись). Один хук = один опрос сервера на компонент.
 */
export type Envelope = Record<string, unknown> & { b?: string };
export type BucketItem<T> = { id: string; data: T };

export default function useBuckets(ws: string) {
  const work = useWork<Envelope>(ws);

  function bucket<T>(name: string): BucketItem<T>[] {
    return work.items
      .filter((item) => item.data && item.data.b === name)
      .map((item) => ({ id: item.id, data: item.data as unknown as T }));
  }

  function add<T extends Record<string, unknown>>(name: string, payload: T) {
    return work.create({ b: name, ...payload });
  }

  function update<T extends Record<string, unknown>>(id: string, name: string, payload: T) {
    return work.patch(id, { b: name, ...payload });
  }

  function metaItem(): { id: string; v: unknown } | null {
    const found = work.items.find((item) => item.data && item.data.b === "meta");
    return found ? { id: found.id, v: (found.data as { v?: unknown }).v } : null;
  }

  /** Настройки доски: одна meta-запись на пространство (создаётся сидингом). */
  function setMeta(v: unknown) {
    const found = metaItem();
    return found ? work.patch(found.id, { b: "meta", v }) : work.create({ b: "meta", v });
  }

  return {
    state: work.state,
    reload: work.reload,
    remove: work.remove,
    bucket,
    add,
    update,
    metaItem,
    setMeta
  };
}
