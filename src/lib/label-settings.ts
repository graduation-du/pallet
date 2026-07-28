import type { PrismaClient } from "@prisma/client";

export type LabelConfig = {
  companyName: string;
  tagline: string;
  accentColor: string;
  footerText: string;
};

export const DEFAULT_LABEL_CONFIG: LabelConfig = {
  companyName: "PalletTrack Pro",
  tagline: "Returnable Pallet",
  accentColor: "#1e40af",
  footerText: "Scan to track · do not remove",
};

const LABEL_KEYS = [
  "label_company_name",
  "label_company_tagline",
  "label_accent_color",
  "label_footer_text",
] as const;

export async function getLabelSettings(prisma: PrismaClient): Promise<LabelConfig> {
  const rows = await prisma.setting.findMany({
    where: { key: { in: [...LABEL_KEYS] } },
  });
  const map = Object.fromEntries(rows.map((s) => [s.key, s.value]));
  return {
    companyName: map.label_company_name || DEFAULT_LABEL_CONFIG.companyName,
    tagline: map.label_company_tagline || DEFAULT_LABEL_CONFIG.tagline,
    accentColor: map.label_accent_color || DEFAULT_LABEL_CONFIG.accentColor,
    footerText: map.label_footer_text || DEFAULT_LABEL_CONFIG.footerText,
  };
}
