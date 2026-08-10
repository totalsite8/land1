import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export default function robots(): MetadataRoute.Robots {
  if (!siteUrl) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteUrl}/sitemap.xml`, host: siteUrl };
}
