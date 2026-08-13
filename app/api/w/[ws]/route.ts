import { NextResponse } from "next/server";
import { getWorkspace, isValidWs, listItems, StoreUnavailable } from "../../../../lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ ws: string }> };

/** GET /api/w/[ws] — пространство и все записи. */
export async function GET(_request: Request, ctx: Ctx) {
  const { ws } = await ctx.params;
  if (!isValidWs(ws)) return NextResponse.json({ error: "Пространство не найдено." }, { status: 404 });
  try {
    const workspace = await getWorkspace(ws);
    if (!workspace) return NextResponse.json({ error: "Пространство не найдено или было удалено." }, { status: 404 });
    const items = await listItems(ws);
    return NextResponse.json({ workspace, items });
  } catch (cause) {
    if (cause instanceof StoreUnavailable) {
      return NextResponse.json({ error: "Рабочее хранилище ещё подключается." }, { status: 503 });
    }
    console.error("workspace read failed", cause);
    return NextResponse.json({ error: "Не удалось загрузить пространство." }, { status: 502 });
  }
}
