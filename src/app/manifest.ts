import type { MetadataRoute } from "next";
import { config } from "@/lib/config";
import { fmtCOP } from "@/lib/credit";

export default function manifest(): MetadataRoute.Manifest {
  const base = config.siteUrl.replace(/\/$/, "");
  const maxDisplay = `$${fmtCOP(config.simulator.amountMax).replace(',00','')}`;
  return {
    name: config.company.legalName,
    short_name: config.brandName,
    description:
      `Crédito digital en Colombia hasta ${maxDisplay}. Respuesta en minutos, tasa clara y sin papeles.`,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: config.colors.navy,
    lang: "es",
    icons: [
      { src: `${base}/favicon.svg`, sizes: "any", type: "image/svg+xml" },
      { src: `${base}/favicon-32.png`, sizes: "32x32", type: "image/png" },
      { src: `${base}/apple-touch-icon.png`, sizes: "180x180", type: "image/png" },
    ],
  };
}
