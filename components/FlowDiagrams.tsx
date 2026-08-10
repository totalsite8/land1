import type { ReactElement, ReactNode } from "react";

type FrameProps = { uid: string; label: string; children: ReactNode };

function Frame({ uid, label, children }: FrameProps) {
  const marker = `flow-arrow-${uid}`;
  return (
    <svg className="flowSvg" viewBox="0 0 660 220" role="img" aria-label={label}>
      <defs>
        <marker id={marker} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L8 4L0 8Z" fill="#151714" />
        </marker>
      </defs>
      {children}
      <line x1="220" y1="14" x2="220" y2="180" className="flSep" />
      <line x1="440" y1="14" x2="440" y2="180" className="flSep" />
      <line x1="180" y1="96" x2="212" y2="96" className="flLink" markerEnd={`url(#${marker})`} />
      <line x1="400" y1="96" x2="432" y2="96" className="flLink" markerEnd={`url(#${marker})`} />
      <text x="110" y="206" className="flZone">ВХОД</text>
      <text x="330" y="206" className="flZone">ДЕЙСТВИЕ</text>
      <text x="550" y="206" className="flZone">ВИДИМЫЙ РЕЗУЛЬТАТ</text>
    </svg>
  );
}

function BriefBoxFlow() {
  return (
    <Frame uid="briefbox" label="Вход: фрагменты заявки из звонка, чата и голосового. Действие: одна структура заявки. Результат: заявка видна целиком.">
      <rect x="30" y="32" width="26" height="46" rx="5" className="fl" />
      <line x1="39" y1="70" x2="47" y2="70" className="fl" />
      <text x="24" y="94" className="flCap">звонок</text>
      <path d="M84 34h56v28h-32l-10 10v-10h-14z" className="fl" />
      <text x="108" y="53" className="flQ">?</text>
      <text x="84" y="94" className="flCap">чат</text>
      <line x1="40" y1="128" x2="40" y2="114" className="fl" />
      <line x1="50" y1="132" x2="50" y2="108" className="fl" />
      <line x1="60" y1="126" x2="60" y2="116" className="fl" />
      <line x1="70" y1="130" x2="70" y2="106" className="fl" />
      <text x="84" y="124" className="flCap">голосовое</text>
      <text x="24" y="156" className="flCap">фрагменты из трёх каналов</text>
      <rect x="256" y="32" width="124" height="128" rx="3" className="fl" />
      <line x1="268" y1="50" x2="340" y2="50" className="fl" />
      <rect x="268" y="64" width="100" height="10" className="flField" />
      <rect x="268" y="84" width="100" height="10" className="flField" />
      <rect x="268" y="104" width="100" height="10" className="flField" />
      <rect x="268" y="124" width="70" height="10" className="flField" />
      <text x="256" y="178" className="flCap">одна структура заявки</text>
      <rect x="478" y="32" width="124" height="128" rx="3" className="fl" />
      <line x1="490" y1="50" x2="560" y2="50" className="fl" />
      <rect x="490" y="64" width="100" height="10" className="flLime" />
      <rect x="490" y="84" width="100" height="10" className="flLime" />
      <rect x="490" y="104" width="100" height="10" className="flLime" />
      <rect x="490" y="124" width="70" height="10" className="flLime" />
      <circle cx="588" cy="46" r="9" className="flLime" />
      <path d="M584 46l3 3 6-7" className="fl" />
      <text x="478" y="178" className="flCap">заявка видна целиком</text>
    </Frame>
  );
}

