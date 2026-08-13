import { nanoid } from "nanoid";
import { promises as fs } from "fs";

/**
 * Хранилище рабочих версий инструментов.
 * Прод (Vercel): Postgres (POSTGRES_URL подставляет подключённое Storage).
 * Песочница/локаль: JSON-файл в /tmp — чтобы рабочие версии можно было гонять без базы.
 * На Vercel без Postgres честно отвечаем 503, а не притворяемся, что данные сохраняются.
 */

export type Workspace = { ws: string; tool: string; name: string; createdAt: number };
export type Item<T = unknown> = { id: string; data: T; createdAt: number; updatedAt: number };

export const WORK_TOOLS = [
  "briefbox", "onboardone", "shifthandover",
  "forumlead", "rivalmap", "partnerreach", "tenderfit", "pricesignal",
  "reviewreply", "docchaser", "leaddedup", "invoicenudge", "stockalert",
  "threadpilot", "ideathread"
] as const;
export type WorkTool = (typeof WORK_TOOLS)[number];

export const TOOL_NAMES: Record<WorkTool, string> = {
  briefbox: "BriefBox — заявки одной карточкой",
  onboardone: "OnboardOne — маршрут первых дней",
  shifthandover: "ShiftHandover — доска передачи смены",
  forumlead: "ForumLead — вопросы клиентов из чатов",
  rivalmap: "RivalMap — сводка ходов конкурентов",
  partnerreach: "PartnerReach — договорённости с партнёрами",
  tenderfit: "TenderFit — тендеры под ваши критерии",
  pricesignal: "PriceSignal — сигнал «пора пересмотреть цену»",
  reviewreply: "ReviewReply — одна очередь отзывов",
  docchaser: "DocChaser — доска документов в работе",
  leaddedup: "LeadDedup — дубли лидов помечены до работы",
  invoicenudge: "InvoiceNudge — цепочка напоминаний об оплате",
  stockalert: "StockAlert — сигнал о дефиците до нуля",
  threadpilot: "ThreadPilot — открытые диалоги на одном поле",
  ideathread: "IdeaThread — из мысли цепочка черновиков"
};

/**
 * У рабочих версий два типа записей в одном списке items:
 * data.b — «корзина» (row/lead/comp/change/idea) и служебная data.b==="meta"
 * для настроек доски (пороги, фильтры, отметки). Компоненты читают свою корзину.
 */

export class StoreUnavailable extends Error {}

const hasPostgres = Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL);
const onVercel = Boolean(process.env.VERCEL);
const useFile = !hasPostgres && !onVercel;
export const storeBackend: "postgres" | "file" | "none" = hasPostgres ? "postgres" : useFile ? "file" : "none";

const MAX_ITEMS = 1000;
const MAX_WS_AGE_SLUG = /^[A-Za-z0-9_-]{12,40}$/;
export const isValidWs = (ws: string) => MAX_WS_AGE_SLUG.test(ws);

/* ---------- Postgres ---------- */

let ensured = false;
type SqlFn = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<{ rows: Record<string, unknown>[]; rowCount: number }>;

async function pg(): Promise<SqlFn> {
  const mod = await import("@vercel/postgres");
  if (!process.env.POSTGRES_URL && process.env.DATABASE_URL) process.env.POSTGRES_URL = process.env.DATABASE_URL;
  return mod.sql as unknown as SqlFn;
}

async function ensure(sql: SqlFn) {
  if (ensured) return;
  await sql`CREATE TABLE IF NOT EXISTS land1_ws (ws TEXT PRIMARY KEY, tool TEXT NOT NULL, name TEXT NOT NULL, created_at BIGINT NOT NULL)`;
  await sql`CREATE TABLE IF NOT EXISTS land1_items (id TEXT PRIMARY KEY, ws TEXT NOT NULL REFERENCES land1_ws(ws), data JSONB NOT NULL, created_at BIGINT NOT NULL, updated_at BIGINT NOT NULL)`;
  await sql`CREATE INDEX IF NOT EXISTS land1_items_ws_idx ON land1_items (ws)`;
  ensured = true;
}

interface WsRow { ws: string; tool: string; name: string; created_at: number }
interface ItemRow { id: string; data: unknown; created_at: number; updated_at: number }

/* ---------- Файловый бэкенд (локально) ---------- */

type FileData = { workspaces: Workspace[]; items: (Item & { ws: string })[] };
const FILE = "/tmp/land1-work.json";
let mutex: Promise<unknown> = Promise.resolve();

async function readStore(): Promise<FileData> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as FileData;
    return { workspaces: parsed.workspaces ?? [], items: parsed.items ?? [] };
  } catch {
    return { workspaces: [], items: [] };
  }
}

async function withFile<T>(fn: (data: FileData) => T | Promise<T>): Promise<T> {
  const run = mutex.then(async () => {
    const data = await readStore();
    const out = await fn(data);
    await fs.writeFile(FILE, JSON.stringify(data));
    return out;
  });
  mutex = run.catch(() => undefined);
  return run;
}

