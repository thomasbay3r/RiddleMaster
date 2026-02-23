import type { AudioApi } from "../hooks/useAudio.ts";
import styles from "./AudioControls.module.css";

interface Props {
  audio: AudioApi;
}

export default function AudioControls({ audio }: Props) {
  return (
    <div className={styles.wrapper}>
      <button
        className={styles.muteBtn}
        onClick={audio.toggleMute}
        aria-label={audio.isMuted ? "Unmute" : "Mute"}
        title={audio.isMuted ? "Unmute" : "Mute"}
      >
        {audio.isMuted ? "\u{1F507}" : "\u{1F50A}"}
      </button>

      <input
        type="range"
        className={styles.slider}
        min={0}
        max={1}
        step={0.01}
        value={audio.volume}
        onChange={(e) => audio.setVolume(Number(e.target.value))}
        aria-label="Volume"
      />
    </div>
  );
}