function OnboardOneFlow() {
  return (
    <Frame uid="onboardone" label="Вход: новичок без инструкции, в вопросах. Действие: маршрут первых дней из трёх шагов. Результат: новичок идёт по маршруту сам.">
      <circle cx="62" cy="58" r="9" className="fl" />
      <path d="M62 67v34M62 78l-16 12M62 78l16 12M62 101l-12 22M62 101l12 22" className="fl" />
      <text x="94" y="50" className="flQ">?</text>
      <text x="106" y="78" className="flQ">?</text>
      <text x="92" y="106" className="flQ">?</text>
      <text x="30" y="152" className="flCap">новичок без инструкции</text>
      <path d="M252 148c30 0 22-52 52-52s30 44 52 26 24-56 36-68" className="flMuted" strokeDasharray="4 4" />
      <circle cx="252" cy="148" r="11" className="flLime" />
      <text x="249" y="152">1</text>
      <circle cx="312" cy="100" r="11" className="flLime" />
      <text x="309" y="104">2</text>
      <circle cx="390" cy="52" r="11" className="flLime" />
      <text x="387" y="56">3</text>
      <text x="245" y="178" className="flCap">маршрут первых дней для роли</text>
      <circle cx="500" cy="58" r="9" className="fl" />
      <path d="M500 67v34M500 78l-16 12M500 78l15 13M500 101l-12 22M500 101l12 22" className="fl" />
      <line x1="562" y1="128" x2="562" y2="42" className="fl" />
      <path d="M562 42h34l-9 11 9 11h-34z" className="flLime" />
      <text x="470" y="152" className="flCap">идёт по маршруту сам,</text>
      <text x="470" y="164" className="flCap">без «спроси у Лены»</text>
    </Frame>
  );
}

function ShiftHandoverFlow() {
  return (
    <Frame uid="shifthandover" label="Вход: задачи, остатки и инциденты в голове уходящего. Действие: один список при передаче смены. Результат: следующая смена видит состояние дел.">
      <circle cx="60" cy="60" r="15" className="fl" />
      <path d="M42 122c4-14 32-14 36 0" className="fl" />
      <rect x="96" y="34" width="62" height="18" rx="3" className="flMuted" />
      <text x="103" y="47">задача</text>
      <rect x="104" y="62" width="66" height="18" rx="3" className="flMuted" />
      <text x="111" y="75">остаток</text>
      <rect x="98" y="90" width="76" height="18" rx="3" className="flMuted" />
      <text x="104" y="103">инцидент</text>
      <path d="M76 52l18-10M78 66l24 4M76 80l20 18" className="flMuted" strokeDasharray="2 3" />
      <text x="30" y="152" className="flCap">всё важное — в голове уходящего</text>
      <circle cx="262" cy="70" r="8" className="fl" />
      <path d="M262 78v26M250 118c2-10 22-10 24 0" className="fl" />
      <circle cx="382" cy="70" r="8" className="fl" />
      <path d="M382 78v26M370 118c2-10 22-10 24 0" className="fl" />
      <rect x="292" y="52" width="60" height="66" rx="3" className="fl" />
      <rect x="300" y="62" width="44" height="6" className="flLime" />
      <rect x="300" y="76" width="44" height="6" className="flLime" />
      <rect x="300" y="90" width="30" height="6" className="flLime" />
      <line x1="274" y1="84" x2="288" y2="84" className="flLink" />
      <line x1="356" y1="84" x2="370" y2="84" className="flLink" />
      <text x="252" y="152" className="flCap">один список при передаче смены</text>
      <rect x="478" y="40" width="124" height="100" rx="3" className="fl" />
      <text x="490" y="60">смена приняла:</text>
      <circle cx="495" cy="76" r="6" className="flLime" />
      <rect x="506" y="72" width="82" height="7" className="flField" />
      <circle cx="495" cy="96" r="6" className="flLime" />
      <rect x="506" y="92" width="82" height="7" className="flField" />
      <circle cx="495" cy="116" r="6" className="flLime" />
      <rect x="506" y="112" width="60" height="7" className="flField" />
      <text x="478" y="162" className="flCap">следующая смена видит состояние дел</text>
    </Frame>
  );
}

