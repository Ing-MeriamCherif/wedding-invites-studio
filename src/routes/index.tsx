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

type Phase = "closed" | "opening" | "sliding" | "open";

/* geometry of the envelope inside the artwork, in % of the image box */
const FLAP_CLIP = "polygon(3.4% 22.3%, 96.7% 22.3%, 50% 53.9%)";
const FRONT_CLIP =
  "polygon(3.4% 22.3%, 50% 53.9%, 96.7% 22.3%, 96.7% 77.3%, 3.4% 77.3%)";

function Invitation() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (phase === "opening") {
      const timer = window.setTimeout(() => setPhase("sliding"), 1600);
      return () => window.clearTimeout(timer);
    }
    if (phase === "sliding") {
      const timer = window.setTimeout(() => setPhase("open"), 3200);
      return () => window.clearTimeout(timer);
    }
    return;
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
    setPhase("opening");
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
            disabled={phase !== "closed"}
            className="relative mt-8 w-full max-w-sm focus:outline-none"
          >
            <div
              className="relative w-full"
              style={{ aspectRatio: "1024 / 1280", perspective: "1400px" }}
            >
              {/* envelope back, gives the outer silhouette and shadow */}
              <img
                src={envelope}
                alt="مغلف الدعوة"
                width={1024}
                height={1280}
                className="absolute inset-0 z-0 h-full w-full"
                style={{ filter: "drop-shadow(var(--shadow-envelope))" }}
              />

              {/* shaded interior revealed once the flap lifts */}
              <div
                aria-hidden="true"
                className="absolute inset-0 z-[1]"
                style={{
                  clipPath: FLAP_CLIP,
                  background:
                    "linear-gradient(180deg, oklch(0.84 0.02 82) 0%, oklch(0.92 0.015 84) 55%, oklch(0.96 0.012 85) 100%)",
                }}
              />

              {/* the invitation card, clipped so it stays hidden inside the pocket */}
              <div
                className="absolute left-0 right-0 z-[5] overflow-hidden"
                style={{ top: "-180%", bottom: "22.7%" }}
              >
                <img
                  src={invitationCard.url}
                  alt="دعوة زفاف هيكل و ريان"
                  width={1080}
                  height={1920}
                  className="paper-card absolute bottom-0 left-1/2 h-[62%] w-auto rounded-sm"
                  style={{
                    transform:
                      phase === "sliding"
                        ? "translate(-50%, -52%)"
                        : "translate(-50%, 8%)",
                    opacity: phase === "closed" ? 0 : 1,
                    transition:
                      "transform 2600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms ease-out",
                  }}
                />
              </div>

              {/* front pocket stays in front of the card */}
              <img
                src={envelope}
                alt=""
                aria-hidden="true"
                width={1024}
                height={1280}
                className="absolute inset-0 z-10 h-full w-full"
                style={{ clipPath: FRONT_CLIP }}
              />

              {/* the flap that lifts open */}
              <img
                src={envelope}
                alt=""
                aria-hidden="true"
                width={1024}
                height={1280}
                className="absolute inset-0 h-full w-full"
                style={{
                  clipPath: FLAP_CLIP,
                  transformOrigin: "50% 22.3%",
                  transform:
                    phase === "closed" ? "rotateX(0deg)" : "rotateX(-166deg)",
                  transition: "transform 1500ms cubic-bezier(0.5, 0, 0.2, 1)",
                  zIndex: phase === "closed" ? 20 : 2,
                  filter:
                    phase === "closed" ? "none" : "brightness(0.97) saturate(0.98)",
                }}
              />
            </div>
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
