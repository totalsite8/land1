"use client";

import { useState } from "react";
import { ArrowDownRight, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import useBuckets from "./useBuckets";
import { WorkStateBox } from "./workUi";

type MarginRow = { name: string; price: number; cost: number };
type StockRow = { name: string; stock: number; sales: number };

export function PriceSignalWork({ ws }: { ws: string }) {
  const { bucket, add, update, remove, setMeta, metaItem, state, reload } = useBuckets(ws);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");
  const [loud, setLoud] = useState("");
  const [drafts, setDrafts] = useState<Record<string, Partial<MarginRow>>>({});
  const [thresholdDraft, setThresholdDraft] = useState<number | null>(null);

  const rows = bucket<MarginRow>("row");
  const meta = metaItem();
  const threshold = thresholdDraft ?? (meta && typeof (meta.v as { threshold?: number }).threshold === "number"
    ? (meta.v as { threshold: number }).threshold : 60);

  const margin = (r: MarginRow) => r.price > 0 ? Math.round(((r.price - r.cost) / r.price) * 100) : 0;
  const liveRow = (id: string, row: MarginRow): MarginRow => ({ ...row, ...drafts[id] });
  const signals = rows.filter((r) => margin(liveRow(r.id, r.data)) < threshold).length;

  async function addRow() {
    const p = Number(price); const c = Number(cost);
    if (!name.trim() || !(p > 0) || !(c >= 0)) return;
    setLoud("");
    const ok = await add("row", { name: name.trim().slice(0, 120), price: p, cost: c });
    if (ok) { setName(""); setPrice(""); setCost(""); }
    else setLoud("Не сохранилось — проверьте связь и попробуйте ещё раз.");
  }

  function setDraft(id: string, field: "price" | "cost", value: number) {
    setDrafts((d) => ({ ...d, [id]: { ...d[id], [field]: Math.max(0, value) } }));
  }

  async function commitRow(id: string, row: MarginRow) {
    const d = drafts[id];
    if (!d) return;
    setDrafts((prev) => { const next = { ...prev }; delete next[id]; return next; });
    await update(id, "row", { ...row, ...d });
  }

  async function commitThreshold() {
    if (thresholdDraft === null) return;
    const v = Math.min(99, Math.max(1, thresholdDraft));
    setThresholdDraft(null);
    await setMeta({ threshold: v });
  }

  return (
    <section className="demoApp">
      <form className="demoForm" onSubmit={(event) => { event.preventDefault(); void addRow(); }}>
        <p className="demoFormTitle">Позиции и порог сигнала — общие для всей команды</p>
        <label>Позиция*<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Латте 350 мл" /></label>
        <div className="demoGrid2">
          <label>Цена продажи, ₽*<input type="number" min={0} value={price} onChange={(event) => setPrice(event.target.value)} placeholder="290" /></label>
          <label>Себестоимость, ₽*<input type="number" min={0} value={cost} onChange={(event) => setCost(event.target.value)} placeholder="118" /></label>
        </div>
        <button className="button demoBtn" type="submit">Добавить позицию <ArrowDownRight size={16} /></button>
        {loud ? <p className="formError">{loud}</p> : null}
        <div className="critSection demoThreshold">
          <p className="critLabel">СИГНАЛ, ЕСЛИ МАРЖА НИЖЕ, %</p>
          <input className="numField" type="number" min={1} max={99} value={threshold}
            onChange={(event) => setThresholdDraft(Math.min(99, Math.max(1, Number(event.target.value) || 1)))}
            onBlur={() => void commitThreshold()} />
        </div>
        <p className="demoFootNote">Порог и позиции общие: изменение у одного появится у всех по ссылке в течение 15 секунд. Цифры в карточках сохраняются, когда поле теряет фокус.</p>
      </form>

      <div className="demoList">
        <div className="demoListHead">
          <p>Позиций {state === "ok" ? rows.length : "…"} · сигналов: {state === "ok" ? signals : "…"} · обновление каждые 15 сек</p>
        </div>
        <WorkStateBox state={state} onRetry={() => void reload()} />
        {state === "ok" && (rows.length === 0
          ? <div className="demoEmpty">Список пуст — добавьте первую позицию слева, её увидит вся команда.</div>
          : rows.map((row) => {
            const live = liveRow(row.id, row.data);
            const value = margin(live);
            const bad = value < threshold;
            return (
              <article className={`demoCard tRow${bad ? " alert" : ""}`} key={row.id}>
                <div className="demoCardTop">
                  <span className={`demoStatus ${bad ? "s-new" : "s-done"}`}>{bad ? <><TrendingDown size={11} /> ПОРА ПЕРЕСМОТРЕТЬ ЦЕНУ</> : <><TrendingUp size={11} /> МАРЖА В НОРМЕ</>}</span>
                  <button type="button" className="demoKill" onClick={() => void remove(row.id)} aria-label="Удалить позицию"><Trash2 size={14} /></button>
                </div>
                <p className="demoNeed">{row.data.name}</p>
                <div className="demoEditRow">
                  <label>Цена, ₽<input className="numEdit" type="number" min={0} value={live.price}
                    onChange={(event) => setDraft(row.id, "price", Number(event.target.value) || 0)}
                    onBlur={() => void commitRow(row.id, row.data)} /></label>
                  <label>Себестоимость, ₽<input className="numEdit" type="number" min={0} value={live.cost}
                    onChange={(event) => setDraft(row.id, "cost", Number(event.target.value) || 0)}
                    onBlur={() => void commitRow(row.id, row.data)} /></label>
                  <span className={`tMargin ${bad ? "bad" : "good"}`}>маржа {value}%</span>
                </div>
              </article>
            );
          }))}
      </div>
    </section>
  );
}

export function StockAlertWork({ ws }: { ws: string }) {
  const { bucket, add, update, remove, setMeta, metaItem, state, reload } = useBuckets(ws);
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [sales, setSales] = useState("");
  const [loud, setLoud] = useState("");
  const [drafts, setDrafts] = useState<Record<string, Partial<StockRow>>>({});
  const [daysDraft, setDaysDraft] = useState<number | null>(null);

  const rows = bucket<StockRow>("row");
  const meta = metaItem();
  const days = daysDraft ?? (meta && typeof (meta.v as { days?: number }).days === "number"
    ? (meta.v as { days: number }).days : 5);

  const liveRow = (id: string, row: StockRow): StockRow => ({ ...row, ...drafts[id] });
  const daysLeft = (r: StockRow) => r.sales > 0 ? r.stock / r.sales : Infinity;
  const needOrder = (r: StockRow) => Math.max(0, Math.ceil(days * r.sales - r.stock));
  const signals = rows.filter((r) => daysLeft(liveRow(r.id, r.data)) < days).length;

  async function addRow() {
    const st = Number(stock); const sa = Number(sales);
    if (!name.trim() || !(st >= 0) || !(sa > 0)) return;
    setLoud("");
    const ok = await add("row", { name: name.trim().slice(0, 120), stock: st, sales: sa });
    if (ok) { setName(""); setStock(""); setSales(""); }
    else setLoud("Не сохранилось — проверьте связь и попробуйте ещё раз.");
  }

  function setDraft(id: string, field: "stock" | "sales", value: number) {
    setDrafts((d) => ({ ...d, [id]: { ...d[id], [field]: Math.max(0, value) } }));
  }

  async function commitRow(id: string, row: StockRow) {
    const d = drafts[id];
    if (!d) return;
    setDrafts((prev) => { const next = { ...prev }; delete next[id]; return next; });
    await update(id, "row", { ...row, ...d });
  }

  async function commitDays() {
    if (daysDraft === null) return;
    const v = Math.min(60, Math.max(1, daysDraft));
    setDaysDraft(null);
    await setMeta({ days: v });
  }

  return (
    <section className="demoApp">
      <form className="demoForm" onSubmit={(event) => { event.preventDefault(); void addRow(); }}>
        <p className="demoFormTitle">Критичные позиции и запас — общие для всей команды</p>
        <label>Позиция*<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Стакан 350 мл" /></label>
        <div className="demoGrid2">
          <label>Остаток, шт*<input type="number" min={0} value={stock} onChange={(event) => setStock(event.target.value)} placeholder="420" /></label>
          <label>Продаж в день, шт*<input type="number" min={0} step="0.5" value={sales} onChange={(event) => setSales(event.target.value)} placeholder="130" /></label>
        </div>
        <button className="button demoBtn" type="submit">Добавить позицию <ArrowDownRight size={16} /></button>
        {loud ? <p className="formError">{loud}</p> : null}
        <div className="critSection demoThreshold">
          <p className="critLabel">НЕСНИЖАЕМЫЙ ЗАПАС, ДНЕЙ</p>
          <input className="numField" type="number" min={1} max={60} value={days}
            onChange={(event) => setDaysDraft(Math.min(60, Math.max(1, Number(event.target.value) || 1)))}
            onBlur={() => void commitDays()} />
        </div>
        <p className="demoFootNote">Остатки и запас общие: закупщик и зал видят одну картину. Числа в карточках сохраняются, когда поле теряет фокус; у всех по ссылке — в течение 15 секунд.</p>
      </form>

      <div className="demoList">
        <div className="demoListHead">
          <p>Позиций {state === "ok" ? rows.length : "…"} · список закупки: {state === "ok" ? `${signals} поз.` : "…"} · обновление каждые 15 сек</p>
        </div>
        <WorkStateBox state={state} onRetry={() => void reload()} />
        {state === "ok" && (rows.length === 0
          ? <div className="demoEmpty">Список пуст — добавьте первую критичную позицию слева, её увидит вся команда.</div>
          : rows.map((row) => {
            const live = liveRow(row.id, row.data);
            const left = daysLeft(live);
            const bad = left < days;
            const order = needOrder(live);
            return (
              <article className={`demoCard tRow${bad ? " alert" : ""}`} key={row.id}>
                <div className="demoCardTop">
                  <span className={`demoStatus ${bad ? "s-new" : "s-done"}`}>{bad ? <>ЗАКАЗАТЬ ~{order} ШТ</> : "ЗАПАС В НОРМЕ"}</span>
                  <button type="button" className="demoKill" onClick={() => void remove(row.id)} aria-label="Удалить позицию"><Trash2 size={14} /></button>
                </div>
                <p className="demoNeed">{row.data.name}</p>
                <div className="demoEditRow">
                  <label>Остаток, шт<input className="numEdit" type="number" min={0} value={live.stock}
                    onChange={(event) => setDraft(row.id, "stock", Number(event.target.value) || 0)}
                    onBlur={() => void commitRow(row.id, row.data)} /></label>
                  <label>Продаж/день<input className="numEdit" type="number" min={0} step="0.5" value={live.sales}
                    onChange={(event) => setDraft(row.id, "sales", Number(event.target.value) || 0)}
                    onBlur={() => void commitRow(row.id, row.data)} /></label>
                  <span className={`tMargin ${bad ? "bad" : "good"}`}>{left === Infinity ? "не расходуется" : `хватит на ${Math.floor(left)} дн`}</span>
                </div>
              </article>
            );
          }))}
      </div>
    </section>
  );
}
