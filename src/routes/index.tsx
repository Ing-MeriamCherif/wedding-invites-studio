import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import envelope from "@/assets/envelope.png";
import pearlBg from "@/assets/pearl-bg.jpg";
import ornament from "@/assets/ornament.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "هيكل و ريان — دعوة زفاف" },
      {
        name: "description",
        content:
          "دعوة زفاف هيكل و ريان يومي 25 و 26 سبتمبر — عقد القران، مأدبة العروس، وحفل الزفاف بقاعة La Marquise.",
      },
      { property: "og:title", content: "هيكل و ريان — دعوة زفاف" },
      {
        property: "og:description",
        content: "احفظوا التاريخ: 25 و 26 سبتمبر. يسعدنا حضوركم لمشاركتنا هذه اللحظات المباركة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invitation,
});

const program = [
  {
    day: "الجمعة 25 سبتمبر",
    events: [
      { title: "عقد القران", place: "جامع الزمزمية", time: "بعد صلاة العصر مباشرة" },
      { title: "مأدبة العروس", place: "قاعة دار زمان — عنتر", time: "بعد صلاة العصر" },
      { title: "حنّة العروس", place: "قاعة مسايا — عنتر", time: "مساءً" },
    ],
  },
  {
    day: "السبت 26 سبتمبر",
    events: [
      { title: "مأدبة عشاء العريس", place: "قاعة La Marquise", time: "مساءً" },
      { title: "حفل الزفاف", place: "قاعة La Marquise", time: "بعد المأدبة" },
    ],
  },
];

function Ornament({ className = "" }: { className?: string }) {
  return (
    <img
      src={ornament}
      alt=""
      aria-hidden="true"
      loading="lazy"
      width={1152}
      height={576}
      className={`mx-auto h-auto w-40 opacity-80 ${className}`}
    />
  );
}

function Invitation() {
  const [opened, setOpened] = useState(false);

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-ivory font-body text-ink"
      style={{
        backgroundImage: `url(${pearlBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-ivory/45" aria-hidden="true" />

      {!opened ? (
        <section className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-6">
          <p className="animate-shimmer font-display text-lg tracking-widest text-gold">
            دعوة زفاف
          </p>
          <button
            type="button"
            onClick={() => setOpened(true)}
            aria-label="افتح الدعوة"
            className="group w-full max-w-sm transition-transform duration-500 hover:scale-[1.03] focus:outline-none"
          >
            <img
              src={envelope}
              alt="مغلف الدعوة"
              width={1024}
              height={1280}
              className="h-auto w-full rounded-lg"
              style={{ filter: "drop-shadow(var(--shadow-envelope))" }}
            />
          </button>
          <p className="text-sm text-ink/70">اضغط على المغلف لفتح الدعوة</p>
        </section>
      ) : (
        <div className="relative mx-auto flex w-full max-w-md flex-col items-center px-5 py-12">
          <article
            className="animate-rise w-full rounded-sm px-7 py-12 text-center"
            style={{ backgroundImage: "var(--gradient-card)", boxShadow: "var(--shadow-card)" }}
          >
            <Ornament />

            <h1 className="mt-8 font-display text-5xl leading-[1.5] text-gold">
              هيكل
              <span className="mx-3 block text-2xl text-gold-soft">و</span>
              ريان
            </h1>

            <div className="mt-8 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-gold-soft" />
              <p className="font-display text-xl text-ink">احفظوا التاريخ</p>
              <span className="h-px w-10 bg-gold-soft" />
            </div>
            <p className="mt-3 text-lg tracking-widest text-ink/80">25 — 26 سبتمبر</p>

            <p className="mt-10 font-display text-base leading-loose text-gold">
              ﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا
              إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ﴾
            </p>

            <p className="mt-8 text-base leading-loose text-ink/85">
              يسرّ عائلة العريس وعائلة العروس دعوتكم لحضور حفل زفاف ولديهما
              <span className="mt-2 block font-display text-2xl text-gold">هيكل &amp; ريان</span>
              وتكتمل فرحتنا ومسرّتنا بتشريفكم ومشاركتكم لنا هذه اللحظات المباركة، وفق البرنامج
              التالي:
            </p>

            <div className="mt-10 space-y-9 text-right">
              {program.map((block) => (
                <section key={block.day}>
                  <h2 className="font-display text-xl text-gold">{block.day}</h2>
                  <span className="mt-2 block h-px w-full bg-gold-soft/60" />
                  <ul className="mt-4 space-y-4">
                    {block.events.map((event) => (
                      <li key={event.title}>
                        <p className="text-base font-medium text-ink">{event.title}</p>
                        <p className="text-sm text-ink/75">{event.place}</p>
                        <p className="text-sm text-ink/60">{event.time}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <p className="mt-12 text-base leading-loose text-ink/85">
              حضوركم يسعدنا ويشرّفنا، ودعواتكم الصادقة تضيء دربنا.
            </p>

            <Ornament className="mt-8 rotate-180" />
          </article>

          <button
            type="button"
            onClick={() => setOpened(false)}
            className="mt-8 font-display text-sm tracking-widest text-gold underline-offset-8 hover:underline"
          >
            إغلاق الدعوة
          </button>
        </div>
      )}
    </main>
  );
}
