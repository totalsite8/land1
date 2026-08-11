# land1

Лендинг «Эй Ай, Больно» — каталог микроинструментов против операционного хаоса в малом бизнесе. Next.js 15 + React 19 + TypeScript, WebGL-hero как progressive enhancement.

## Структура

- `app/page.tsx` — лендинг: диагноз, первые узлы, каталог, подробные якорные блоки всех микроинструментов, процесс, форма, FAQ.
- `components/microSaas.ts` — единые данные каталога: все микроинструменты с подробностями (ситуация, боль, пилот, шаги, кому подходит).
- `components/ProblemForm.tsx` + `app/api/lead/route.ts` — форма заявок с отправкой в Telegram через серверный route.
- `landing-journey.html` — универсальная пошаговая инструкция для человека: создание лендинга в любой нише через Arena Agent Mode (не связана с этим продуктом).
- `AGENT-PLAYBOOK.txt` — универсальный плейбук для нейросети: прикрепляется к первому сообщению в Arena Agent Mode вместе с описанием ниши и ведёт проект по фазам до публикации.

## Локально

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Деплой на Vercel

Репозиторий готов к импорту в Vercel: Framework Preset — **Next.js**, Build Command — `npm run build`. Файл `vercel.json` задаёт заголовки безопасности и clean URLs.

После импорта добавьте в Settings → Environment Variables (никогда не храните их в Git):

| Переменная | Назначение |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | Токен бота для доставки заявок (после первого деплоя) |
| `TELEGRAM_CHAT_ID` | Чат для доставки заявок |
| `NEXT_PUBLIC_SITE_URL` | Фактический адрес сайта (Production + Preview + Development, затем Redeploy) |

Пока `NEXT_PUBLIC_SITE_URL` не задана, сайт закрыт от индексации: `robots.txt` и sitemap не публикуют тестовый адрес. После подключения домена обновите значение переменной и сделайте Redeploy.
