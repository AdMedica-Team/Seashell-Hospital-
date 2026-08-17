import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { requireRole } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import type { Testimonial } from "@/generated/prisma/client";

export default async function EditTestimonialPage({
  params,
}: PageProps<"/[locale]/admin/testimonials/[id]">) {
  await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();
  return <EditTestimonialContent testimonial={testimonial} />;
}

function EditTestimonialContent({ testimonial }: { testimonial: Testimonial }) {
  const t = useTranslations("admin.common");
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl text-ink">
        {t("edit")} · {testimonial.displayNameEn}
      </h1>
      <div className="mt-6">
        <TestimonialForm testimonial={testimonial} />
      </div>
    </div>
  );
}
