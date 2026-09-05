import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import envelope from "@/assets/envelope.png";
import pearlBg from "@/assets/pearl-bg.jpg";
import invitationCard from "@/assets/invitation-card.png.asset.json";
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
            {/* the real invitation paper sliding slowly out of the envelope */}
            <img
              src={invitationCard.url}
              alt="دعوة زفاف هيكل و ريان"
              width={1080}
              height={1920}
              className="paper-card absolute inset-x-10 bottom-8 z-0 h-auto rounded-md"
              style={{
                transform:
                  phase === "sliding"
                    ? "translateY(-88%) scale(1.02)"
                    : "translateY(-8%) scale(0.96)",
                opacity: phase === "closed" ? 0 : 1,
                transition:
                  "transform 2600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease-out",
              }}
            />

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
        <div className="relative mx-auto flex w-full max-w-md flex-col items-center px-5 py-10">
          <img
            src={invitationCard.url}
            alt="دعوة زفاف هيكل و ريان — 25 و 26 سبتمبر"
            width={1080}
            height={1920}
            className="paper-card animate-rise h-auto w-full rounded-md"
          />

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