function ForumLeadFlow() {
  return (
    <Frame uid="forumlead" label="Вход: разрозненные вопросы в чатах и на форумах. Действие: фильтр по вашей теме. Результат: подборка вопросов на день с кнопкой ответить.">
      <path d="M28 32h56v26h-32l-9 9v-9h-15z" className="flMuted" />
      <text x="50" y="50" className="flQ">?</text>
      <path d="M104 60h56v26h-32l-9 9v-9h-15z" className="flMuted" />
      <text x="126" y="78" className="flQ">?</text>
      <path d="M36 98h62v26h-36l-9 9v-9h-17z" className="flMuted" />
      <text x="60" y="116" className="flQ">?</text>
      <text x="28" y="156" className="flCap">вопросы в чатах и на форумах</text>
      <path d="M258 38h128l-44 58v34h-40v-34z" className="fl" />
      <circle cx="276" cy="56" r="3" fill="#b7b5ad" />
      <circle cx="360" cy="52" r="3" fill="#b7b5ad" />
      <circle cx="322" cy="142" r="4" className="flHot" />
      <circle cx="322" cy="156" r="4" className="flHot" />
      <text x="250" y="178" className="flCap">фильтр: спрашивают про вас</text>
      <rect x="472" y="38" width="160" height="48" rx="3" className="fl" />
      <text x="482" y="56">«Кто делает вывески?»</text>
      <rect x="482" y="64" width="54" height="15" className="flLime" />
      <text x="490" y="75" className="flS">ответить</text>
      <rect x="472" y="96" width="160" height="48" rx="3" className="fl" />
      <text x="482" y="114">«Посоветуйте подрядчика»</text>
      <rect x="482" y="122" width="54" height="15" className="flLime" />
      <text x="490" y="133" className="flS">ответить</text>
      <text x="472" y="164" className="flCap">подборка вопросов на день</text>
    </Frame>
  );
}

function RivalMapFlow() {
  return (
    <Frame uid="rivalmap" label="Вход: публичные цены и акции конкурентов. Действие: наблюдение и фиксация изменений. Результат: сводка, у кого что поменялось.">
      <rect x="28" y="32" width="142" height="34" rx="3" className="fl" />
      <text x="38" y="47">Конкурент A</text>
      <text x="38" y="60" className="flCap">услуга — 1 200 ₽</text>
      <rect x="28" y="74" width="142" height="34" rx="3" className="fl" />
      <text x="38" y="89">Конкурент B</text>
      <text x="38" y="102" className="flCap">услуга — 1 500 ₽</text>
      <rect x="28" y="116" width="142" height="34" rx="3" className="flHotB" />
      <text x="38" y="131">Конкурент C</text>
      <text x="38" y="144" className="flHotT">цена: 1 100 → 990 ₽</text>
      <rect x="262" y="40" width="30" height="30" className="flMuted" />
      <rect x="294" y="40" width="30" height="30" className="flMuted" />
      <rect x="326" y="40" width="30" height="30" className="flMuted" />
      <rect x="262" y="72" width="30" height="30" className="flMuted" />
      <rect x="294" y="72" width="30" height="30" className="flLime" />
      <circle cx="309" cy="87" r="4" className="flHot" />
      <rect x="326" y="72" width="30" height="30" className="flMuted" />
      <rect x="262" y="104" width="30" height="30" className="flMuted" />
      <rect x="294" y="104" width="30" height="30" className="flMuted" />
      <rect x="326" y="104" width="30" height="30" className="flMuted" />
      <text x="250" y="156" className="flCap">фиксируем изменения</text>
      <text x="250" y="168" className="flCap">раз в неделю</text>
      <rect x="470" y="36" width="166" height="106" rx="3" className="fl" />
      <text x="480" y="54">Что изменилось</text>
      <circle cx="484" cy="68" r="3" className="flHot" />
      <text x="492" y="72">C: цена 1 100 → 990 ₽</text>
      <circle cx="484" cy="88" r="3" className="flHot" />
      <text x="492" y="92">A: новая акция на услугу</text>
      <circle cx="484" cy="108" r="3" fill="#b7b5ad" />
      <text x="492" y="112" className="flCap">B: без изменений</text>
      <text x="470" y="164" className="flCap">сводка для решения, а не копирования</text>
    </Frame>
  );
}

