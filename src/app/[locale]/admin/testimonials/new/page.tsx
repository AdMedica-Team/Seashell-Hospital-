import { useTranslations } from "next-intl";
import { requireRole } from "@/lib/dal";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export default async function NewTestimonialPage() {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  return <NewTestimonialContent />;
}

function NewTestimonialContent() {
  const t = useTranslations("admin.testimonials");
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">{t("newTestimonial")}</h1>
      <div className="mt-6">
        <TestimonialForm />
      </div>
    </div>
  );
}
