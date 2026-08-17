import { SliderStory } from "@/components/site/hero-styles/SliderStory";
import { Coverflow3D } from "@/components/site/hero-styles/Coverflow3D";
import { ThumbnailStrip } from "@/components/site/hero-styles/ThumbnailStrip";
import { ScrollSnapSlides } from "@/components/site/hero-styles/ScrollSnapSlides";

const STYLES = [
  {
    n: 1,
    title: "Slider احترافي (Story-style)",
    desc: "فريم أفقي مستطيل بحواف مدوّرة.",
    Comp: SliderStory,
  },
  {
    n: 2,
    title: "Coverflow / كروت 3D",
    desc: "الفيديو في كارت وسط الشاشة جوه ستيدج بمنظور ثلاثي الأبعاد.",
    Comp: Coverflow3D,
  },
  {
    n: 3,
    title: "شريط thumbnails",
    desc: "فيديو كبير بحواف مدوّرة.",
    Comp: ThumbnailStrip,
  },
  {
    n: 4,
    title: "Slides عمودية scroll-snap",
    desc: "الفيديو ملء قسم رأسي طويل بحواف مدوّرة.",
    Comp: ScrollSnapSlides,
  },
];

export default function HeroStylesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="font-display text-xs font-bold uppercase tracking-wide text-teal">
        معاينة
      </p>
      <h1 className="mt-2 font-display text-4xl text-ink">أساليب عرض الفيديوهات</h1>
      <p className="mt-3 max-w-2xl text-muted">
        الأربع أفكار شغّالة بالفيديوهات الحقيقية. جرّبي كل واحدة واختاري اللي تعجبك للـ hero.
      </p>

      <div className="mt-12 flex flex-col gap-16">
        {STYLES.map(({ n, title, desc, Comp }) => (
          <section key={n}>
            <div className="mb-4">
              <h2 className="font-display text-2xl text-ink">
                {n}. {title}
              </h2>
              <p className="mt-1 text-sm text-muted">{desc}</p>
            </div>
            <Comp />
          </section>
        ))}
      </div>
    </div>
  );
}
