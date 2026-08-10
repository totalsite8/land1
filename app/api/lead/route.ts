import { NextResponse } from "next/server";

const requiredFields = ["problem", "area", "role", "team", "contact"] as const;

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  const lead = Object.fromEntries(requiredFields.map((field) => [field, String(body[field] ?? "").trim()]));
  if (Object.values(lead).some((value) => !value)) return NextResponse.json({ error: "Заполните обязательные поля." }, { status: 400 });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return NextResponse.json({ error: "Приём заявок ещё настраивается. Напишите нам в Telegram." }, { status: 503 });

  const text = [
    "Новая заявка с лендинга",
    "",
    `Проблема: ${lead.problem}`,
    `Процесс: ${lead.area}`,
    `Роль: ${lead.role}`,
    `Команда: ${lead.team}`,
    `Контакт: ${lead.contact}`
  ].join("\n");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chatId, text })
  });
  if (!response.ok) return NextResponse.json({ error: "Не удалось отправить заявку. Напишите нам в Telegram." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