function PartnerReachFlow() {
  return (
    <Frame uid="partnerreach" label="Вход: договорённость с партнёром, записанная в голове. Действие: напоминание с поводом написать. Результат: контакт возобновлён.">
      <rect x="28" y="44" width="146" height="80" rx="3" className="fl" />
      <text x="38" y="66">Май: договорились</text>
      <text x="38" y="80">обмениваться лидами</text>
      <text x="38" y="102" className="flCap">…записано «в голове»</text>
      <text x="28" y="152" className="flCap">договорённость без следа</text>
      <rect x="278" y="40" width="104" height="92" rx="3" className="fl" />
      <line x1="278" y1="60" x2="382" y2="60" className="fl" />
      <text x="288" y="54">июль</text>
      <circle cx="292" cy="74" r="2" fill="#b7b5ad" />
      <circle cx="314" cy="74" r="2" fill="#b7b5ad" />
      <circle cx="358" cy="74" r="2" fill="#b7b5ad" />
      <circle cx="292" cy="92" r="2" fill="#b7b5ad" />
      <circle cx="314" cy="92" r="2" fill="#b7b5ad" />
      <circle cx="358" cy="92" r="2" fill="#b7b5ad" />
      <circle cx="336" cy="92" r="7" className="flLime" />
      <circle cx="292" cy="110" r="2" fill="#b7b5ad" />
      <circle cx="314" cy="110" r="2" fill="#b7b5ad" />
      <circle cx="336" cy="110" r="2" fill="#b7b5ad" />
      <circle cx="358" cy="110" r="2" fill="#b7b5ad" />
      <path d="M394 52c0-9 14-9 14 0v9l4 4h-22l4-4z" className="fl" />
      <path d="M416 46c5 5 5 12 0 17" className="flHotS" />
      <text x="250" y="156" className="flCap">напоминание: пора написать,</text>
      <text x="250" y="168" className="flCap">и повод для сообщения</text>
      <path d="M470 38h162v30h-98l-9 10v-10h-55z" className="fl" />
      <text x="480" y="57" className="flS">«Договорились в мае — в силе?»</text>
      <path d="M492 84h140v30h-88l-9 10v-10h-43z" className="fl" />
      <text x="502" y="103" className="flS">«Да, давай обсудим»</text>
      <circle cx="484" cy="136" r="7" className="flLime" />
      <path d="M480 136l3 3 5-6" className="fl" />
      <text x="498" y="140">контакт возобновлён</text>
      <text x="470" y="164" className="flCap">партнёрка снова в работе</text>
    </Frame>
  );
}

