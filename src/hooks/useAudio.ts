import { useCallback, useEffect, useRef, useState } from "react";
import { Howl } from "howler";

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
/*  Safely create a Howl — returns null if the file cannot load        */
/* ------------------------------------------------------------------ */

function safeHowl(opts: ConstructorParameters<typeof Howl>[0]): Howl | null {
  try {
    const h = new Howl({
      ...opts,
      onloaderror: (_id: number, _err: unknown) => {
        /* silently ignore missing audio files */
      },
      onplayerror: (_id: number, _err: unknown) => {
        /* silently ignore play errors */
      },
    });
    return h;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useAudio(): AudioApi {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.3);

  const musicRef = useRef<Howl | null>(null);
  const sfxRef = useRef<Record<SfxName, Howl | null>>({
    click: null,
    solved: null,
    reveal: null,
  });

  /* ---- lazy-init sounds ----------------------------------------- */

  useEffect(() => {
    musicRef.current = safeHowl({
      src: ["/audio/ambient.mp3"],
      loop: true,
      volume: 0.3,
      html5: true,
    });

    sfxRef.current = {
      click: safeHowl({ src: ["/audio/click.mp3"], volume: 0.5 }),
      solved: safeHowl({ src: ["/audio/solved.mp3"], volume: 0.6 }),
      reveal: safeHowl({ src: ["/audio/reveal.mp3"], volume: 0.5 }),
    };

    return () => {
      musicRef.current?.unload();
      Object.values(sfxRef.current).forEach((h) => h?.unload());
    };
  }, []);

  /* ---- public API ------------------------------------------------ */

  const playMusic = useCallback(() => {
    const m = musicRef.current;
    if (m && !m.playing()) {
      m.volume(volume);
      m.mute(isMuted);
      m.play();
    }
  }, [volume, isMuted]);

  const stopMusic = useCallback(() => {
    musicRef.current?.stop();
  }, []);

  const playSfx = useCallback(
    (name: SfxName) => {
      const s = sfxRef.current[name];
      if (s && !isMuted) {
        s.volume(volume);
        s.play();
      }
    },
    [isMuted, volume],
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      musicRef.current?.mute(next);
      return next;
    });
  }, []);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    musicRef.current?.volume(clamped);
  }, []);

  return { playMusic, stopMusic, playSfx, toggleMute, setVolume, isMuted, volume };
}
