import { NextResponse } from "next/server";
import { deleteItem, isValidWs, StoreUnavailable, updateItem } from "../../../../../../lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ ws: string; id: string }> };
const MAX_DATA_BYTES = 8192;

/** PATCH /api/w/[ws]/items/[id] — обновить запись. */
export async function PATCH(request: Request, ctx: Ctx) {
  const { ws, id } = await ctx.params;
  if (!isValidWs(ws)) return NextResponse.json({ error: "Пространство не найдено." }, { status: 404 });
  let body: { data?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос." }, { status: 400 });
  }
  if (body.data == null || typeof body.data !== "object") {
    return NextResponse.json({ error: "Нет данных записи." }, { status: 400 });
  }
  if (JSON.stringify(body.data).length > MAX_DATA_BYTES) {
    return NextResponse.json({ error: "Запись слишком длинная." }, { status: 413 });
  }
  try {
    const ok = await updateItem(ws, id, body.data);
    if (!ok) return NextResponse.json({ error: "Запись не найдена." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (cause) {
    if (cause instanceof StoreUnavailable) {
      return NextResponse.json({ error: "Рабочее хранилище ещё подключается." }, { status: 503 });
    }
    console.error("item update failed", cause);
    return NextResponse.json({ error: "Не удалось обновить запись." }, { status: 502 });
  }
}

/** DELETE /api/w/[ws]/items/[id] — удалить запись. */
export async function DELETE(_request: Request, ctx: Ctx) {
  const { ws, id } = await ctx.params;
  if (!isValidWs(ws)) return NextResponse.json({ error: "Пространство не найдено." }, { status: 404 });
  try {
    const ok = await deleteItem(ws, id);
    if (!ok) return NextResponse.json({ error: "Запись не найдена." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (cause) {
    if (cause instanceof StoreUnavailable) {
      return NextResponse.json({ error: "Рабочее хранилище ещё подключается." }, { status: 503 });
    }
    console.error("item delete failed", cause);
    return NextResponse.json({ error: "Не удалось удалить запись." }, { status: 502 });
  }
}
