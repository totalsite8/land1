import type { MetadataRoute } from "next";
import { microSaas } from "../components/microSaas";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return [];
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...microSaas.map((item) => ({ url: `${siteUrl}/demo/${item.id}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 }))
  ];
}
