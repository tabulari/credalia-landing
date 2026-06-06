import type { MetadataRoute } from "next";
import { config } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = config.siteUrl.replace(/\/$/, "");
  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/terminos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/privacidad`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];
}
