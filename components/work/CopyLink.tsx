"use client";

import { useState } from "react";
import { Check, ClipboardCopy } from "lucide-react";

export default function CopyLink() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch { /* буфер недоступен — ссылку можно скопировать из адресной строки */ }
  }
  return (
    <button type="button" className="copyLink" onClick={() => void copy()}>
      {copied ? <><Check size={12} /> Скопировано</> : <><ClipboardCopy size={12} /> Ссылку команде</>}
    </button>
  );
}
