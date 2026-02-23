import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SfxName = "click" | "solved" | "reveal";

export interface AudioApi {
  playMusic: () => void;
  stopMusic: () => void;
  playSfx: (name: SfxName) => void;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  isMuted: boolean;
  volume: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Create a gain node connected to the destination. */
function makeGain(ctx: AudioContext, value: number): GainNode {
  const g = ctx.createGain();
  g.gain.value = value;
  g.connect(ctx.destination);
  return g;
}

/* ------------------------------------------------------------------ */
/*  SFX generators                                                     */
/* ------------------------------------------------------------------ */

/** Short sine blip at 800 Hz, 50 ms with quick decay. */
function playClick(ctx: AudioContext, vol: number) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = makeGain(ctx, 0);

  osc.type = "sine";
  osc.frequency.value = 800;
  osc.connect(gain);

  gain.gain.setValueAtTime(vol * 0.5, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.start(now);
  osc.stop(now + 0.06);
}

/** Ascending arpeggio: C5, E5, G5, C6 — sine waves with decay. */
function playSolved(ctx: AudioContext, vol: number) {
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  const now = ctx.currentTime;

  notes.forEach((freq, i) => {
    const t = now + i * 0.1;
    const osc = ctx.createOscillator();
    const gain = makeGain(ctx, 0);

    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(gain);

    gain.gain.setValueAtTime(vol * 0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.start(t);
    osc.stop(t + 0.4);
  });
}

/** Shimmer — multiple high-frequency sine waves fading in and out. */
function playReveal(ctx: AudioContext, vol: number) {
  const freqs = [2000, 2500, 3000, 3500, 4000];
  const now = ctx.currentTime;
  const duration = 1.5;

  freqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = makeGain(ctx, 0);

    osc.type = "sine";
    osc.frequency.value = freq + (Math.random() - 0.5) * 50;
    osc.connect(gain);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol * 0.08, now + duration * 0.3);
    gain.gain.linearRampToValueAtTime(0.001, now + duration);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  });
}

const sfxPlayers: Record<SfxName, (ctx: AudioContext, vol: number) => void> = {
  click: playClick,
  solved: playSolved,
  reveal: playReveal,
};

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useAudio(): AudioApi {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.3);

  const ctxRef = useRef<AudioContext | null>(null);
  /* Music nodes */
  const musicGainRef = useRef<GainNode | null>(null);
  const musicOscsRef = useRef<OscillatorNode[]>([]);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null);
  const musicPlayingRef = useRef(false);

  /* ---- lazy AudioContext ----------------------------------------- */

  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  /* ---- cleanup --------------------------------------------------- */

  useEffect(() => {
    return () => {
      musicOscsRef.current.forEach((o) => {
        try { o.stop(); } catch { /* already stopped */ }
      });
      lfoRef.current?.stop();
      ctxRef.current?.close();
    };
  }, []);

  /* ---- music ----------------------------------------------------- */

  const playMusic = useCallback(() => {
    if (musicPlayingRef.current) return;
    const ctx = getCtx();

    // Master gain for music
    const masterGain = ctx.createGain();
    masterGain.gain.value = isMuted ? 0 : volume * 0.15;
    masterGain.connect(ctx.destination);
    musicGainRef.current = masterGain;

    // LFO for breathing effect (modulates gain)
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.5; // centre level
    lfoGain.connect(masterGain.gain);
    lfoGainRef.current = lfoGain;

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.1; // 0.1 Hz — 10 s breath cycle
    lfo.connect(lfoGain);
    lfo.start();
    lfoRef.current = lfo;

    // Two detuned sine waves for a gentle beating pad
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 220;
    osc1.connect(masterGain);
    osc1.start();

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = 220.5;
    osc2.connect(masterGain);
    osc2.start();

    musicOscsRef.current = [osc1, osc2];
    musicPlayingRef.current = true;
  }, [getCtx, volume, isMuted]);

  const stopMusic = useCallback(() => {
    musicOscsRef.current.forEach((o) => {
      try { o.stop(); } catch { /* ignore */ }
    });
    musicOscsRef.current = [];
    try { lfoRef.current?.stop(); } catch { /* ignore */ }
    lfoRef.current = null;
    musicGainRef.current?.disconnect();
    musicGainRef.current = null;
    lfoGainRef.current = null;
    musicPlayingRef.current = false;
  }, []);

  /* ---- sfx ------------------------------------------------------- */

  const playSfx = useCallback(
    (name: SfxName) => {
      if (isMuted) return;
      const ctx = getCtx();
      sfxPlayers[name](ctx, volume);
    },
    [isMuted, volume, getCtx],
  );

  /* ---- mute / volume --------------------------------------------- */

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (musicGainRef.current) {
        musicGainRef.current.gain.value = next ? 0 : volume * 0.15;
      }
      return next;
    });
  }, [volume]);

  const setVolume = useCallback(
    (v: number) => {
      const clamped = Math.max(0, Math.min(1, v));
      setVolumeState(clamped);
      if (musicGainRef.current && !isMuted) {
        musicGainRef.current.gain.value = clamped * 0.15;
      }
    },
    [isMuted],
  );

  return { playMusic, stopMusic, playSfx, toggleMute, setVolume, isMuted, volume };
}
