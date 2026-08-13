import { NextResponse } from "next/server";
import { addItem, getWorkspace, isValidWs, StoreUnavailable } from "../../../../../lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ ws: string }> };
const MAX_DATA_BYTES = 8192;

/** POST /api/w/[ws]/items — добавить запись. */
export async function POST(request: Request, ctx: Ctx) {
  const { ws } = await ctx.params;
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
    const workspace = await getWorkspace(ws);
    if (!workspace) return NextResponse.json({ error: "Пространство не найдено или было удалено." }, { status: 404 });
    const result = await addItem(ws, body.data);
    if (!result.ok) {
      if (result.reason === "full") return NextResponse.json({ error: "Достигнут лимит 1000 записей — почистите закрытые." }, { status: 429 });
      return NextResponse.json({ error: "Пространство не найдено." }, { status: 404 });
    }
    return NextResponse.json({ item: result.item }, { status: 201 });
  } catch (cause) {
    if (cause instanceof StoreUnavailable) {
      return NextResponse.json({ error: "Рабочее хранилище ещё подключается." }, { status: 503 });
    }
    console.error("item add failed", cause);
    return NextResponse.json({ error: "Не удалось сохранить запись." }, { status: 502 });
  }
}
