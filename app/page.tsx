import { ArrowDownRight, ArrowUpRight, Phone, Sparkles } from "lucide-react";
import ProblemForm from "../components/ProblemForm";
import HeroEnhanced from "../components/HeroEnhanced";
import FlowDiagram from "../components/FlowDiagrams";
import { catalogueTools, coreTools, microSaas } from "../components/microSaas";
import { CasePrefill, DiagnosisCards, ProcessSteps, Reveal } from "../components/Interactive";

export default function Home() {
  return <main>
    <header className="top"><a className="brand" href="#top">ЭЙ АЙ, <em>БОЛЬНО</em></a><div className="topRight"><span>МИКРОИНСТРУМЕНТЫ / 14</span><a href="https://t.me/bloodaman" target="_blank" rel="noreferrer">TELEGRAM ↗</a></div></header>
    <section className="hero" id="top">
      <div className="knot"><div className="knotFallback"><i /><i /><i /><i /></div><HeroEnhanced /></div>
      <div className="heroCopy"><p className="eyebrow"><span /> Каталог микроинструментов для малого бизнеса</p><h1>Бизнесу не нужна<br />ещё одна система.<br /><em>Ему больно</em> терять<span className="h1Tail"><br />одно и то же.</span></h1><p className="heroText">Заявки тонут в чатах. Новичков учат по памяти. Смены передают на словах. Мы собираем заявки на микроинструменты, которые распутывают одну ручную операцию за раз.</p><a href="#form" className="button">Описать боль <ArrowDownRight size={18} /></a><a href="#details" className="buttonGhost">Смотреть каталог <ArrowDownRight size={18} /></a></div>
      <p className="heroFoot">СОБИРАЕМ ЗАЯВКИ НА РАЗРАБОТКУ<br />ОТВЕТИМ В ТЕЧЕНИЕ ДНЯ</p>
    </section>
    <section className="diagnosis" id="diagnosis">
      <Reveal><p className="sectionNo">01 / ДИАГНОЗ</p><h2>Хаос не появляется<br />вдруг. Он <em>копится.</em></h2></Reveal>
      <DiagnosisCards />
      <Reveal><p className="diagnosisEnd">Не нужен монстр ради одной дырявой операции. Найдите свою боль — соберём для неё маленький инструмент. Ниже пятнадцать таких болей: три в очереди на разработку, остальные ждут заявок.</p>
      <div className="diagnosisCtas"><a href="#form" className="button buttonLime">Описать свою боль <ArrowDownRight size={18} /></a><a href="#details" className="ghostLight">Смотреть 15 узлов <ArrowDownRight size={18} /></a></div></Reveal>
    </section>
    <section className="solutions" id="solutions">
      <Reveal className="solutionCol"><div className="solutionIntro"><p className="sectionNo">02 / ПЕРВЫЕ УЗЛЫ</p><h2>Начнём с того,<br />что <em>болит каждый день.</em></h2><p className="introText">Заявки, новички, смены — три операции, которые ломаются чаще всего. Они первые в нашей очереди на разработку.</p><a href="#form" className="buttonGhost introCta">Сразу описать боль <ArrowDownRight size={18} /></a></div></Reveal>
      <div>{coreTools.map((tool, index) => <Reveal key={tool.id} delay={index * 90}><article className="solution"><span>{tool.num}</span><div><p className="solutionName">{tool.name}</p><h3>{tool.short?.title}</h3><p>{tool.short?.text}</p><p className="solutionAud">Кому подходит: {tool.audience}</p><div className="solutionCtas"><a href="#form">Хочу разобрать этот процесс <ArrowUpRight size={16} /></a><a href={`#${tool.id}`}>Что внутри <ArrowDownRight size={16} /></a></div></div></article></Reveal>)}</div>
    </section>
    <section className="catalogue" id="catalogue">
      <Reveal className="catalogueCol"><div className="catalogueSticky"><p className="sectionNo">03 / В РАБОТЕ</p><h2>Другие боли тоже<br /><em>не обязаны жить</em><br />в таблицах.</h2><p className="catalogueHint">Строка — ссылка на полное описание: ситуация, боль, план пилота, три шага. Наведите — увидите суть одной фразой.</p></div></Reveal>
      <div>
        <div className="catalogueList">{catalogueTools.map((tool, index) => <Reveal key={tool.id} delay={index * 40}><a href={`#${tool.id}`}><span>{tool.num}</span><div className="catMain">{tool.name}<small className="catPain">{tool.painShort}</small></div><small className="catTag">Проверяем спрос <ArrowUpRight size={14} /></small></a></Reveal>)}</div>
        <Reveal><div className="catalogueCta"><a href="#form" className="button">Моей боли нет в списке <ArrowUpRight size={18} /></a><p>Опишите её в форме — такие запросы берём в работу первыми.</p></div></Reveal>
      </div>
    </section>
    <section className="details" id="details">
      <Reveal><div className="detailsHead"><div><p className="sectionNo">04 / КАТАЛОГ В ДЕТАЛЯХ</p><h2>Пятнадцать узлов.<br />Каждый — <em>по-своему.</em></h2></div><p>У каждого инструмента — одна ситуация, одна боль, честный план пилота и три шага. Это заявки на разработку, а не готовые сервисы. Узнали свою ситуацию? Кнопка «Это моя боль» сама подставит заготовку в форму — допишите детали и отправьте.</p></div></Reveal>
      <div className="caseList">{microSaas.map((tool) => <section className="case" id={tool.id} key={tool.id} aria-labelledby={`${tool.id}-title`}><header className="caseHead"><span className="caseNum">{tool.num}</span><div><p className="caseName">{tool.name}<span className="detailStatus">{tool.core ? "Первый в очереди на разработку" : "Проверяем спрос"}</span></p><h3 id={`${tool.id}-title`}>{tool.title}</h3></div></header><div className="caseBody"><div><p className="caseLabel">РЕАЛЬНАЯ СИТУАЦИЯ</p><p className="caseText">{tool.situation}</p><p className="caseLabel">БОЛЬ БИЗНЕСА</p><p className="caseText caseBiz">{tool.bizPain}</p><p className="caseAudience">Кому подходит: {tool.audience}</p></div><div className="caseFlow"><p className="caseLabel">ВХОД → ДЕЙСТВИЕ → ВИДИМЫЙ РЕЗУЛЬТАТ</p><FlowDiagram id={tool.id} /></div></div><div className="caseGrid"><div className="casePilot"><p className="caseLabel">ЧТО ПРОВЕРЯЕМ В ПИЛОТЕ</p><p className="caseText">{tool.pilot}</p></div><div className="caseSteps"><p className="caseLabel">ТРИ ШАГА РАБОТЫ</p><ol>{tool.steps.map((step, index) => <li key={step.title}><span>{index + 1}</span><div><b>{step.title}</b><p>{step.text}</p></div></li>)}</ol></div></div><div className="caseActions"><a className="button caseCta" href="#form">Описать похожую боль <ArrowUpRight size={18} /></a><CasePrefill name={tool.name} /></div></section>)}</div>
    </section>
    <section className="process" id="process">
      <Reveal><p className="sectionNo">05 / БЕЗ МАГИИ</p><div className="processTitle"><h2>Не обещаем<br />«подключить завтра».<br /><em>Сначала поймём.</em></h2><p>Это не коробка и не внедрение на полгода. Наведите на шаг — видно, что нужно от вас и что от нас.</p></div></Reveal>
      <ProcessSteps />
      <Reveal><div className="processCta"><a className="button" href="#form">Начать с первого шага <ArrowDownRight size={18} /></a><p>Первый шаг — это форма ниже: одна операция и один живой пример.</p></div></Reveal>
    </section>
    <section className="formSection" id="form">
      <Reveal><div className="formLead"><p className="sectionNo">06 / ВАША ОЧЕРЕДЬ</p><h2>Назовите одну<br />операцию, от которой<br /><em>уже больно.</em></h2><p>Не будем продавать систему на полгода внедрения. Сначала поймём, можно ли распутать именно ваш узел.</p>
        <ul className="howCheck">
          <li><span>1</span>Что именно ломается — одна операция, а не «всё сразу».</li>
          <li><span>2</span>Как часто это повторяется — каждый день, каждую смену?</li>
          <li><span>3</span>Кто делает это руками сейчас — вы, менеджер, вся смена?</li>
        </ul>
        <a className="contact" href="tel:+79037275131"><Phone size={18} /> +7 903 727-51-31</a><a className="contact" href="https://t.me/bloodaman" target="_blank" rel="noreferrer"><Sparkles size={18} /> @bloodaman в Telegram</a><p className="formPromise">ОТВЕТИМ В ТЕЧЕНИЕ ДНЯ — С ВОПРОСАМИ<br />ИЛИ ЧЕСТНЫМ «ЭТО НЕ НАШ СЛУЧАЙ»</p></div></Reveal>
      <Reveal delay={140}><ProblemForm /></Reveal>
    </section>
    <section className="faq" id="faq">
      <Reveal><p className="sectionNo">07 / БЕЗ МЕЛКОГО ШРИФТА</p></Reveal>
      <Reveal><details><summary>Это уже готовые сервисы?<span>+</span></summary><p>Нет. Мы собираем заявки, чтобы брать в разработку самые повторяющиеся и дорогие процессы. Поэтому статусы честные: «первый в очереди» или «проверяем спрос».</p></details></Reveal>
      <Reveal><details><summary>Сколько стоит пилот?<span>+</span></summary><p>Фиксированного прайса нет: объём зависит от процесса. Условия называем после разбора — до начала работы, а не после. Заявка ни к чему не обязывает.</p></details></Reveal>
      <Reveal><details><summary>Моей боли нет в каталоге. Стоит писать?<span>+</span></summary><p>Да. Каталог — то, что уже назвали другие. Ваша операция повторяется и дорого обходится? Опишите её — такие запросы берём первыми.</p></details></Reveal>
      <Reveal><details><summary>Вы подключаетесь к CRM, 1С или Telegram?<span>+</span></summary><p>Способ интеграции обсуждаем после разбора процесса. До технической оценки ничего не обещаем.</p></details></Reveal>
      <Reveal><details><summary>А если у нас уже есть CRM или 1С?<span>+</span></summary><p>Менять её не предлагаем: микроинструмент закрывает узел, до которого большой системе нет дела. Если ваш узел уже закрывает имеющаяся CRM — скажем прямо.</p></details></Reveal>
      <Reveal><details><summary>Можно прислать базу клиентов или документы?<span>+</span></summary><p>Не через эту форму. На первом шаге достаточно описания процесса — без чувствительных данных.</p></details></Reveal>
      <Reveal><details><summary>Что будет после отправки заявки?<span>+</span></summary><p>Читаем и отвечаем в течение дня — с вопросами о процессе. Без рассылок, звонков «с предложением» и передачи контактов.</p></details></Reveal>
      <Reveal><details><summary>Как быстро вы отвечаете?<span>+</span></summary><p>В течение дня.</p></details></Reveal>
      <Reveal><div className="faqCta"><a className="button" href="#form">Остался вопрос — опишите его <ArrowUpRight size={18} /></a><p>Или напишите в Telegram: @bloodaman. Отвечаем в течение дня.</p></div></Reveal>
    </section>
    <footer>
      <div className="footCol"><a className="brand" href="#top">ЭЙ АЙ, <em>БОЛЬНО</em></a><p>Одна ручная операция — за раз. Собираем заявки на разработку микроинструментов для малого бизнеса.</p><p className="footNote">САЙТ РАБОТАЕТ ПО ПРЕДЗАЯВКАМ<br />ОТВЕЧАЕМ В ТЕЧЕНИЕ ДНЯ</p></div>
      <nav className="footNav" aria-label="Разделы сайта"><a href="#diagnosis">Диагноз</a><a href="#solutions">Первые узлы</a><a href="#catalogue">Каталог</a><a href="#process">Как мы работаем</a><a href="#form">Описать боль</a><a href="#faq">Вопросы</a><a href="#top">Наверх ↑</a></nav>
      <div className="footCol footContacts"><a href="tel:+79037275131">+7 903 727-51-31</a><a href="https://t.me/bloodaman" target="_blank" rel="noreferrer">@bloodaman в Telegram</a></div>
    </footer>
  </main>;
}
