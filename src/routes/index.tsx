import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import hanna from "@/assets/hanna.jpg";
import max from "@/assets/max.jpg";
import dix from "@/assets/dix.jpg";
import mozart from "@/assets/mozart.jpg";
import chester from "@/assets/chester.jpg";
import clara from "@/assets/clara.jpg";
import toto from "@/assets/toto.jpg";
import camila from "@/assets/camila.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Altar Digital · Mis Perritos" },
      { name: "description", content: "Un altar de Día de Muertos para Hanna, Max, Dix, Mozart, Chester, Clara, Toto y Camila." },
      { property: "og:title", content: "Altar Digital · Mis Perritos" },
      { property: "og:description", content: "Cempasúchil, veladoras y papel picado para recordar a mis perritos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,900;1,600&family=Nunito:wght@400;700&display=swap" },
    ],
  }),
  component: Index,
});

type Pet = { name: string; img: string; desc: string; note: string };

const baseDogs: Pet[] = [
  { name: "Hanna", img: hanna, desc: "Pastor alemán · café claro, negro y blanco", note: "La reina de la casa, dulce y protectora." },
  { name: "Max", img: max, desc: "Pastor alemán black solid · 5 meses", note: "Pequeño corazón negro, lleno de travesuras." },
  { name: "Dix", img: dix, desc: "Pastor alemán · café claro con negro", note: "Leal guardián de cada paso." },
  { name: "Mozart", img: mozart, desc: "Pastor alemán · café gris con negro", note: "Sabio y sereno, nuestra sinfonía." },
  { name: "Chester", img: chester, desc: "Cruza maltés con shih tzu · negro con gris", note: "Bolita de pelos y alegría." },
  { name: "Clara", img: clara, desc: "Salchicha · café, pelo corto", note: "Ojitos tiernos que todo lo iluminan." },
  { name: "Toto", img: toto, desc: "Salchicha · café, pelo corto", note: "Sonrisa eterna y cola inquieta." },
  { name: "Camila", img: camila, desc: "Salchicha · café, pelo corto", note: "Siesta, amor y cobijitas." },
];

const STORAGE_KEY = "altar-mascotas-extra";

function loadExtraPets(): Pet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Pet[]) : [];
  } catch {
    return [];
  }
}

const papelColors = ["bg-altar-pink", "bg-altar-orange", "bg-altar-gold", "bg-altar-green", "bg-altar-purple"];

// Melodía estilo "La Llorona" (tonos tradicionales) sintetizada con WebAudio
const MELODY: Array<[number, number]> = [
  [440, 1], [523.25, 0.5], [493.88, 0.5], [440, 1], [392, 1],
  [440, 1], [523.25, 0.5], [587.33, 0.5], [659.25, 1.5], [587.33, 0.5],
  [523.25, 1], [493.88, 1], [440, 2],
  [392, 1], [440, 0.5], [493.88, 0.5], [523.25, 1], [440, 1],
  [392, 1], [329.63, 1], [440, 2.5],
];

function useAltarMusic() {
  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const stop = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    ctxRef.current?.close();
    ctxRef.current = null;
    setPlaying(false);
  };

  const play = () => {
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.value = 0.18;
    master.connect(ctx.destination);

    const loop = () => {
      let t = ctx.currentTime + 0.05;
      for (const [freq, beats] of MELODY) {
        const dur = beats * 0.55;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.9, t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(g).connect(master);
        osc.start(t);
        osc.stop(t + dur);
        // acompañamiento grave
        const bass = ctx.createOscillator();
        const bg = ctx.createGain();
        bass.type = "triangle";
        bass.frequency.value = freq / 2;
        bg.gain.setValueAtTime(0, t);
        bg.gain.linearRampToValueAtTime(0.25, t + 0.08);
        bg.gain.exponentialRampToValueAtTime(0.001, t + dur);
        bass.connect(bg).connect(master);
        bass.start(t);
        bass.stop(t + dur);
        t += dur;
      }
      timerRef.current = window.setTimeout(loop, (t - ctx.currentTime) * 1000);
    };
    loop();
    setPlaying(true);
  };

  useEffect(() => stop, []);

  return { playing, toggle: () => (playing ? stop() : play()) };
}