/* ---------- Публичный API хранилища ---------- */

export async function createWorkspace(tool: WorkTool, name?: string): Promise<string> {
  if (storeBackend === "none") throw new StoreUnavailable("no-postgres");
  const ws = nanoid(21);
  const label = (name ?? "").trim().slice(0, 80) || TOOL_NAMES[tool];
  if (storeBackend === "postgres") {
    const sql = await pg();
    await ensure(sql);
    await sql`INSERT INTO land1_ws (ws, tool, name, created_at) VALUES (${ws}, ${tool}, ${label}, ${Date.now()})`;
    return ws;
  }
  await withFile(async (data) => {
    data.workspaces.push({ ws, tool, name: label, createdAt: Date.now() });
  });
  return ws;
}

export async function getWorkspace(ws: string): Promise<Workspace | null> {
  if (storeBackend === "none") throw new StoreUnavailable("no-postgres");
  if (storeBackend === "postgres") {
    const sql = await pg();
    await ensure(sql);
    const res = await sql`SELECT * FROM land1_ws WHERE ws = ${ws} LIMIT 1`;
    const row = res.rows[0] as unknown as WsRow | undefined;
    return row ? { ws: row.ws, tool: row.tool, name: row.name, createdAt: Number(row.created_at) } : null;
  }
  const data = await withFile(async (d) => d);
  const found = data.workspaces.find((w) => w.ws === ws);
  return found ?? null;
}

export async function listItems<T = unknown>(ws: string): Promise<Item<T>[]> {
  if (storeBackend === "none") throw new StoreUnavailable("no-postgres");
  if (storeBackend === "postgres") {
    const sql = await pg();
    await ensure(sql);
    const res = await sql`SELECT id, data, created_at, updated_at FROM land1_items WHERE ws = ${ws} ORDER BY created_at DESC`;
    return res.rows.map((row) => {
      const r = row as unknown as ItemRow;
      return { id: r.id, data: r.data as T, createdAt: Number(r.created_at), updatedAt: Number(r.updated_at) };
    });
  }
  const data = await withFile(async (d) => d);
  return data.items.filter((i) => i.ws === ws).sort((a, b) => b.createdAt - a.createdAt)
    .map((i) => ({ id: i.id, data: i.data as T, createdAt: i.createdAt, updatedAt: i.updatedAt }));
}

export type AddResult = { ok: true; item: Item } | { ok: false; reason: "full" | "missing" };

export async function addItem<T>(ws: string, data: T): Promise<AddResult> {
  if (storeBackend === "none") throw new StoreUnavailable("no-postgres");
  if (storeBackend === "postgres") {
    const sql = await pg();
    await ensure(sql);
    const count = await sql`SELECT COUNT(*)::int AS c FROM land1_items WHERE ws = ${ws}`;
    if (Number((count.rows[0] as { c: number }).c) >= MAX_ITEMS) return { ok: false, reason: "full" };
    const id = nanoid(14);
    const now = Date.now();
    await sql`INSERT INTO land1_items (id, ws, data, created_at, updated_at) VALUES (${id}, ${ws}, ${JSON.stringify(data)}::jsonb, ${now}, ${now})`;
    return { ok: true, item: { id, data, createdAt: now, updatedAt: now } };
  }
  return withFile(async (d) => {
    if (!d.workspaces.some((w) => w.ws === ws)) return { ok: false as const, reason: "missing" as const };
    const mine = d.items.filter((i) => i.ws === ws);
    if (mine.length >= MAX_ITEMS) return { ok: false as const, reason: "full" as const };
    const id = nanoid(14);
    const now = Date.now();
    d.items.push({ id, ws, data, createdAt: now, updatedAt: now });
    return { ok: true as const, item: { id, data, createdAt: now, updatedAt: now } };
  });
}

export async function updateItem<T>(ws: string, id: string, data: T): Promise<boolean> {
  if (storeBackend === "none") throw new StoreUnavailable("no-postgres");
  const now = Date.now();
  if (storeBackend === "postgres") {
    const sql = await pg();
    await ensure(sql);
    const res = await sql`UPDATE land1_items SET data = ${JSON.stringify(data)}::jsonb, updated_at = ${now} WHERE id = ${id} AND ws = ${ws}`;
    return res.rowCount > 0;
  }
  return withFile(async (d) => {
    const item = d.items.find((i) => i.id === id && i.ws === ws);
    if (!item) return false;
    item.data = data;
    item.updatedAt = now;
    return true;
  });
}

export async function deleteItem(ws: string, id: string): Promise<boolean> {
  if (storeBackend === "none") throw new StoreUnavailable("no-postgres");
  if (storeBackend === "postgres") {
    const sql = await pg();
    await ensure(sql);
    const res = await sql`DELETE FROM land1_items WHERE id = ${id} AND ws = ${ws}`;
    return res.rowCount > 0;
  }
  return withFile(async (d) => {
    const before = d.items.length;
    d.items = d.items.filter((i) => !(i.id === id && i.ws === ws));
    return d.items.length < before;
  });
}
