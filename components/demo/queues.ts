import type { QueueConfig } from "./QueueDemo";

const m = 1000 * 60;

export const forumleadConfig: QueueConfig = {
  storage: "demo-forumlead",
  formTitle: "Вопрос из чата — в подборку",
  kindTabs: [
    { id: "chat", label: "Районный чат" },
    { id: "forum", label: "Форум" },
    { id: "agg", label: "Агрегатор" }
  ],
  fields: [
    { id: "q", label: "Вопрос клиента", placeholder: "Дословно, как спросили в чате", textarea: true, required: true },
    { id: "who", label: "Кто спрашивает", placeholder: "@ник или имя" },
    { id: "ctx", label: "Контекст обсуждения", placeholder: "Что уже ответили другие, ссылка на ветку", textarea: true }
  ],
  titleField: "q",
  addLabel: "В подборку на сегодня",
  note: "Отвечает человек с вашего аккаунта — автопостинга здесь нет и не будет. Вопросы, где ход мысли важнее скорости, отмечайте контекстом.",
  emptyText: "Подборка пуста. Вопросы по вашей теме идут в чатах каждый день — добавьте пару вручную, чтобы почувствовать ритм.",
  statuses: ["В подборке", "Ответ готовится", "Ответ дан"],
  verbs: ["Взять в ответ", "Отметить отвеченным"],
  closedLabel: "Вернуть в подборку",
  showAge: true,
  seed: [
    { id: "fl-1", kind: "chat", values: { q: "«Ребят, кто делает вывески со световыми буквами? Нужна 3×1 м на фасад»", who: "Марина, соседний ТЦ", ctx: "В треде уже два совета — один рекомендует конкурента" }, statusIdx: 0, createdAt: Date.now() - 41 * m },
    { id: "fl-2", kind: "forum", values: { q: "«Посоветуйте подрядчика по вентиляции для кофейни 80 м²»", who: "кофейня_на_хлебной", ctx: "Тема создана вчера, исполнителей пока нет" }, statusIdx: 1, createdAt: Date.now() - 26 * 60 * m }
  ]
};

export const reviewreplyConfig: QueueConfig = {
  storage: "demo-reviewreply",
  formTitle: "Отзыв — в очередь ответов",
  kindTabs: [
    { id: "maps", label: "Яндекс Карты" },
    { id: "2gis", label: "2ГИС" },
    { id: "otzovik", label: "Отзовик" }
  ],
  fields: [
    { id: "text", label: "Текст отзыва", placeholder: "Как есть, со всеми эмоциями", textarea: true, required: true },
    { id: "author", label: "Автор", placeholder: "Имя с площадки" },
    { id: "stars", label: "Оценка", placeholder: "1–5" }
  ],
  titleField: "text",
  addLabel: "В очередь ответов",
  note: "Очередь сама поднимает наверх те отзывы, что ждут дольше всех. Отвечает человек — инструмент только не даёт отзыву потеряться.",
  emptyText: "Очередь чиста — или отзывов нет, или они пока висят на площадках безответными. Обычно второе.",
  statuses: ["Ждёт ответа", "Ответ готовится", "Ответ опубликован"],
  verbs: ["Начать отвечать", "Отметить опубликованным"],
  closedLabel: "Вернуть в очередь",
  showAge: true,
  seed: [
    { id: "rr-1", kind: "maps", values: { text: "«Ждали заказ 50 минут, хотя зал был пустой. Кухня в порядке, но по времени — слабо»", author: "Дмитрий К.", stars: "3" }, statusIdx: 0, createdAt: Date.now() - 51 * 60 * m },
    { id: "rr-2", kind: "2gis", values: { text: "«Лучшие пироги в районе, персонал вежливый, всегда чисто»", author: "Ольга", stars: "5" }, statusIdx: 1, createdAt: Date.now() - 8 * 60 * m }
  ]
};

export const docchaserConfig: QueueConfig = {
  storage: "demo-docchaser",
  formTitle: "Документ в работе — на доску",
  fields: [
    { id: "doc", label: "Документ и контрагент", placeholder: "Акт №87 — ООО «Восход»", required: true },
    { id: "owner", label: "Ответственный", placeholder: "Кто гоняет за подписью" },
    { id: "due", label: "Срок подписания", kind: "date" }
  ],
  titleField: "doc",
  addLabel: "Поставить на доску",
  note: "Статусы обновляют сами ответственные — без ЭДО и интеграций. Просроченные подсвечиваются сами: с даты срока скрыться нельзя.",
  emptyText: "Доска пуста — либо все подписано, либо документы снова живут в переписках. Обычно второе.",
  statuses: ["Отправлен", "Напомнили", "На подписании", "Подписан"],
  verbs: ["Записать напоминание", "Ушёл на подписание", "Отметить подписанным"],
  closedLabel: "Вернуть в висящие",
  overdueField: "due",
  seed: [
    { id: "dc-1", values: { doc: "Акт №87 — ООО «Восход», монтаж за июль", owner: "Ира", due: "2026-08-05" }, statusIdx: 1, createdAt: Date.now() - 3 * 24 * 60 * m },
    { id: "dc-2", values: { doc: "Счёт-договор — ИП Заречный, повторная поставка", owner: "Саня", due: "2026-08-18" }, statusIdx: 0, createdAt: Date.now() - 24 * 60 * m }
  ]
};

