import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const requiredFields = ["problem", "area", "role", "team", "contact", "current"] as const;
const LEAD_EMAIL = "totalsite@yandex.ru";

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  const lead = Object.fromEntries(requiredFields.map((field) => [field, String(body[field] ?? "").trim()]));
  if (Object.values(lead).some((value) => !value)) return NextResponse.json({ error: "Заполните обязательные поля." }, { status: 400 });
  if (lead.problem.length > 4000) return NextResponse.json({ error: "Слишком длинное описание — сократите до пяти предложений." }, { status: 400 });

  const text = [
    "Новая заявка с лендинга",
    "",
    `Проблема: ${lead.problem}`,
    `Процесс: ${lead.area}`,
    `Роль: ${lead.role}`,
    `Команда: ${lead.team}`,
    `Сейчас ведут: ${lead.current}`,
    `Контакт: ${lead.contact}`
  ].join("\n");
  const subject = `Заявка с сайта: ${lead.area} — ${lead.contact}`.slice(0, 200);

  // Канал 1: почта через SMTP Яндекса (является основным каналом доставки)
  const mailUser = process.env.YANDEX_SMTP_USER;
  const mailPass = process.env.YANDEX_SMTP_PASSWORD;
  let mailSent = false;
  let mailError = "";
  if (mailUser && mailPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.yandex.ru",
        port: 465,
        secure: true,
        auth: { user: mailUser, pass: mailPass }
      });
      await transporter.sendMail({
        from: `Лендинг «Эй Ай, Больно» <${mailUser}>`,
        to: LEAD_EMAIL,
        subject,
        text
      });
      mailSent = true;
    } catch (cause) {
      mailError = cause instanceof Error ? cause.message : String(cause);
    }
  } else {
    mailError = "no-env";
  }

  // Канал 2: Telegram как дубль (если настроен)
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  let tgSent = false;
  if (token && chatId) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chatId, text })
      });
      tgSent = response.ok;
    } catch { tgSent = false; }
  }

  if (mailSent || tgSent) return NextResponse.json({ ok: true });
  console.error("lead delivery failed", { mailError, tgSent, mailConfigured: Boolean(mailUser && mailPass), tgConfigured: Boolean(token && chatId) });
  if (!mailUser || !mailPass) return NextResponse.json({ error: "Приём заявок ещё настраивается. Напишите нам в Telegram." }, { status: 503 });
  return NextResponse.json({ error: "Не удалось отправить заявку. Напишите нам в Telegram." }, { status: 502 });
}
