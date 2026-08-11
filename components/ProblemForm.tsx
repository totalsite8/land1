"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type State = "idle" | "sending" | "sent" | "error";

export default function ProblemForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [problem, setProblem] = useState("");
  const problemRef = useRef<HTMLTextAreaElement>(null);
  const lastPrefill = useRef("");
  useEffect(() => {
    function onPrefill(event: Event) {
      const text = (event as CustomEvent<{ text?: string }>).detail?.text;
      if (!text) return;
      setProblem((current) => {
        if (current && current !== lastPrefill.current) return current; // не затираем текст, который человек уже написал
        lastPrefill.current = text;
        return text;
      });
      window.setTimeout(() => {
        const el = problemRef.current;
        if (el) { el.focus({ preventScroll: true }); el.setSelectionRange(el.value.length, el.value.length); }
      }, 650);
    }
    window.addEventListener("prefill-problem", onPrefill);
    return () => window.removeEventListener("prefill-problem", onPrefill);
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending"); setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Не удалось отправить заявку.");
      setState("sent");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Не удалось отправить заявку."); setState("error"); }
  }
  if (state === "sent") return <div className="formSuccess"><strong>Заявка ушла.</strong><br />Вернёмся с вопросами в течение дня.</div>;
  return <form className="problemForm" onSubmit={submit}>
    <label>Что у вас ломается?<textarea required name="problem" ref={problemRef} value={problem} onChange={(event) => setProblem(event.target.value)} placeholder="Например: заявки остаются в Telegram, и менеджеры не знают, кто уже ответил." rows={4} /></label>
    <div className="formGrid">
      <label>Где болит?<select required name="area" defaultValue=""><option value="" disabled>Выберите процесс</option><option>Заявки</option><option>Новички</option><option>Смены</option><option>Документы</option><option>Продажи</option><option>Другое</option></select></label>
      <label>Ваша роль<select required name="role" defaultValue=""><option value="" disabled>Выберите роль</option><option>Собственник</option><option>Руководитель отдела</option><option>Другое</option></select></label>
      <label>Размер команды<select required name="team" defaultValue=""><option value="" disabled>Выберите размер</option><option>1–5</option><option>6–20</option><option>21–80</option><option>80+</option></select></label>
      <label>Контакт для ответа<input required name="contact" placeholder="Телефон или Telegram" /></label>
      <label className="wide">Как процесс ведётся сейчас?<select required name="current" defaultValue=""><option value="" disabled>Выберите текущий способ</option><option>Таблицы (Excel, Google Sheets)</option><option>Чаты и мессенджеры</option><option>В памяти и на словах</option><option>CRM или 1С</option><option>Бумага и личный учёт</option><option>Всё сразу, у всех по-разному</option></select></label>
    </div>
    <label className="check"><input required type="checkbox" name="consent" /> <span>Согласен на обработку данных для ответа на заявку.</span></label>
    <button className="button buttonDark" disabled={state === "sending"} type="submit">{state === "sending" ? "Отправляем…" : "Отправить заявку на разбор"} <span>↗</span></button>
    {state === "error" && <p className="formError">{error} <a href="https://t.me/bloodaman" target="_blank" rel="noreferrer">Написать в Telegram →</a></p>}
    <p className="formNote">Не присылайте пароли, платёжные данные и клиентские базы. Сначала разберём процесс.</p>
  </form>;
}