export const invoicenudgeConfig: QueueConfig = {
  storage: "demo-invoicenudge",
  formTitle: "Неоплаченный счёт — в цепочку",
  fields: [
    { id: "client", label: "Клиент", placeholder: "ООО «Ладога»", required: true },
    { id: "sum", label: "Сумма счёта", placeholder: "48 000 ₽" },
    { id: "sent", label: "Дата отправки", kind: "date" }
  ],
  titleField: "client",
  addLabel: "В цепочку напоминаний",
  note: "Тон напоминаний уже задан: вежливый, без давления. Вы видите, кто платит после какого по счёту письма — цепочка подстраивается под реальность.",
  emptyText: "Неоплаченных счетов нет — редкий и приятный случай. Добавьте учебный, чтобы посмотреть цепочку.",
  statuses: ["Счёт отправлен", "Напоминание №1", "Напоминание №2", "Финальное", "Оплачен"],
  verbs: ["Отправить первое напоминание", "Отправить второе", "Финальное напоминание", "Отметить оплаченным"],
  closedLabel: "Вернуть в неоплаченные",
  seed: [
    { id: "in-1", values: { client: "ООО «Ладога» — счёт 112 за июль", sum: "96 400 ₽", sent: "2026-07-28" }, statusIdx: 2, createdAt: Date.now() - 9 * 24 * 60 * m },
    { id: "in-2", values: { client: "Студия «Меркатор» — брендинг, этап 2", sum: "150 000 ₽", sent: "2026-08-06" }, statusIdx: 1, createdAt: Date.now() - 4 * 24 * 60 * m }
  ]
};

export const partnerreachConfig: QueueConfig = {
  storage: "demo-partnerreach",
  formTitle: "Договорённость с партнёром",
  fields: [
    { id: "partner", label: "Партнёр", placeholder: "Анна, агентство «Профиль»", required: true },
    { id: "deal", label: "О чём договорились", placeholder: "Она приводит объекты, мы монтируем и делим чек", textarea: true },
    { id: "next", label: "Следующий контакт", kind: "date" }
  ],
  titleField: "deal",
  addLabel: "В список договорённостей",
  note: "Напоминание приходит с поводом: инструмент подсказывает, о чём писать, чтобы канал не остыл. Результат контакта отмечаете здесь же.",
  emptyText: "Список пуст — партнёрские каналы пока держатся на памяти. Именно так они и остывают.",
  statuses: ["Ждёт контакта", "Связались", "Канал работает"],
  verbs: ["Отметить контакт", "Канал ожил"],
  closedLabel: "Вернуть в список",
  overdueField: "next",
  seed: [
    { id: "pr-1", values: { partner: "Анна, агентство «Профиль»", deal: "Она приводит объекты HoReCa, мы делаем меню-борды и делим чек", next: "2026-08-07" }, statusIdx: 0, createdAt: Date.now() - 12 * 24 * 60 * m },
    { id: "pr-2", values: { partner: "Сергей, фотостудия «Кадр»", deal: "Взаимные рекомендации на съёмки для каталогов", next: "2026-08-20" }, statusIdx: 1, createdAt: Date.now() - 5 * 24 * 60 * m }
  ]
};

export const threadpilotConfig: QueueConfig = {
  storage: "demo-threadpilot",
  formTitle: "Открытый диалог — на поле",
  kindTabs: [
    { id: "tg", label: "Telegram" },
    { id: "wa", label: "WhatsApp" },
    { id: "mail", label: "Почта" },
    { id: "soc", label: "Соцсети" }
  ],
  fields: [
    { id: "client", label: "Клиент", placeholder: "Кто ждёт ответа", required: true },
    { id: "q", label: "Что ждут", placeholder: "Вопрос дословно или одной фразой", textarea: true, required: true }
  ],
  titleField: "q",
  addLabel: "В поле диалогов",
  note: "Мессенджеры не заменяем — отвечаете там, где привыкли. Здесь виден только долг: кто ждёт, сколько времени и в каком канале.",
  emptyText: "Долг по ответам нулевой. Так бывает редко — проверьте последний чат с клиентами.",
  statuses: ["Ждёт ответа", "Отвечен"],
  verbs: ["Отметить отвеченным"],
  closedLabel: "Вернуть в открытые",
  showAge: true,
  seed: [
    { id: "tp-1", kind: "tg", values: { client: "Татьяна, заказ штор", q: "«А когда замер? Мне важно до выходных»" }, statusIdx: 0, createdAt: Date.now() - 95 * m },
    { id: "tp-2", kind: "mail", values: { client: "Кафе «Юг», закупка", q: "Коммерческое предложение — прислать повторно, не дошло" }, statusIdx: 0, createdAt: Date.now() - 7 * 60 * m }
  ]
};

export const queueConfigs: Record<string, QueueConfig> = {
  forumlead: forumleadConfig,
  reviewreply: reviewreplyConfig,
  docchaser: docchaserConfig,
  invoicenudge: invoicenudgeConfig,
  partnerreach: partnerreachConfig,
  threadpilot: threadpilotConfig
};
