import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function upsertUser(
  email: string,
  name: string,
  role: "CONTENT_EDITOR" | "MARKETING_ADMIN" | "SUPER_ADMIN",
) {
  const passwordHash = await bcrypt.hash("Seashell!2026", 12);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, role, passwordHash },
  });
  console.log(`Seeded ${role}: ${email} / Seashell!2026`);
}

async function upsertDepartment(data: {
  slug: string;
  nameEn: string;
  nameAr: string;
  summaryEn: string;
  summaryAr: string;
  descriptionEn: string;
  descriptionAr: string;
  heroImageUrl?: string;
  isCenterOfExcellence?: boolean;
  coeBlurbEn?: string;
  coeBlurbAr?: string;
  bookingSpecialtyCode?: string;
  order?: number;
  procedures?: { nameEn: string; nameAr: string }[];
}) {
  const { procedures, ...rest } = data;
  const department = await prisma.department.upsert({
    where: { slug: data.slug },
    update: { ...rest, isPublished: true },
    create: { ...rest, isPublished: true },
  });
  if (procedures?.length) {
    await prisma.departmentProcedure.deleteMany({ where: { departmentId: department.id } });
    await prisma.departmentProcedure.createMany({
      data: procedures.map((p, order) => ({ ...p, order, departmentId: department.id })),
    });
  }
  console.log(`Seeded department: ${data.slug}`);
  return department;
}

async function upsertDoctor(
  data: {
    slug: string;
    nameEn: string;
    nameAr: string;
    titleEn: string;
    titleAr: string;
    bioEn: string;
    bioAr: string;
    languages?: string[];
    isFeatured?: boolean;
  },
  departmentIds: { id: string; isPrimary?: boolean }[],
) {
  const doctor = await prisma.doctor.upsert({
    where: { slug: data.slug },
    update: { ...data, isPublished: true },
    create: { ...data, isPublished: true },
  });
  await prisma.doctorDepartment.deleteMany({ where: { doctorId: doctor.id } });
  if (departmentIds.length) {
    await prisma.doctorDepartment.createMany({
      data: departmentIds.map((d) => ({
        doctorId: doctor.id,
        departmentId: d.id,
        isPrimary: d.isPrimary ?? false,
      })),
    });
  }
  console.log(`Seeded doctor: ${data.slug}`);
  return doctor;
}

async function upsertCondition(
  data: { slug: string; nameEn: string; nameAr: string },
  departmentIds: string[],
  doctorIds: string[],
) {
  const condition = await prisma.condition.upsert({
    where: { slug: data.slug },
    update: data,
    create: data,
  });
  await prisma.conditionDepartment.deleteMany({ where: { conditionId: condition.id } });
  await prisma.conditionDoctor.deleteMany({ where: { conditionId: condition.id } });
  if (departmentIds.length) {
    await prisma.conditionDepartment.createMany({
      data: departmentIds.map((departmentId) => ({ conditionId: condition.id, departmentId })),
    });
  }
  if (doctorIds.length) {
    await prisma.conditionDoctor.createMany({
      data: doctorIds.map((doctorId) => ({ conditionId: condition.id, doctorId })),
    });
  }
  console.log(`Seeded condition: ${data.slug}`);
  return condition;
}

