import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aibolno.ru"),
  title: "Эй Ай, Больно — микроинструменты против операционного хаоса",
  description: "Оставьте заявку на разработку микроинструмента для одного ручного процесса в вашем бизнесе.",
  openGraph: { title: "Эй Ай, Больно", description: "Распутываем один ручной процесс за раз.", url: "https://aibolno.ru", siteName: "Эй Ай, Больно", locale: "ru_RU", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
