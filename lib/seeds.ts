import { addItem, type WorkTool } from "./store";

/**
 * Стартовое наполнение только что созданного пространства:
 * пара честных примеров-записей, чтобы доска не открывалась пустой.
 * createdAt — момент создания комнаты: никаких «ждёт уже три дня» легенд,
 * примеры помечаются так, как будто их только что внесли.
 *
 * Формат записей тот же, что в демо (components/demo/*), плюс корзина data.b:
 * "row"  — строка очереди/позиции,
 * "lead" — лид у LeadDedup,
 * "comp"/"change" — конкурент и факт у RivalMap,
 * "idea" — мысль с черновиками у IdeaThread,
 * "meta" — настройки доски (порог, дни, фильтры TenderFit).
 */
export async function seedWorkspace(ws: string, tool: WorkTool): Promise<void> {
  const t = Date.now();
  switch (tool) {
    /* ---- очереди ---- */
    case "forumlead":
      await addItem(ws, { b: "row", kind: "chat", values: { q: "«Ребят, кто делает вывески со световыми буквами? Нужна 3×1 м на фасад»", who: "Марина, соседний ТЦ", ctx: "В треде уже два совета — один рекомендует конкурента" }, statusIdx: 0, createdAt: t });
      await addItem(ws, { b: "row", kind: "forum", values: { q: "«Посоветуйте подрядчика по вентиляции для кофейни 80 м²»", who: "кофейня_на_хлебной", ctx: "Тема создана вчера, исполнителей пока нет" }, statusIdx: 1, createdAt: t });
      break;
    case "reviewreply":
      await addItem(ws, { b: "row", kind: "maps", values: { text: "«Ждали заказ 50 минут, хотя зал был пустой. Кухня в порядке, но по времени — слабо»", author: "Дмитрий К.", stars: "3" }, statusIdx: 0, createdAt: t });
      await addItem(ws, { b: "row", kind: "2gis", values: { text: "«Лучшие пироги в районе, персонал вежливый, всегда чисто»", author: "Ольга", stars: "5" }, statusIdx: 1, createdAt: t });
      break;
    case "docchaser":
      await addItem(ws, { b: "row", values: { doc: "Акт №87 — ООО «Восход», монтаж за июль", owner: "Ира", due: "2026-08-05" }, statusIdx: 1, createdAt: t });
      await addItem(ws, { b: "row", values: { doc: "Счёт-договор — ИП Заречный, повторная поставка", owner: "Саня", due: "2026-08-28" }, statusIdx: 0, createdAt: t });
      break;
    case "invoicenudge":
      await addItem(ws, { b: "row", values: { client: "ООО «Ладога» — счёт 112 за июль", sum: "96 400 ₽", sent: "2026-07-28" }, statusIdx: 2, createdAt: t });
      await addItem(ws, { b: "row", values: { client: "Студия «Меркатор» — брендинг, этап 2", sum: "150 000 ₽", sent: "2026-08-06" }, statusIdx: 1, createdAt: t });
      break;
    case "partnerreach":
      await addItem(ws, { b: "row", values: { partner: "Анна, агентство «Профиль»", deal: "Она приводит объекты HoReCa, мы делаем меню-борды и делим чек", next: "2026-08-07" }, statusIdx: 0, createdAt: t });
      await addItem(ws, { b: "row", values: { partner: "Сергей, фотостудия «Кадр»", deal: "Взаимные рекомендации на съёмки для каталогов", next: "2026-08-20" }, statusIdx: 1, createdAt: t });
      break;
    case "threadpilot":
      await addItem(ws, { b: "row", kind: "tg", values: { client: "Татьяна, заказ штор", q: "«А когда замер? Мне важно до выходных»" }, statusIdx: 0, createdAt: t });
      await addItem(ws, { b: "row", kind: "mail", values: { client: "Кафе «Юг», закупка", q: "Коммерческое предложение — прислать повторно, не дошло" }, statusIdx: 0, createdAt: t });
      break;
    /* ---- пороги ---- */
    case "pricesignal":
      await addItem(ws, { b: "meta", v: { threshold: 60 } });
      await addItem(ws, { b: "row", name: "Капучино 350 мл", price: 240, cost: 58 });
      await addItem(ws, { b: "row", name: "Круассан миндальный", price: 180, cost: 74 });
      await addItem(ws, { b: "row", name: "Сырники с собственного производства", price: 320, cost: 158 });
      await addItem(ws, { b: "row", name: "Льдокофе «Тоник»", price: 290, cost: 121 });
      break;
    case "stockalert":
      await addItem(ws, { b: "meta", v: { days: 5 } });
      await addItem(ws, { b: "row", name: "Стакан 350 мл, крафт", stock: 420, sales: 130 });
      await addItem(ws, { b: "row", name: "Молоко 2,5%, л", stock: 38, sales: 22 });
      await addItem(ws, { b: "row", name: "Крышки 80 мм", stock: 900, sales: 190 });
      await addItem(ws, { b: "row", name: "Сироп «Карамель», 1 л", stock: 4, sales: 1 });
      break;
    /* ---- дубли лидов (связи по key, не по серверному id) ---- */
    case "leaddedup":
      await addItem(ws, { b: "lead", key: "ld-1", name: "ООО «Север»", contact: "+7 (911) 555-34-21", source: "Звонок", dupKey: null, merged: 1, createdAt: t });
      await addItem(ws, { b: "lead", key: "ld-2", name: "ИП Морозова", contact: "@morozova_ip", source: "Telegram", dupKey: null, merged: 1, createdAt: t });
      await addItem(ws, { b: "lead", key: "ld-3", name: "«Север», снабжение", contact: "8 911 555 34 21", source: "Авито", dupKey: "ld-1", merged: 1, createdAt: t });
      break;
    /* ---- конкуренты ---- */
    case "rivalmap":
      await addItem(ws, { b: "comp", key: "c1", name: "Студия «Барельеф»" });
      await addItem(ws, { b: "comp", key: "c2", name: "«МастерПласт»" });
      await addItem(ws, { b: "change", compKey: "c1", type: "price", text: "Подняли прайс на вывески ~12% — в прайсе на сайте новые цифры за август", createdAt: t });
      await addItem(ws, { b: "change", compKey: "c2", type: "promo", text: "Запустили «монтаж в подарок» при заказе от 150 тыс. — баннер на главной", createdAt: t });
      await addItem(ws, { b: "change", compKey: "c1", type: "service", text: "Добавили световые короба в линейку — раньше только буквы", createdAt: t });
      break;
    /* ---- цепочка черновиков ---- */
    case "ideathread":
      await addItem(ws, {
        b: "idea",
        idea: "Гости спрашивают «что без глютена» чаще, чем мы меняем меню — стоп-лист должен быть на виду у зала",
        drafts: [
          { kind: "thesis", label: "Тезис", text: "Стоп-лист на виду экономит залу до 20 разъяснений в смену — и гость видит заботу до того, как спросил.", statusIdx: 2 },
          { kind: "review", label: "Разбор", text: "Разбор нашей недели: три вопроса про безглютеновое, одно разочарование и вывод про видимость списка в зале.", statusIdx: 1 },
          { kind: "story", label: "История", text: "История проекта: как кофейня у метро увела тему аллергий из кассовых разборов в отдельную табличку у входа.", statusIdx: 0 }
        ],
        createdAt: t
      });
      break;
    /* ---- тендеры: лента статичная, общим является только фильтр и отметки ---- */
    case "tenderfit":
      await addItem(ws, { b: "meta", v: { types: ["Монтаж"], regions: ["Москва и МО"], minBudget: 500000, marks: {} } });
      break;
    default:
      break; // briefbox / onboardone / shifthandover сидятся своими компонентами
  }
}
