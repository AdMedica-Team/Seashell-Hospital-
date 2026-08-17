import { getTranslations } from "next-intl/server";
import { getSiteSettings } from "@/lib/settings";

/**
 * Floating WhatsApp button — sits just above the chatbot launcher (which is at
 * bottom-20/24) so the two don't overlap. Links to wa.me with the hospital's
 * WhatsApp number from SiteSettings; renders nothing if no number is set.
 */
export async function WhatsAppButton() {
  const [t, settings] = await Promise.all([
    getTranslations("footer"),
    getSiteSettings(),
  ]);

  const raw = settings.whatsappNumber;
  if (!raw) return null;
  const digits = raw.replace(/[^\d]/g, "");

  return (
    <a
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noreferrer"
      aria-label={t("whatsapp")}
      className="fixed bottom-36 end-4 z-50 grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_rgba(37,211,102,0.45)] transition hover:-translate-y-0.5 hover:brightness-105 sm:bottom-40 sm:end-6 sm:h-14 sm:w-14"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 sm:h-8 sm:w-8" fill="currentColor" aria-hidden>
        <path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 29l8.2-1.6c1.7.9 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3Zm0 21.8c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-4.9 1 1-4.8-.3-.4A9.8 9.8 0 0 1 6.2 15c0-5.4 4.4-9.8 9.8-9.8s9.8 4.4 9.8 9.8-4.4 9.8-9.8 9.8Zm5.4-7.3c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-1.8-.9-2.9-1.6-4.1-3.6-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6 2 .8 2.7.9 3.7.8.6-.1 1.8-.8 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.2-.6-.4Z" />
      </svg>
    </a>
  );
}
