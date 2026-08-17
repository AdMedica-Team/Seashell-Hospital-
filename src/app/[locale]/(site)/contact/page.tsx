import { useTranslations } from "next-intl";
import { getSiteSettings } from "@/lib/settings";
import { pick } from "@/lib/i18n-content";
import { ContactForm } from "@/components/site/ContactForm";
import type { SiteSettings } from "@/generated/prisma/client";

export default async function ContactPage({
  params,
}: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  const settings = await getSiteSettings();

  return <ContactContent settings={settings} locale={locale} />;
}

function ContactContent({ settings, locale }: { settings: SiteSettings; locale: string }) {
  const t = useTranslations("pages.contact");

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
      <div>
        <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">{t("eyebrow")}</p>
        <h1 className="mt-2 font-display text-4xl text-ink">{t("heading")}</h1>

        <dl className="mt-8 flex flex-col gap-4 text-sm text-ink/80">
          <div>
            <dt className="font-medium text-ink">{t("address")}</dt>
            <dd>{pick(settings.addressEn, settings.addressAr, locale)}</dd>
          </div>
          <div>
            <dt className="font-medium text-ink">{t("hours")}</dt>
            <dd>{pick(settings.workingHoursEn, settings.workingHoursAr, locale)}</dd>
          </div>
          <div>
            <dt className="font-medium text-ink">{t("hotline")}</dt>
            <dd>
              <a href={`tel:${settings.hotlineNumber}`}>{settings.hotlineNumber}</a>
            </dd>
          </div>
          {settings.whatsappNumber && (
            <div>
              <dt className="font-medium text-ink">{t("whatsapp")}</dt>
              <dd>
                <a href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}`}>
                  {settings.whatsappNumber}
                </a>
              </dd>
            </div>
          )}
          <div>
            <dt className="font-medium text-ink">{t("patientRights")}</dt>
            <dd className="whitespace-pre-line">{pick(settings.patientRightsEn, settings.patientRightsAr, locale)}</dd>
          </div>
        </dl>

        {settings.mapEmbedUrl ? (
          <iframe
            src={settings.mapEmbedUrl}
            className="mt-8 h-56 w-full rounded-2xl border border-line"
            loading="lazy"
          />
        ) : (
          <div className="mt-8 grid h-40 place-items-center rounded-2xl bg-[repeating-linear-gradient(45deg,#1b5160_0_12px,#1d5866_12px_24px)] text-sm text-white/70">
            Map
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-line bg-white p-6">
        <ContactForm />
      </div>
    </div>
  );
}
