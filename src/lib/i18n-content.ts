export function pick(en: string, ar: string, locale: string): string {
  return locale === "ar" ? ar : en;
}