function Petals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: (i * 37) % 100,
        delay: (i * 0.7) % 12,
        dur: 8 + ((i * 3) % 9),
        size: 10 + ((i * 5) % 14),
        drift: ((i % 5) - 2) * 60,
        gold: i % 3 === 0,
      })),
    [],
  );
  return (
    <>
      {petals.map((p, i) => (
        <span
          key={i}
          className={`petal rounded-[60%_10%_60%_10%] ${p.gold ? "bg-altar-gold" : "bg-altar-orange"}`}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </>
  );
}

function PapelPicado() {
  return (
    <div className="relative flex justify-center gap-1 overflow-hidden px-2 pt-1">
      <div className="absolute inset-x-0 top-1 h-0.5 bg-altar-cream/60" />
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className={`animate-sway relative mt-1 h-16 w-14 shrink-0 transition-transform duration-300 hover:scale-125 md:h-20 md:w-20 ${papelColors[i % 5]}`}
          style={{
            animationDelay: `${(i % 6) * 0.3}s`,
            clipPath: "polygon(0 0,100% 0,100% 85%,90% 100%,80% 85%,70% 100%,60% 85%,50% 100%,40% 85%,30% 100%,20% 85%,10% 100%,0 85%)",
          }}
        >
          <div className="absolute left-1/2 top-1/3 h-5 w-5 -translate-x-1/2 rotate-45 bg-altar-night/40" />
          <div className="absolute left-2 top-2 h-2 w-2 rounded-full bg-altar-night/40" />
          <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-altar-night/40" />
        </div>
      ))}
    </div>
  );
}

function Candle({ delay = 0, tall = false }: { delay?: number; tall?: boolean }) {
  return (
    <div className="group flex flex-col items-center transition-transform duration-300 hover:scale-125">
      <div className="relative h-12 w-6">
        <div className="candle-glow absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full opacity-70" />
        <div
          className="animate-flicker absolute bottom-0 left-1/2 -ml-2.5 h-10 w-5 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-t from-altar-orange via-altar-gold to-altar-cream"
          style={{ animationDelay: `${delay}s` }}
        />
      </div>
      <div className="h-1 w-0.5 bg-altar-night" />
      <div className={`w-10 rounded-t-sm bg-gradient-to-b from-altar-cream to-altar-gold/70 ${tall ? "h-24" : "h-16"}`} />
    </div>
  );
}

function MarigoldArch() {
  return (
    <svg viewBox="0 0 200 110" className="pointer-events-none absolute -top-12 left-1/2 z-10 w-[115%] -translate-x-1/2" aria-hidden>
      {Array.from({ length: 19 }).map((_, i) => {
        const t = Math.PI - (i / 18) * Math.PI;
        const x = 100 + Math.cos(t) * 92;
        const y = 100 - Math.sin(t) * 90;
        return (
          <g key={i} className="origin-center">
            <circle cx={x} cy={y} r="9" fill="var(--altar-orange)" />
            <circle cx={x} cy={y} r="6" fill="var(--altar-gold)" />
            <circle cx={x} cy={y} r="2.5" fill="var(--altar-orange)" />
            {i % 2 === 0 && <ellipse cx={x} cy={y + 9} rx="3" ry="5" fill="var(--altar-green)" />}
          </g>
        );
      })}
    </svg>
  );
}

function DogCard({ dog, i }: { dog: Pet; i: number }) {
  return (
    <article className="animate-reveal group relative pt-14" style={{ animationDelay: `${i * 0.15}s` }}>
      <div className="relative mx-auto transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-1">
        <MarigoldArch />
        <div className="relative overflow-hidden rounded-t-full border-4 border-altar-gold bg-altar-deep shadow-2xl">
          <img
            src={dog.img}
            alt={`Retrato de ${dog.name}`}
            loading="lazy"
            width={816}
            height={816}
            className="animate-breathe aspect-[4/5] w-full object-cover transition-all duration-700 group-hover:scale-125"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-altar-night/90 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-center">
            <h3 className="font-display text-3xl font-black text-altar-gold transition-transform group-hover:scale-110">{dog.name}</h3>
          </div>
        </div>
        <div className="mt-3 flex justify-center">
          <Candle delay={(i % 5) * 0.25} />
        </div>
      </div>
    </article>
  );
}

function AddPetForm({ onAdd }: { onAdd: (pet: Pet) => void }) {
  const [openForm, setOpenForm] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [note, setNote] = useState("");
  const [img, setImg] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImg(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !img) return;
    onAdd({ name: name.trim(), img, desc: desc.trim(), note: note.trim() });
    setName(""); setDesc(""); setNote(""); setImg(null);
    setOpenForm(false);
  };

  if (!openForm) {
    return (
      <button
        onClick={() => setOpenForm(true)}
        className="animate-reveal group relative flex min-h-64 flex-col items-center justify-center gap-3 rounded-t-full border-4 border-dashed border-altar-gold/60 pt-14 text-altar-gold transition-all duration-300 hover:scale-105 hover:border-altar-gold"
      >
        <span className="text-5xl transition-transform group-hover:scale-125">🐾</span>
        <span className="font-display text-xl font-bold">Añadir mascota</span>
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="animate-reveal relative flex flex-col gap-3 rounded-2xl border-4 border-altar-gold bg-altar-deep/80 p-5 text-left">
      <h3 className="font-display text-2xl font-black text-altar-gold">Nueva mascota</h3>
      <label className="text-sm text-altar-cream/80">
        Nombre *
        <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded bg-altar-night/60 px-3 py-2 text-altar-cream outline-none focus:ring-2 focus:ring-altar-gold" />
      </label>
      <label className="text-sm text-altar-cream/80">
        Raza y colores
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Ej. Pastor alemán · café con negro" className="mt-1 w-full rounded bg-altar-night/60 px-3 py-2 text-altar-cream outline-none focus:ring-2 focus:ring-altar-gold" />
      </label>
      <label className="text-sm text-altar-cream/80">
        Frase para recordarla
        <input value={note} onChange={(e) => setNote(e.target.value)} className="mt-1 w-full rounded bg-altar-night/60 px-3 py-2 text-altar-cream outline-none focus:ring-2 focus:ring-altar-gold" />
      </label>
      <label className="text-sm text-altar-cream/80">
        Foto *
        <input required type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} className="mt-1 w-full text-xs text-altar-cream/70 file:mr-3 file:rounded file:border-0 file:bg-altar-orange file:px-3 file:py-2 file:text-altar-night" />
      </label>
      {img && <img src={img} alt="Vista previa" className="h-24 w-24 rounded-t-full object-cover" />}
      <div className="flex gap-2">
        <button type="submit" className="rounded bg-altar-orange px-4 py-2 font-bold text-altar-night transition-transform hover:scale-105">Encender su veladora</button>
        <button type="button" onClick={() => setOpenForm(false)} className="rounded border border-altar-cream/40 px-4 py-2 text-altar-cream/80">Cancelar</button>
      </div>
    </form>
  );
}