function TenderFitFlow() {
  return (
    <Frame uid="tenderfit" label="Вход: сотни новых тендеров в день. Действие: фильтр по вашим критериям. Результат: короткий список подходящих на день.">
      <rect x="28" y="34" width="54" height="26" rx="3" className="flMuted" />
      <rect x="92" y="28" width="54" height="26" rx="3" className="flMuted" />
      <rect x="48" y="68" width="54" height="26" rx="3" className="flMuted" />
      <rect x="112" y="76" width="54" height="26" rx="3" className="flMuted" />
      <rect x="34" y="106" width="54" height="26" rx="3" className="flMuted" />
      <rect x="98" y="116" width="54" height="26" rx="3" className="flMuted" />
      <text x="28" y="160" className="flCap">сотни новых тендеров в день</text>
      <path d="M254 36h136l-46 58v30h-44v-30z" className="fl" />
      <text x="268" y="54">бюджет</text>
      <text x="278" y="72">регион</text>
      <text x="292" y="90" className="flS">тип работ</text>
      <circle cx="322" cy="138" r="4" className="flLime" />
      <circle cx="322" cy="152" r="4" className="flLime" />
      <text x="248" y="172" className="flCap">проходят только ваши критерии</text>
      <rect x="470" y="38" width="166" height="44" rx="3" className="fl" />
      <circle cx="486" cy="60" r="8" className="flLime" />
      <path d="M482 60l3 3 5-6" className="fl" />
      <text x="500" y="56">Ремонт офиса, до 1,2 млн</text>
      <text x="500" y="70" className="flCap">ваш регион · дедлайн 12.09</text>
      <rect x="470" y="92" width="166" height="44" rx="3" className="fl" />
      <circle cx="486" cy="114" r="8" className="flLime" />
      <path d="M482 114l3 3 5-6" className="fl" />
      <text x="500" y="110">Поставка мебели, 800 тыс.</text>
      <text x="500" y="124" className="flCap">подходит по типу работ</text>
      <text x="470" y="164" className="flCap">короткий список на день</text>
    </Frame>
  );
}

function PriceSignalFlow() {
  return (
    <Frame uid="pricesignal" label="Вход: издержки растут. Действие: сравнение с порогом маржи. Результат: сигнал, какую цену пора пересмотреть.">
      <line x1="36" y1="136" x2="180" y2="136" className="fl" />
      <line x1="36" y1="136" x2="36" y2="40" className="fl" />
      <polyline points="36,124 72,112 108,116 148,84 176,58" className="flHotS" />
      <text x="40" y="156" className="flCap">закупка и издержки растут</text>
      <rect x="262" y="44" width="26" height="96" className="fl" />
      <rect x="262" y="110" width="26" height="30" className="flLime" />
      <line x1="246" y1="86" x2="304" y2="86" className="flHotS" strokeDasharray="4 3" />
      <circle cx="275" cy="86" r="4" className="flHot" />
      <text x="308" y="82" className="flS">порог</text>
      <text x="308" y="93" className="flS">маржи</text>
      <path d="M344 52h44l14 14-14 14h-44z" className="fl" />
      <text x="356" y="71">цена</text>
      <text x="248" y="164" className="flCap">сравниваем с порогом, а не на глаз</text>
      <rect x="470" y="44" width="166" height="92" rx="3" className="fl" />
      <circle cx="486" cy="64" r="5" className="flHot" />
      <text x="498" y="68">Пора пересмотреть цену</text>
      <text x="482" y="92" className="flS">маржа позиции: 18% → 12%</text>
      <text x="482" y="108" className="flS">решение остаётся за вами</text>
      <text x="470" y="164" className="flCap">сигнал с расчётом, не автопереклейка</text>
    </Frame>
  );
}

function ReviewReplyFlow() {
  return (
    <Frame uid="reviewreply" label="Вход: отзывы с разных площадок, негатив ждёт ответа. Действие: одна очередь по сроку ожидания. Результат: ноль отзывов без ответа.">
      <rect x="28" y="32" width="146" height="32" rx="3" className="fl" />
      <text x="38" y="52" className="flHotT">★ 1 · Карты · ждёт 2 дня</text>
      <rect x="28" y="72" width="146" height="32" rx="3" className="fl" />
      <text x="38" y="92">★ 5 · Соцсети · ждёт день</text>
      <rect x="28" y="112" width="146" height="32" rx="3" className="fl" />
      <text x="38" y="132">★ 4 · Сайт · ждёт 3 часа</text>
      <text x="28" y="164" className="flCap">отзывы с разных площадок</text>
      <rect x="292" y="32" width="76" height="114" rx="3" className="fl" />
      <rect x="300" y="40" width="60" height="16" className="flHotB" />
      <rect x="300" y="64" width="60" height="16" className="flMuted" />
      <rect x="300" y="88" width="60" height="16" className="flMuted" />
      <text x="300" y="122" className="flS">ждут дольше</text>
      <text x="300" y="133" className="flS">всех — выше</text>
      <text x="252" y="166" className="flCap">одна очередь по сроку ожидания</text>
      <path d="M470 38h166v34h-104l-9 10v-10h-53z" className="fl" />
      <text x="480" y="59" className="flS">«Спасибо, уже исправили»</text>
      <circle cx="482" cy="112" r="8" className="flLime" />
      <path d="M478 112l3 3 5-6" className="fl" />
      <text x="496" y="116">0 отзывов без ответа</text>
      <text x="470" y="164" className="flCap">ответ вышел, пока отзыв ещё читают</text>
    </Frame>
  );
}

