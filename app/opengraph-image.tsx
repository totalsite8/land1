import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const alt = "Эй Ай, Больно — микроинструменты против операционного хаоса";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

async function font(file: string) {
  return readFile(path.join(process.cwd(), "node_modules", "@fontsource", file));
}

export default async function OpengraphImage() {
  const [manrope800, manrope600, playfair] = await Promise.all([
    font("manrope/files/manrope-cyrillic-800-normal.woff"),
    font("manrope/files/manrope-cyrillic-600-normal.woff"),
    font("playfair-display/files/playfair-display-cyrillic-500-italic.woff")
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f1e9",
          padding: "64px 72px",
          color: "#151714",
          fontFamily: "Manrope"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: "0.14em", fontWeight: 600, color: "#4c5c14" }}>
            КАТАЛОГ МИКРОИНСТРУМЕНТОВ ДЛЯ МАЛОГО БИЗНЕСА
          </div>
          <div style={{ display: "flex", width: 16, height: 16, borderRadius: 999, background: "#ed4b36" }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", flexWrap: "wrap", fontSize: 72, fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.03em" }}>
              Бизнесу не нужна ещё одна&nbsp;
              <span style={{ fontFamily: "Playfair", fontStyle: "italic", fontWeight: 500, color: "#6e851d" }}>система</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 20, fontSize: 34, fontWeight: 600, color: "#3d3f39", lineHeight: 1.3 }}>
              <div style={{ display: "flex" }}>Ему нужно перестать терять одно и то же</div>
              <div style={{ display: "flex" }}>Распутываем один ручной процесс за раз</div>
            </div>
          </div>
          <svg width="240" height="240" viewBox="0 0 64 64">
            <g fill="none" stroke="#9bb839" strokeWidth="1.6">
              <ellipse cx="32" cy="32" rx="26" ry="12" transform="rotate(-24 32 32)" />
              <ellipse cx="32" cy="32" rx="26" ry="12" transform="rotate(28 32 32)" />
              <ellipse cx="32" cy="32" rx="12" ry="26" transform="rotate(8 32 32)" />
            </g>
            <line x1="12" y1="32" x2="2" y2="32" stroke="#151714" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="52" y1="32" x2="62" y2="32" stroke="#151714" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="32" cy="32" r="3.4" fill="#ed4b36" />
          </svg>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em" }}>
            Эй Ай&nbsp;<span style={{ fontFamily: "Playfair", fontStyle: "italic", fontWeight: 500, color: "#6e851d" }}>Больно</span>
          </div>
          <div style={{ display: "flex", gap: 14, fontSize: 22, fontWeight: 600, background: "#d9ff5a", padding: "14px 22px" }}>
            <span>Опишите боль</span>
            <span>Ответим в течение дня</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Manrope", data: manrope800, weight: 800, style: "normal" },
        { name: "Manrope", data: manrope600, weight: 600, style: "normal" },
        { name: "Playfair", data: playfair, weight: 500, style: "italic" }
      ]
    }
  );
}
