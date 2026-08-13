import { NextResponse } from "next/server";
import { createWorkspace, StoreUnavailable, TOOL_NAMES, WORK_TOOLS } from "../../../lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/w — создать рабочее пространство инструмента. */
export async function POST(request: Request) {
  let body: { tool?: unknown; name?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос." }, { status: 400 });
  }
  const tool = typeof body.tool === "string" ? body.tool : "";
  if (!(WORK_TOOLS as readonly string[]).includes(tool)) {
    return NextResponse.json({ error: "Неизвестный инструмент." }, { status: 400 });
  }
  const name = typeof body.name === "string" ? body.name : TOOL_NAMES[tool as keyof typeof TOOL_NAMES];
  try {
    const ws = await createWorkspace(tool as keyof typeof TOOL_NAMES, name);
    return NextResponse.json({ ws, url: `/tool/${tool}/${ws}` }, { status: 201 });
  } catch (cause) {
    if (cause instanceof StoreUnavailable) {
      return NextResponse.json({ error: "Рабочее хранилище ещё подключается — попробуйте позже или напишите нам." }, { status: 503 });
    }
    console.error("workspace create failed", cause);
    return NextResponse.json({ error: "Не удалось создать пространство." }, { status: 502 });
  }
}