function DocChaserFlow() {
  return (
    <Frame uid="docchaser" label="Вход: документ где-то отправлен, статус неизвестен. Действие: доска статусов, видно что висит и у кого. Результат: закрытые документы уходят с доски.">
      <rect x="42" y="32" width="84" height="108" rx="3" className="fl" />
      <line x1="54" y1="52" x2="114" y2="52" className="flMuted" />
      <line x1="54" y1="66" x2="114" y2="66" className="flMuted" />
      <line x1="54" y1="80" x2="114" y2="80" className="flMuted" />
      <line x1="54" y1="94" x2="96" y2="94" className="flMuted" />
      <text x="76" y="126" className="flQ">?</text>
      <text x="30" y="160" className="flCap">акт «где-то отправлен»</text>
      <rect x="248" y="32" width="146" height="114" rx="3" className="fl" />
      <line x1="297" y1="32" x2="297" y2="146" className="flMuted" />
      <line x1="346" y1="32" x2="346" y2="146" className="flMuted" />
      <text x="254" y="48" className="flS">в работе</text>
      <text x="303" y="48" className="flS">ждёт</text>
      <text x="352" y="48" className="flS">просрочен</text>
      <rect x="254" y="56" width="36" height="22" rx="2" className="flMuted" />
      <rect x="254" y="84" width="36" height="22" rx="2" className="flMuted" />
      <rect x="303" y="56" width="36" height="22" rx="2" className="flMuted" />
      <rect x="352" y="56" width="36" height="22" rx="2" className="flHotB" />
      <text x="366" y="71" className="flHotT">!</text>
      <text x="248" y="164" className="flCap">видно, что висит и у кого</text>
      <rect x="478" y="32" width="84" height="108" rx="3" className="fl" />
      <line x1="490" y1="52" x2="550" y2="52" className="flMuted" />
      <line x1="490" y1="66" x2="550" y2="66" className="flMuted" />
      <line x1="490" y1="80" x2="550" y2="80" className="flMuted" />
      <rect x="490" y="94" width="60" height="20" className="flLime" />
      <text x="496" y="108" className="flS">подписан</text>
      <text x="470" y="158" className="flCap">закрытые уходят с доски —</text>
      <text x="470" y="170" className="flCap">висит только то, что висит</text>
    </Frame>
  );
}

function LeadDedupFlow() {
  return (
    <Frame uid="leaddedup" label="Вход: один клиент пришёл из трёх каналов как три записи. Действие: сверка по контакту, компании и смыслу. Результат: одна история клиента.">
      <rect x="26" y="32" width="150" height="30" rx="3" className="fl" />
      <text x="36" y="51">ООО «Весна» · форма</text>
      <rect x="26" y="70" width="150" height="30" rx="3" className="fl" />
      <text x="36" y="89">«Весна» · Telegram</text>
      <rect x="26" y="108" width="150" height="30" rx="3" className="fl" />
      <text x="36" y="127">+7 903 … · звонок</text>
      <text x="26" y="160" className="flCap">один клиент — три записи</text>
      <circle cx="305" cy="74" r="26" className="flMuted" />
      <circle cx="340" cy="74" r="26" className="flMuted" />
      <circle cx="322" cy="104" r="26" className="flMuted" />
      <circle cx="322" cy="84" r="9" className="flLime" />
      <text x="252" y="156" className="flS">сверяем контакт, компанию</text>
      <text x="252" y="168" className="flS">и суть запроса</text>
      <rect x="474" y="52" width="162" height="52" rx="3" className="fl" />
      <text x="486" y="74">ООО «Весна» · одна история</text>
      <text x="486" y="90" className="flCap">2 дубля помечены до работы</text>
      <text x="474" y="164" className="flCap">менеджеры не делят клиента</text>
    </Frame>
  );
}

