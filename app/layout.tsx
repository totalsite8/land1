import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: "Эй Ай, Больно — микроинструменты против операционного хаоса",
  description: "Оставьте заявку на разработку микроинструмента для одного ручного процесса в вашем бизнесе.",
  robots: { index: Boolean(siteUrl), follow: Boolean(siteUrl) },
  openGraph: { title: "Эй Ай, Больно", description: "Распутываем один ручной процесс за раз.", url: siteUrl, siteName: "Эй Ай, Больно", locale: "ru_RU", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