function NoseIntro({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="bg-altar fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 p-6 text-center">
      <h1 className="font-display text-4xl font-black text-altar-gold md:text-6xl">Altar de mis perritos</h1>
      <div className="animate-float-y relative h-72 w-72 rounded-full bg-altar-orange/90 shadow-2xl">
        <div className="absolute left-16 top-20 h-8 w-8 rounded-full bg-altar-night" />
        <div className="absolute right-16 top-20 h-8 w-8 rounded-full bg-altar-night" />
        <button
          onClick={onEnter}
          aria-label="Presiona la nariz para entrar"
          className="animate-pulse-nose absolute left-1/2 top-36 -ml-14 h-20 w-28 rounded-[50%_50%_45%_45%/40%_40%_60%_60%] bg-altar-night shadow-inner transition-transform hover:scale-125 active:scale-90"
        >
          <span className="absolute left-5 top-8 h-4 w-5 rounded-full bg-altar-deep" />
          <span className="absolute right-5 top-8 h-4 w-5 rounded-full bg-altar-deep" />
          <span className="absolute left-6 top-2 h-3 w-8 rounded-full bg-altar-cream/30" />
        </button>
      </div>
      <p className="font-body text-lg text-altar-cream">Presiona la naricita para encender el altar 🐾</p>
      <Petals />
    </div>
  );
}

function Index() {
  const [open, setOpen] = useState(false);
  const [extraPets, setExtraPets] = useState<Pet[]>([]);
  const music = useAltarMusic();

  useEffect(() => {
    setExtraPets(loadExtraPets());
  }, []);

  const addPet = (pet: Pet) => {
    const next = [...extraPets, pet];
    setExtraPets(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // foto muy grande para guardar; se muestra solo en esta visita
    }
  };

  if (!open) return <NoseIntro onEnter={() => setOpen(true)} />;

  const allPets = [...baseDogs, ...extraPets];

  return (
    <main className="bg-altar relative min-h-screen overflow-hidden text-altar-cream">
      <Petals />
      <button
        onClick={music.toggle}
        aria-label={music.playing ? "Apagar música" : "Encender música"}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border-2 border-altar-gold bg-altar-deep/90 text-2xl shadow-xl transition-transform hover:scale-110"
      >
        {music.playing ? "🔥" : "🎵"}
      </button>
      <header className="relative">
        <PapelPicado />
        <div className="animate-reveal px-6 pb-8 pt-12 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-altar-orange">Día de Muertos</p>
          <h1 className="font-display mt-3 text-5xl font-black text-altar-gold transition-transform duration-300 hover:scale-105 md:text-7xl">
            Altar de mis perritos
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-altar-cream/80">
            Una flor de cempasúchil para guiar sus patitas de regreso a casa. Siempre en nuestro corazón.
          </p>
        </div>
        <div className="flex items-end justify-center gap-6 pb-6">
          {[0, 0.3, 0.6, 0.2, 0.5].map((d, i) => <Candle key={i} delay={d} tall={i === 2} />)}
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-x-10 gap-y-20 px-8 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {allPets.map((d, i) => <DogCard key={`${d.name}-${i}`} dog={d} i={i} />)}
        <AddPetForm onAdd={addPet} />
      </section>

      <footer className="relative pb-16 text-center">
        <div className="flex items-end justify-center gap-6 pb-8">
          {[0.1, 0.4, 0.7].map((d, i) => <Candle key={i} delay={d} tall={i === 1} />)}
        </div>
        <p className="font-display text-2xl italic text-altar-gold">“Nadie se va mientras se le recuerde.”</p>
      </footer>
    </main>
  );
}