async function main() {
  await upsertUser("editor@seashell.test", "Nadia Editor", "CONTENT_EDITOR");
  await upsertUser("marketing@seashell.test", "Omar Marketing", "MARKETING_ADMIN");
  await upsertUser("admin@seashell.test", "Layla SuperAdmin", "SUPER_ADMIN");

  const cardiology = await upsertDepartment({
    slug: "cardiology",
    nameEn: "Cardiac Sciences",
    nameAr: "علوم القلب",
    summaryEn: "Heart health, diagnostics, and interventional care.",
    summaryAr: "رعاية القلب والتشخيص والعلاجات التداخلية.",
    descriptionEn:
      "Our cardiology team provides comprehensive heart care, from prevention and diagnostics to advanced interventional procedures, with a focus on clear treatment planning.",
    descriptionAr:
      "يقدم فريق أمراض القلب لدينا رعاية شاملة، بدءًا من الوقاية والتشخيص وحتى الإجراءات التداخلية المتقدمة، مع التركيز على تخطيط علاج واضح.",
    heroImageUrl: "/specialties/cardiology.avif",
    isCenterOfExcellence: true,
    coeBlurbEn: "Advanced cardiac catheterization lab and a prevention-first philosophy.",
    coeBlurbAr: "معمل قسطرة قلبية متطور وفلسفة وقائية أولًا.",
    bookingSpecialtyCode: "cardiology",
    order: 1,
    procedures: [
      { nameEn: "Cardiac catheterization", nameAr: "قسطرة قلبية" },
      { nameEn: "Echocardiography", nameAr: "إيكو القلب" },
      { nameEn: "Stress testing", nameAr: "اختبار الجهد" },
    ],
  });

  const neurology = await upsertDepartment({
    slug: "neurology",
    nameEn: "Neurosciences",
    nameAr: "علوم الأعصاب",
    summaryEn: "Focused expertise for brain and nervous system health.",
    summaryAr: "خبرة دقيقة لصحة الدماغ والجهاز العصبي.",
    descriptionEn:
      "From headaches and balance disorders to complex neurological conditions, our team combines advanced diagnostics with attentive, ongoing care.",
    descriptionAr:
      "من الصداع واضطرابات التوازن إلى الحالات العصبية المعقدة، يجمع فريقنا بين التشخيص المتقدم والرعاية المستمرة.",
    heroImageUrl: "/specialties/neurology.avif",
    isCenterOfExcellence: true,
    coeBlurbEn: "Comprehensive neurology diagnostics under one roof.",
    coeBlurbAr: "تشخيص شامل لأمراض الأعصاب تحت سقف واحد.",
    bookingSpecialtyCode: "neurology",
    order: 2,
    procedures: [
      { nameEn: "EEG monitoring", nameAr: "تخطيط الدماغ" },
      { nameEn: "Nerve conduction studies", nameAr: "دراسات التوصيل العصبي" },
    ],
  });

  const pediatrics = await upsertDepartment({
    slug: "pediatrics",
    nameEn: "Pediatrics",
    nameAr: "طب الأطفال",
    summaryEn: "Gentle, expert care for every stage of childhood.",
    summaryAr: "رعاية متخصصة ولطيفة لكل مراحل الطفولة.",
    descriptionEn:
      "Our pediatric team supports children and families through every stage of growth, from newborn checkups to adolescent care.",
    descriptionAr: "يدعم فريق طب الأطفال لدينا الأطفال والأسر في كل مراحل النمو، من فحوصات المواليد إلى رعاية المراهقين.",
    bookingSpecialtyCode: "pediatrics",
    order: 3,
    heroImageUrl: "/specialties/pediatrics.avif",
  });

  await upsertDepartment({
    slug: "oncology",
    nameEn: "Oncology",
    nameAr: "الأورام",
    summaryEn: "Personalized cancer care from diagnosis through recovery.",
    summaryAr: "رعاية شخصية لمرضى الأورام من التشخيص وحتى التعافي.",
    descriptionEn:
      "Our oncology team brings together medical, surgical, and radiation specialists to build a treatment plan around each patient, with close attention to comfort and support at every step.",
    descriptionAr:
      "يجمع فريق الأورام لدينا بين استشاريي العلاج الطبي والجراحي والإشعاعي لوضع خطة علاج تناسب كل مريض، مع الاهتمام بالراحة والدعم في كل خطوة.",
    heroImageUrl: "/specialties/oncology.jpg",
    bookingSpecialtyCode: "oncology",
    order: 4,
    procedures: [{ nameEn: "Chemotherapy", nameAr: "العلاج الكيميائي" }],
  });

  await upsertDepartment({
    slug: "gastroenterology",
    nameEn: "Gastroenterology",
    nameAr: "الجهاز الهضمي",
    summaryEn: "Digestive health care from routine screening to advanced procedures.",
    summaryAr: "رعاية صحة الجهاز الهضمي من الفحوصات الروتينية وحتى الإجراءات المتقدمة.",
    descriptionEn:
      "From routine endoscopy to the management of complex digestive conditions, our gastroenterology team combines modern diagnostics with a considerate, patient-first approach.",
    descriptionAr:
      "من المناظير الروتينية وحتى إدارة أمراض الجهاز الهضمي المعقدة، يجمع فريق الجهاز الهضمي بين التشخيص الحديث والاهتمام بالمريض أولًا.",
    heroImageUrl: "/specialties/gastroenterology.avif",
    bookingSpecialtyCode: "gastroenterology",
    order: 5,
    procedures: [{ nameEn: "Endoscopy", nameAr: "منظار الجهاز الهضمي" }],
  });

  await upsertDepartment({
    slug: "orthopaedics",
    nameEn: "Orthopaedics",
    nameAr: "جراحة العظام",
    summaryEn: "Bone, joint, and sports injury care for every age.",
    summaryAr: "رعاية العظام والمفاصل وإصابات الرياضة لكل الأعمار.",
    descriptionEn:
      "Our orthopaedic team treats bone, joint, and sports-related injuries with a focus on restoring mobility and getting patients back to their daily lives with confidence.",
    descriptionAr:
      "يعالج فريق جراحة العظام إصابات العظام والمفاصل والإصابات الرياضية مع التركيز على استعادة الحركة وعودة المريض لحياته اليومية بثقة.",
    heroImageUrl: "/specialties/orthopaedics.jpg",
    bookingSpecialtyCode: "orthopaedics",
    order: 6,
    procedures: [{ nameEn: "Joint replacement", nameAr: "استبدال المفاصل" }],
  });

  await upsertDepartment({
    slug: "transplants",
    nameEn: "Transplants",
    nameAr: "زراعة الأعضاء",
    summaryEn: "Comprehensive transplant care from evaluation through long-term follow-up.",
    summaryAr: "رعاية شاملة لزراعة الأعضاء من التقييم وحتى المتابعة طويلة الأمد.",
    descriptionEn:
      "Our transplant program supports patients through every stage — evaluation, surgery, and long-term follow-up — with a multidisciplinary team dedicated to the best possible outcome.",
    descriptionAr:
      "يدعم برنامج زراعة الأعضاء لدينا المرضى في كل مرحلة — التقييم والجراحة والمتابعة طويلة الأمد — بفريق متعدد التخصصات لتحقيق أفضل نتيجة ممكنة.",
    heroImageUrl: "/specialties/transplants.avif",
    bookingSpecialtyCode: "transplants",
    order: 7,
  });

  const mayaHassan = await upsertDoctor(
    {
      slug: "maya-hassan",
      nameEn: "Dr. Maya Hassan",
      nameAr: "د. مايا حسن",
      titleEn: "Cardiology",
      titleAr: "أمراض القلب",
      bioEn: "Prevention-focused cardiologist with a decade of experience in interventional cardiology and patient-centered treatment planning.",
      bioAr: "استشارية قلب تركز على الوقاية، بخبرة عشر سنوات في القسطرة القلبية وتخطيط العلاج المتمحور حول المريض.",
      languages: ["English", "Arabic"],
      isFeatured: true,
    },
    [{ id: cardiology.id, isPrimary: true }],
  );

  const omarYoussef = await upsertDoctor(
    {
      slug: "omar-youssef",
      nameEn: "Dr. Omar Youssef",
      nameAr: "د. عمر يوسف",
      titleEn: "Neurology",
      titleAr: "طب الأعصاب",
      bioEn: "Focused on headaches, balance disorders, and general nervous system health, with a calm and thorough approach to diagnosis.",
      bioAr: "يركز على الصداع واضطرابات التوازن وصحة الجهاز العصبي بشكل عام، بأسلوب هادئ ودقيق في التشخيص.",
      languages: ["English", "Arabic"],
      isFeatured: true,
    },
    [{ id: neurology.id, isPrimary: true }],
  );

  const salmaIbrahim = await upsertDoctor(
    {
      slug: "salma-ibrahim",
      nameEn: "Dr. Salma Ibrahim",
      nameAr: "د. سلمى إبراهيم",
      titleEn: "Pediatrics",
      titleAr: "طب الأطفال",
      bioEn: "Dedicated to gentle, evidence-based pediatric care from infancy through adolescence.",
      bioAr: "متخصصة في تقديم رعاية لطيفة ومبنية على الأدلة للأطفال من الرضاعة وحتى المراهقة.",
      languages: ["Arabic", "English"],
      isFeatured: true,
    },
    [{ id: pediatrics.id, isPrimary: true }],
  );

  await upsertCondition(
    { slug: "hypertension", nameEn: "Hypertension", nameAr: "ارتفاع ضغط الدم" },
    [cardiology.id],
    [mayaHassan.id],
  );
  await upsertCondition(
    { slug: "arrhythmia", nameEn: "Arrhythmia", nameAr: "اضطراب نظم القلب" },
    [cardiology.id],
    [mayaHassan.id],
  );
  await upsertCondition(
    {
      slug: "coronary-artery-disease",
      nameEn: "Coronary artery disease",
      nameAr: "تصلب الشرايين التاجية",
    },
    [cardiology.id],
    [mayaHassan.id],
  );
  await upsertCondition(
    { slug: "migraine", nameEn: "Migraine", nameAr: "الصداع النصفي" },
    [neurology.id],
    [omarYoussef.id],
  );
  await upsertCondition(
    {
      slug: "vertigo-balance-disorders",
      nameEn: "Vertigo & balance disorders",
      nameAr: "الدوخة واضطرابات التوازن",
    },
    [neurology.id],
    [omarYoussef.id],
  );
  await upsertCondition(
    { slug: "childhood-asthma", nameEn: "Childhood asthma", nameAr: "الربو عند الأطفال" },
    [pediatrics.id],
    [salmaIbrahim.id],
  );
  await upsertCondition(
    {
      slug: "growth-development-concerns",
      nameEn: "Growth & development concerns",
      nameAr: "مشاكل النمو عند الأطفال",
    },
    [pediatrics.id],
    [salmaIbrahim.id],
  );

  await prisma.jobOpening.upsert({
    where: { slug: "staff-nurse-icu" },
    update: {},
    create: {
      slug: "staff-nurse-icu",
      titleEn: "Staff Nurse — ICU",
      titleAr: "ممرض/ة — العناية المركزة",
      descriptionEn:
        "We are looking for an experienced ICU nurse to join our critical care team. Requirements: valid nursing license, 2+ years ICU experience.",
      descriptionAr: "نبحث عن ممرض/ة عناية مركزة ذو خبرة للانضمام لفريق الرعاية الحرجة. المتطلبات: ترخيص تمريض ساري، خبرة سنتين على الأقل في العناية المركزة.",
      isOpen: true,
    },
  });

  await prisma.jobOpening.upsert({
    where: { slug: "front-desk-coordinator" },
    update: {},
    create: {
      slug: "front-desk-coordinator",
      titleEn: "Front Desk Coordinator",
      titleAr: "منسق/ة استقبال",
      descriptionEn:
        "Join our patient experience team as the first point of contact for visitors, managing appointments and inquiries with warmth and efficiency.",
      descriptionAr: "انضم/ي لفريق تجربة المرضى كأول نقطة تواصل مع الزوار، لإدارة المواعيد والاستفسارات بكفاءة ولطف.",
      isOpen: true,
    },
  });

  const settings = await prisma.siteSettings.findFirst();
  const settingsData = {
    emergencyNumber: "12345",
    hotlineNumber: "+20 3 1234 5678",
    whatsappNumber: "+20 100 123 4567",
    addressEn: "Seashell Hospital, Alexandria, Egypt",
    addressAr: "مستشفى Seashell، الإسكندرية، مصر",
    workingHoursEn: "Outpatient clinics: Sat–Thu, 9:00 AM – 9:00 PM. Emergency: 24/7.",
    workingHoursAr: "العيادات الخارجية: السبت–الخميس، 9 صباحًا – 9 مساءً. الطوارئ: على مدار الساعة.",
    patientRightsEn:
      "Every patient has the right to respectful care, clear information about their diagnosis and treatment, privacy, and the ability to ask questions at any point in their care.",
    patientRightsAr: "لكل مريض الحق في رعاية محترمة، ومعلومات واضحة عن تشخيصه وعلاجه، والخصوصية، وإمكانية طرح الأسئلة في أي وقت أثناء رعايته.",
  };
  if (settings) {
    await prisma.siteSettings.update({ where: { id: settings.id }, data: settingsData });
  } else {
    await prisma.siteSettings.create({ data: settingsData });
  }
  console.log("Seeded site settings");

  const faqItems: {
    questionEn: string;
    questionAr: string;
    answerEn: string;
    answerAr: string;
    category: string;
    order: number;
  }[] = [
    {
      questionEn: "How can I book an appointment?",
      questionAr: "كيف يمكنني حجز موعد؟",
      answerEn:
        "Use the appointment button on any page, or the Consult buttons on a department page, and our appointments team will contact you to confirm a time.",
      answerAr: "استخدمي زر حجز موعد في أي صفحة، أو أزرار الاستشارة في صفحة القسم، وسيتواصل معكِ فريق المواعيد لتأكيد الميعاد.",
      category: "Appointments",
      order: 1,
    },
    {
      questionEn: "Is emergency care open 24/7?",
      questionAr: "هل تعمل الطوارئ على مدار الساعة؟",
      answerEn: "Yes. Our emergency contact is available around the clock.",
      answerAr: "نعم، يمكن التواصل مع قسم الطوارئ على مدار الساعة.",
      category: "Appointments",
      order: 2,
    },
    {
      questionEn: "Can I find a doctor by my condition instead of specialty?",
      questionAr: "هل يمكنني البحث عن طبيب حسب حالتي بدلًا من التخصص؟",
      answerEn:
        "Yes — use the Find a Doctor page and choose \"By condition\" to see doctors who treat it.",
      answerAr: "نعم — استخدمي صفحة البحث عن طبيب واختاري \"بحسب الحالة\" لعرض الأطباء المختصين.",
      category: "Doctors",
      order: 1,
    },
    {
      questionEn: "How do I contact the hospital?",
      questionAr: "كيف يمكنني التواصل مع المستشفى؟",
      answerEn: "Visit the Contact page for our address, hours, hotline, and WhatsApp number.",
      answerAr: "زوري صفحة تواصل معنا للاطلاع على العنوان ومواعيد العمل والخط الساخن ورقم واتساب.",
      category: "General",
      order: 1,
    },
  ];

  for (const item of faqItems) {
    await prisma.fAQItem.upsert({
      where: { id: `seed-${item.category}-${item.order}` },
      update: item,
      create: { id: `seed-${item.category}-${item.order}`, ...item },
    });
  }
  console.log("Seeded FAQ items");

  // News posts (Phase 5)
  const newsPosts = [
    {
      slug: "seashell-opens-new-cardiac-cath-lab",
      titleEn: "Seashell opens a new cardiac catheterization lab",
      titleAr: "مستشفى Seashell يفتتح معمل قسطرة قلبية جديد",
      excerptEn:
        "Our new state-of-the-art cath lab expands access to life-saving cardiac care.",
      excerptAr: "معملنا الجديد المجهّز بأحدث التقنيات يوسّع الوصول إلى رعاية القلب المنقذة للحياة.",
      bodyEn:
        "Seashell Hospital is proud to announce the opening of a new cardiac catheterization laboratory, equipped with the latest imaging technology. The facility allows our cardiology team to diagnose and treat heart conditions with greater precision and shorter recovery times.\n\nThe lab is now accepting referrals through our appointments team.",
      bodyAr:
        "يفخر مستشفى Seashell بالإعلان عن افتتاح معمل قسطرة قلبية جديد مجهّز بأحدث تقنيات التصوير. ويتيح المعمل لفريق القلب لدينا تشخيص أمراض القلب وعلاجها بدقة أكبر وأوقات تعافٍ أقصر.\n\nويستقبل المعمل الآن الإحالات عبر فريق المواعيد.",
      publishedAt: new Date("2026-07-01"),
      isPublished: true,
    },
    {
      slug: "world-diabetes-day-free-screening",
      titleEn: "Free screening on World Diabetes Day",
      titleAr: "فحص مجاني في اليوم العالمي للسكري",
      excerptEn: "Join us for free blood-sugar screening and consultations this November.",
      excerptAr: "انضم إلينا لفحص مجاني لسكر الدم واستشارات خلال نوفمبر.",
      bodyEn:
        "To mark World Diabetes Day, Seashell Hospital is offering free blood-sugar screening and short consultations with our endocrinology team throughout the day. No appointment is needed — simply visit the main reception.",
      bodyAr:
        "بمناسبة اليوم العالمي للسكري، يقدّم مستشفى Seashell فحصًا مجانيًا لسكر الدم واستشارات قصيرة مع فريق الغدد الصماء طوال اليوم. لا حاجة لموعد مسبق — فقط توجّه إلى الاستقبال الرئيسي.",
      publishedAt: new Date("2026-07-20"),
      isPublished: true,
    },
  ];
  for (const post of newsPosts) {
    await prisma.newsPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  console.log("Seeded news posts");

  // Testimonials (Phase 5) — all consented before publish
  const testimonials = [
    {
      id: "seed-testimonial-1",
      displayNameEn: "Mona A.",
      displayNameAr: "منى أ.",
      quoteEn:
        "From admission to discharge, the team treated my mother with genuine kindness. The cardiology care was outstanding.",
      quoteAr: "من الدخول حتى الخروج، عامل الفريق والدتي بلطف حقيقي. وكانت رعاية القلب متميزة.",
      rating: 5,
      consentObtained: true,
      isPublished: true,
      order: 0,
    },
    {
      id: "seed-testimonial-2",
      displayNameEn: "Karim H.",
      displayNameAr: "كريم ح.",
      quoteEn:
        "Booking was simple and the doctors explained everything clearly. I felt cared for at every step.",
      quoteAr: "كان الحجز بسيطًا وشرح الأطباء كل شيء بوضوح. شعرت بالاهتمام في كل خطوة.",
      rating: 5,
      consentObtained: true,
      isPublished: true,
      order: 1,
    },
  ];
  for (const item of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log("Seeded testimonials");

  // Leadership (Phase 3)
  const leadership = [
    {
      id: "seed-leader-1",
      nameEn: "Dr. Hana Farouk",
      nameAr: "د. هناء فاروق",
      titleEn: "Chief Executive Officer",
      titleAr: "الرئيس التنفيذي",
      bioEn:
        "Dr. Farouk leads Seashell Hospital with over 20 years of experience in healthcare management and patient-centered care.",
      bioAr: "تقود د. فاروق مستشفى Seashell بخبرة تزيد على 20 عامًا في إدارة الرعاية الصحية والرعاية المتمحورة حول المريض.",
      order: 0,
    },
    {
      id: "seed-leader-2",
      nameEn: "Dr. Tarek Mansour",
      nameAr: "د. طارق منصور",
      titleEn: "Chief Medical Officer",
      titleAr: "المدير الطبي",
      bioEn:
        "Dr. Mansour oversees clinical quality and safety across all departments, ensuring evidence-based standards of care.",
      bioAr: "يشرف د. منصور على الجودة الإكلينيكية والسلامة في جميع الأقسام، بما يضمن معايير رعاية قائمة على الأدلة.",
      order: 1,
    },
  ];
  for (const member of leadership) {
    await prisma.leadershipMember.upsert({
      where: { id: member.id },
      update: member,
      create: member,
    });
  }
  console.log("Seeded leadership");

  // Awards & accreditations (Phase 3)
  const awards = [
    {
      id: "seed-award-1",
      titleEn: "JCI Accreditation",
      titleAr: "اعتماد اللجنة الدولية المشتركة (JCI)",
      issuerEn: "Joint Commission International",
      issuerAr: "اللجنة الدولية المشتركة",
      year: 2025,
      order: 0,
      isPublished: true,
    },
    {
      id: "seed-award-2",
      titleEn: "Patient Safety Excellence Award",
      titleAr: "جائزة التميز في سلامة المرضى",
      issuerEn: "Regional Health Authority",
      issuerAr: "الهيئة الصحية الإقليمية",
      year: 2024,
      order: 1,
      isPublished: true,
    },
  ];
  for (const award of awards) {
    await prisma.award.upsert({
      where: { id: award.id },
      update: award,
      create: award,
    });
  }
  console.log("Seeded awards");

  // Demo bill for the /pay lookup (Phase 6)
  await prisma.paymentTransaction.upsert({
    where: { id: "seed-payment-1" },
    update: {},
    create: {
      id: "seed-payment-1",
      referenceNumber: "SEA-2026-0001",
      amount: "1500.00",
      currency: "EGP",
      payerName: "Ahmed Sample",
      status: "PENDING",
      providerName: "Demo",
    },
  });
  console.log("Seeded demo payment");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
