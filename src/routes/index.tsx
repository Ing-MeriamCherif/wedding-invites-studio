import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import envelope from "@/assets/envelope.png";
import pearlBg from "@/assets/pearl-bg.jpg";
import ornament from "@/assets/ornament.png";
import music from "@/assets/wedding-music.mp3.asset.json";

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

type Phase = "closed" | "sliding" | "open";

function Invitation() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (phase !== "sliding") return;
    const timer = window.setTimeout(() => setPhase("open"), 3200);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        audio.volume = 0.45;
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const openInvitation = () => {
    if (phase !== "closed") return;
    setPhase("sliding");
    const audio = audioRef.current;
    if (audio && audio.paused) {
      audio.volume = 0.45;
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

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

      <audio ref={audioRef} src={music.url} loop preload="auto" />

      <button
        type="button"
        onClick={toggleMusic}
        aria-label={playing ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/85 text-gold shadow-md backdrop-blur transition-colors hover:bg-ivory"
      >
        {playing ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </button>

      {phase !== "open" ? (
        <section className="relative flex min-h-screen flex-col items-center justify-center px-6">
          <p
            className="animate-shimmer font-display text-lg tracking-widest text-gold transition-opacity duration-700"
            style={{ opacity: phase === "closed" ? 1 : 0 }}
          >
            دعوة زفاف
          </p>

          <button
            type="button"
            onClick={openInvitation}
            aria-label="افتح الدعوة"
            disabled={phase === "sliding"}
            className="relative mt-8 w-full max-w-sm focus:outline-none"
            style={{ perspective: "1200px" }}
          >
            {/* the paper sliding slowly out of the envelope */}
            <div
              className="absolute inset-x-8 bottom-6 z-0 rounded-sm px-6 py-10 text-center"
              style={{
                backgroundImage: "var(--gradient-card)",
                boxShadow: "var(--shadow-card)",
                transform:
                  phase === "sliding" ? "translateY(-78%) scale(1.02)" : "translateY(6%) scale(0.96)",
                transition: "transform 2600ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <Ornament className="w-24" />
              <p className="mt-4 font-display text-3xl leading-relaxed text-gold">
                هيكل
                <span className="mx-2 text-lg text-gold-soft">و</span>
                ريان
              </p>
              <p className="mt-3 text-sm tracking-widest text-ink/70">25 — 26 سبتمبر</p>
            </div>

            {/* envelope stays in front */}
            <img
              src={envelope}
              alt="مغلف الدعوة"
              width={1024}
              height={1280}
              className="relative z-10 h-auto w-full rounded-lg transition-transform duration-700"
              style={{
                filter: "drop-shadow(var(--shadow-envelope))",
                transform: phase === "sliding" ? "translateY(14px) scale(0.99)" : "none",
              }}
            />
          </button>

          <p
            className="mt-6 text-sm text-ink/70 transition-opacity duration-500"
            style={{ opacity: phase === "closed" ? 1 : 0 }}
          >
            اضغط على المغلف لفتح الدعوة
          </p>
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
            onClick={() => setPhase("closed")}
            className="mt-8 font-display text-sm tracking-widest text-gold underline-offset-8 hover:underline"
          >
            إغلاق الدعوة
          </button>
        </div>
      )}
    </main>
  );
}
