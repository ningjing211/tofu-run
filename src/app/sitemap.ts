import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/join"), lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/lobby"), lastModified, changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/live"), lastModified, changeFrequency: "daily", priority: 0.85 },
    { url: absoluteUrl("/passport"), lastModified, changeFrequency: "weekly", priority: 0.7 },
  ];
}