function InvoiceNudgeFlow() {
  return (
    <Frame uid="invoicenudge" label="Вход: работа сдана, счёт двадцать дней без оплаты. Действие: цепочка вежливых напоминаний по графику. Результат: оплачено, отношения целы.">
      <rect x="34" y="36" width="104" height="84" rx="3" className="fl" />
      <text x="46" y="58">Счёт №14</text>
      <line x1="46" y1="70" x2="126" y2="70" className="flMuted" />
      <line x1="46" y1="82" x2="126" y2="82" className="flMuted" />
      <circle cx="118" cy="106" r="15" className="fl" />
      <path d="M118 98v8l6 4" className="fl" />
      <text x="34" y="150" className="flCap">работа сдана —</text>
      <text x="34" y="162" className="flCap">20 дней без оплаты</text>
      <rect x="252" y="116" width="46" height="20" rx="4" className="fl" />
      <text x="260" y="130" className="flS">день 5</text>
      <rect x="306" y="86" width="52" height="22" rx="4" className="fl" />
      <text x="312" y="101" className="flS">день 12</text>
      <rect x="360" y="52" width="58" height="24" rx="4" className="flLime" />
      <text x="366" y="68" className="flS">день 18</text>
      <line x1="298" y1="118" x2="308" y2="106" className="flMuted" />
      <line x1="358" y1="88" x2="368" y2="76" className="flMuted" />
      <text x="248" y="164" className="flCap">вежливо, по графику, без коллектора</text>
      <rect x="478" y="36" width="104" height="84" rx="3" className="fl" />
      <text x="490" y="58">Счёт №14</text>
      <line x1="490" y1="70" x2="570" y2="70" className="flMuted" />
      <line x1="490" y1="82" x2="570" y2="82" className="flMuted" />
      <g transform="rotate(-8 530 100)">
        <rect x="496" y="88" width="72" height="24" className="flLime" />
        <text x="504" y="104">ОПЛАЧЕНО</text>
      </g>
      <text x="478" y="152" className="flCap">деньги пришли —</text>
      <text x="478" y="164" className="flCap">отношения целы</text>
    </Frame>
  );
}

function StockAlertFlow() {
  return (
    <Frame uid="stockalert" label="Вход: остатки ходовой позиции на исходе. Действие: сигнал при пересечении минимума. Результат: список закупки со сроком.">
      <line x1="30" y1="140" x2="182" y2="140" className="fl" />
      <line x1="30" y1="100" x2="182" y2="100" className="flHotS" strokeDasharray="4 3" />
      <text x="30" y="94" className="flS">минимум</text>
      <rect x="40" y="56" width="24" height="84" className="flMuted" />
      <rect x="76" y="76" width="24" height="64" className="flMuted" />
      <rect x="112" y="96" width="24" height="44" className="fl" />
      <rect x="148" y="122" width="24" height="18" className="flHotB" />
      <text x="30" y="160" className="flCap">ходовая позиция на исходе</text>
      <line x1="250" y1="140" x2="400" y2="140" className="fl" />
      <rect x="300" y="70" width="34" height="70" className="fl" />
      <line x1="256" y1="95" x2="394" y2="95" className="flHotS" strokeDasharray="4 3" />
      <circle cx="317" cy="58" r="6" className="flHot" />
      <path d="M317 46v-8M303 50l-6-6M331 50l6-6" className="flHotS" />
      <text x="256" y="160" className="flCap">сигнал до нуля, а не после</text>
      <rect x="470" y="44" width="166" height="96" rx="3" className="fl" />
      <text x="482" y="64">Список закупки</text>
      <text x="482" y="86" className="flS">Топ-позиция — 20 шт</text>
      <text x="482" y="102" className="flS">Срок: до пятницы</text>
      <circle cx="486" cy="122" r="7" className="flLime" />
      <path d="M482 122l3 3 5-6" className="fl" />
      <text x="498" y="126" className="flS">успеваем до дефицита</text>
      <text x="470" y="164" className="flCap">закупка по движению, не по памяти</text>
    </Frame>
  );
}

