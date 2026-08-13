"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Link2, Loader2 } from "lucide-react";

/**
 * Мост «демо → рабочая версия»: создаёт пространство через API
 * и запоминает вашу комнату, чтобы вернуться к ней позже с этого устройства.
 */
export default function WorkBanner({ tool, toolName }: { tool: string; toolName: string }) {
  const router = useRouter();
  const [owned, setOwned] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try { setOwned(localStorage.getItem(`work-${tool}`) ?? ""); } catch { /* приватный режим */ }
  }, [tool]);

  async function createSpace() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/w", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool })
      });
      const json = await res.json() as { ws?: string; url?: string; error?: string };
      if (!res.ok || !json.ws || !json.url) throw new Error(json.error ?? "Не удалось создать пространство.");
      try { localStorage.setItem(`work-${tool}`, json.url); } catch { /* приватный режим */ }
      router.push(json.url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось создать пространство — хранилище ещё подключается.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="workBanner">
      <div className="workBannerText">
        <b>Это демо. А ниже кнопкой — настоящая рабочая версия {toolName}.</b>
        <p>Рабочая версия — общая доска по секретной ссылке: вся команда видит одно и то же, записи хранятся на сервере, а не в браузере. Без регистрации и паролей: вход по ссылке.</p>
      </div>
      <div className="workBannerBtns">
        {owned ? (
          <>
            <a className="button" href={owned}>Открыть ваше пространство <ArrowUpRight size={16} /></a>
            <button type="button" className="demoGhostBtn" disabled={busy} onClick={() => void createSpace()}>
              {busy ? <Loader2 size={13} className="spin" /> : null} Создать новое
            </button>
          </>
        ) : (
          <button type="button" className="button" disabled={busy} onClick={() => void createSpace()}>
            {busy ? <>Создаём <Loader2 size={15} className="spin" /></> : <>Запустить рабочую версию <Link2 size={15} /></>}
          </button>
        )}
      </div>
      {error ? <p className="workError">{error}</p> : null}
    </div>
  );
}
