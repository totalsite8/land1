"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, Trash2, TrendingDown, TrendingUp } from "lucide-react";

/**
 * Два демо на одном механике «строки + порог = сигнал»:
 * margin — PriceSignal: цена и себестоимость, сигнал когда маржа ниже порога.
 * stock  — StockAlert: остаток и продажи в день, сигнал когда запас меньше порога дней.
 */

type MarginRow = { id: string; name: string; price: number; cost: number };
type StockRow = { id: string; name: string; stock: number; sales: number };

const marginSeed: MarginRow[] = [
  { id: "m1", name: "Капучино 350 мл", price: 240, cost: 58 },
  { id: "m2", name: "Круассан миндальный", price: 180, cost: 74 },
  { id: "m3", name: "Сырники с собственного производства", price: 320, cost: 158 },
  { id: "m4", name: "Льдокофе «Тоник»", price: 290, cost: 121 }
];

const stockSeed: StockRow[] = [
  { id: "s1", name: "Стакан 350 мл, крафт", stock: 420, sales: 130 },
  { id: "s2", name: "Молоко 2,5%, л", stock: 38, sales: 22 },
  { id: "s3", name: "Крышки 80 мм", stock: 900, sales: 190 },
  { id: "s4", name: "Сироп «Карамель», 1 л", stock: 4, sales: 1 }
];

export function PriceSignalDemo() {
  const KEY = "demo-pricesignal";
  const [rows, setRows] = useState<MarginRow[]>([]);
  const [threshold, setThreshold] = useState(60);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { rows?: MarginRow[]; threshold?: number };
        if (saved.rows) setRows(saved.rows); else setRows(marginSeed);
        if (typeof saved.threshold === "number") setThreshold(saved.threshold);
        setReady(true); return;
      }
    } catch { /* повреждённое хранилище */ }
    setRows(marginSeed);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify({ rows, threshold })); } catch { /* приватный режим */ }
  }, [rows, threshold, ready]);

  const margin = (r: MarginRow) => r.price > 0 ? Math.round(((r.price - r.cost) / r.price) * 100) : 0;
  const signals = rows.filter((r) => margin(r) < threshold).length;

  function add() {
    const p = Number(price); const c = Number(cost);
    if (!name.trim() || !(p > 0) || !(c >= 0)) return;
    setRows((list) => [...list, { id: `m-${Date.now()}`, name: name.trim(), price: p, cost: c }]);
    setName(""); setPrice(""); setCost("");
  }

  function upd(id: string, field: "price" | "cost", value: number) {
    setRows((list) => list.map((r) => r.id === id ? { ...r, [field]: Math.max(0, value) } : r));
  }

  return (
    <section className="demoApp">
      <form className="demoForm" onSubmit={(event) => { event.preventDefault(); add(); }}>
        <p className="demoFormTitle">Позиции и порог сигнала</p>
        <label>Позиция*<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Латте 350 мл" /></label>
        <div className="demoGrid2">
          <label>Цена продажи, ₽*<input type="number" min={0} value={price} onChange={(event) => setPrice(event.target.value)} placeholder="290" /></label>
          <label>Себестоимость, ₽*<input type="number" min={0} value={cost} onChange={(event) => setCost(event.target.value)} placeholder="118" /></label>
        </div>
        <button className="button demoBtn" type="submit">Добавить позицию <ArrowDownRight size={16} /></button>
        <div className="critSection demoThreshold">
          <p className="critLabel">СИГНАЛ, ЕСЛИ МАРЖА НИЖЕ, %</p>
          <input className="numField" type="number" min={1} max={99} value={threshold} onChange={(event) => setThreshold(Math.min(99, Math.max(1, Number(event.target.value) || 1)))} />
        </div>
        <p className="demoFootNote">Цену меняет человек — инструмент только раньше всех замечает, что себестоимость съела маржу.</p>
      </form>

      <div className="demoList">
        <div className="demoListHead">
          <p>Позиций {rows.length} · сигналов: {signals}</p>
          {rows.length > 0 && <button type="button" className="demoGhostBtn" onClick={() => setRows(marginSeed)}>Сбросить к примеру</button>}
        </div>
        {!ready ? null : rows.length === 0
          ? <div className="demoEmpty">Список пуст — добавьте первую позицию слева.</div>
          : rows.map((row) => {
            const value = margin(row);
            const bad = value < threshold;
            return (
              <article className={`demoCard tRow${bad ? " alert" : ""}`} key={row.id}>
                <div className="demoCardTop">
                  <span className={`demoStatus ${bad ? "s-new" : "s-done"}`}>{bad ? <><TrendingDown size={11} /> ПОРА ПЕРЕСМОТРЕТЬ ЦЕНУ</> : <><TrendingUp size={11} /> МАРЖА В НОРМЕ</>}</span>
                  <button type="button" className="demoKill" onClick={() => setRows((list) => list.filter((r) => r.id !== row.id))} aria-label="Удалить позицию"><Trash2 size={14} /></button>
                </div>
                <p className="demoNeed">{row.name}</p>
                <div className="demoEditRow">
                  <label>Цена, ₽<input className="numEdit" type="number" min={0} value={row.price} onChange={(event) => upd(row.id, "price", Number(event.target.value) || 0)} /></label>
                  <label>Себестоимость, ₽<input className="numEdit" type="number" min={0} value={row.cost} onChange={(event) => upd(row.id, "cost", Number(event.target.value) || 0)} /></label>
                  <span className={`tMargin ${bad ? "bad" : "good"}`}>маржа {value}%</span>
                </div>
              </article>
            );
          })}
      </div>
    </section>
  );
}