function ThreadPilotFlow() {
  return (
    <Frame uid="threadpilot" label="Вход: клиент пишет в три канала сразу. Действие: открытые диалоги в одном поле. Результат: ноль диалогов без ответа.">
      <path d="M26 32h128v26h-78l-9 9v-9h-41z" className="fl" />
      <text x="36" y="50" className="flS">WhatsApp · «а доставка?»</text>
      <path d="M26 72h128v26h-78l-9 9v-9h-41z" className="fl" />
      <text x="36" y="90" className="flS">Telegram · «когда готово?»</text>
      <path d="M26 112h128v26h-78l-9 9v-9h-41z" className="fl" />
      <text x="36" y="130" className="flS">Почта · «нужен счёт»</text>
      <text x="26" y="164" className="flCap">клиент пишет туда, где удобно</text>
      <rect x="250" y="32" width="142" height="114" rx="3" className="fl" />
      <text x="260" y="54" className="flS">«а доставка?» — Аня</text>
      <line x1="260" y1="66" x2="382" y2="66" className="flMuted" />
      <text x="260" y="84" className="flS">«когда готово?» — в работе</text>
      <line x1="260" y1="96" x2="382" y2="96" className="flMuted" />
      <text x="260" y="114" className="flHotT">«нужен счёт» — ждёт 2 часа</text>
      <text x="250" y="164" className="flCap">открытые диалоги в одном поле</text>
      <circle cx="480" cy="52" r="7" className="flLime" />
      <path d="M476 52l3 3 5-6" className="fl" />
      <text x="492" y="56" className="flS">доставка — ответ за 12 минут</text>
      <circle cx="480" cy="82" r="7" className="flLime" />
      <path d="M476 82l3 3 5-6" className="fl" />
      <text x="492" y="86" className="flS">готовность — ответили в срок</text>
      <circle cx="480" cy="112" r="7" className="flLime" />
      <path d="M476 112l3 3 5-6" className="fl" />
      <text x="492" y="116" className="flS">счёт — ушёл в тот же день</text>
      <text x="470" y="148">0 диалогов без ответа</text>
      <text x="470" y="168" className="flCap">клиент не потерялся ни в одном канале</text>
    </Frame>
  );
}

const flows: Record<string, () => ReactElement> = {
  briefbox: BriefBoxFlow,
  onboardone: OnboardOneFlow,
  shifthandover: ShiftHandoverFlow,
  forumlead: ForumLeadFlow,
  rivalmap: RivalMapFlow,
  partnerreach: PartnerReachFlow,
  tenderfit: TenderFitFlow,
  pricesignal: PriceSignalFlow,
  reviewreply: ReviewReplyFlow,
  docchaser: DocChaserFlow,
  leaddedup: LeadDedupFlow,
  invoicenudge: InvoiceNudgeFlow,
  stockalert: StockAlertFlow,
  threadpilot: ThreadPilotFlow
};

export default function FlowDiagram({ id }: { id: string }) {
  const Flow = flows[id];
  return Flow ? <Flow /> : null;
}
