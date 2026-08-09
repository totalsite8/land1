"use client";

import { FormEvent, useState } from "react";

export default function ProblemForm() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) return <div className="formSuccess"><strong>Заявка ушла.</strong><br />Вернёмся с вопросами в течение дня.</div>;

  return <form className="problemForm" onSubmit={submit}>
    <label>Что у вас ломается?<textarea required name="problem" placeholder="Например: заявки остаются в Telegram, и менеджеры не знают, кто уже ответил." rows={4} /></label>
    <div className="formGrid">
      <label>Где болит?<select name="area" defaultValue=""><option value="" disabled>Выберите процесс</option><option>Заявки</option><option>Новички</option><option>Смены</option><option>Документы</option><option>Продажи</option><option>Другое</option></select></label>
      <label>Ваша роль<select name="role" defaultValue=""><option value="" disabled>Выберите роль</option><option>Собственник</option><option>Руководитель отдела</option><option>Другое</option></select></label>
      <label>Размер команды<select name="team" defaultValue=""><option value="" disabled>Выберите размер</option><option>1–5</option><option>6–20</option><option>21–80</option><option>80+</option></select></label>
      <label>Контакт для ответа<input required name="contact" placeholder="Телефон или Telegram" /></label>
    </div>
    <label className="check"><input required type="checkbox" /> <span>Согласен на обработку данных для ответа на заявку.</span></label>
    <button className="button buttonDark" type="submit">Отправить заявку на разбор <span>↗</span></button>
    <p className="formNote">Не присылайте пароли, платёжные данные и клиентские базы. Сначала разберём процесс.</p>
  </form>;
}