export function StockAlertDemo() {
  const KEY = "demo-stockalert";
  const [rows, setRows] = useState<StockRow[]>([]);
  const [days, setDays] = useState(5);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [sales, setSales] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { rows?: StockRow[]; days?: number };
        if (saved.rows) setRows(saved.rows); else setRows(stockSeed);
        if (typeof saved.days === "number") setDays(saved.days);
        setReady(true); return;
      }
    } catch { /* повреждённое хранилище */ }
    setRows(stockSeed);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify({ rows, days })); } catch { /* приватный режим */ }
  }, [rows, days, ready]);

  const daysLeft = (r: StockRow) => r.sales > 0 ? r.stock / r.sales : Infinity;
  const needOrder = (r: StockRow) => Math.max(0, Math.ceil(days * r.sales - r.stock));
  const signals = rows.filter((r) => daysLeft(r) < days).length;

  function add() {
    const st = Number(stock); const sa = Number(sales);
    if (!name.trim() || !(st >= 0) || !(sa > 0)) return;
    setRows((list) => [...list, { id: `s-${Date.now()}`, name: name.trim(), stock: st, sales: sa }]);
    setName(""); setStock(""); setSales("");
  }

  function upd(id: string, field: "stock" | "sales", value: number) {
    setRows((list) => list.map((r) => r.id === id ? { ...r, [field]: Math.max(0, value) } : r));
  }

  return (
    <section className="demoApp">
      <form className="demoForm" onSubmit={(event) => { event.preventDefault(); add(); }}>
        <p className="demoFormTitle">Критичные позиции и запас</p>
        <label>Позиция*<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Стакан 350 мл" /></label>
        <div className="demoGrid2">
          <label>Остаток, шт*<input type="number" min={0} value={stock} onChange={(event) => setStock(event.target.value)} placeholder="420" /></label>
          <label>Продаж в день, шт*<input type="number" min={0} step="0.5" value={sales} onChange={(event) => setSales(event.target.value)} placeholder="130" /></label>
        </div>
        <button className="button demoBtn" type="submit">Добавить позицию <ArrowDownRight size={16} /></button>
        <div className="critSection demoThreshold">
          <p className="critLabel">НЕСНИЖАЕМЫЙ ЗАПАС, ДНЕЙ</p>
          <input className="numField" type="number" min={1} max={60} value={days} onChange={(event) => setDays(Math.min(60, Math.max(1, Number(event.target.value) || 1)))} />
        </div>
        <p className="demoFootNote">Сигнал приходит до нуля: осталось меньше запаса на N дней. В рабочей версии остатки грузятся простым файлом — без складских систем.</p>
      </form>

      <div className="demoList">
        <div className="demoListHead">
          <p>Позиций {rows.length} · список закупки: {signals} поз.</p>
          {rows.length > 0 && <button type="button" className="demoGhostBtn" onClick={() => setRows(stockSeed)}>Сбросить к примеру</button>}
        </div>
        {!ready ? null : rows.length === 0
          ? <div className="demoEmpty">Список пуст — добавьте первую критичную позицию слева.</div>
          : rows.map((row) => {
            const left = daysLeft(row);
            const bad = left < days;
            const order = needOrder(row);
            return (
              <article className={`demoCard tRow${bad ? " alert" : ""}`} key={row.id}>
                <div className="demoCardTop">
                  <span className={`demoStatus ${bad ? "s-new" : "s-done"}`}>{bad ? <>ЗАКАЗАТЬ ~{order} ШТ</> : "ЗАПАС В НОРМЕ"}</span>
                  <button type="button" className="demoKill" onClick={() => setRows((list) => list.filter((r) => r.id !== row.id))} aria-label="Удалить позицию"><Trash2 size={14} /></button>
                </div>
                <p className="demoNeed">{row.name}</p>
                <div className="demoEditRow">
                  <label>Остаток, шт<input className="numEdit" type="number" min={0} value={row.stock} onChange={(event) => upd(row.id, "stock", Number(event.target.value) || 0)} /></label>
                  <label>Продаж/день<input className="numEdit" type="number" min={0} step="0.5" value={row.sales} onChange={(event) => upd(row.id, "sales", Number(event.target.value) || 0)} /></label>
                  <span className={`tMargin ${bad ? "bad" : "good"}`}>{left === Infinity ? "не расходуется" : `хватит на ${Math.floor(left)} дн`}</span>
                </div>
              </article>
            );
          })}
      </div>
    </section>
  );
}
