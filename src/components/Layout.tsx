import { Outlet, useOutletContext } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Starfield from "./Starfield.tsx";
import AudioControls from "./AudioControls.tsx";
import { useAudio, type AudioApi } from "../hooks/useAudio.ts";
import styles from "./Layout.module.css";

export default function Layout() {
  const audio = useAudio();

  return (
    <div className={styles.layout}>
      <Starfield />

      <main className={styles.main}>
        <AnimatePresence mode="wait">
          <Outlet context={audio} />
        </AnimatePresence>
      </main>

      <AudioControls audio={audio} />
    </div>
  );
}

/**
 * Convenience hook for child routes to access the audio API
 * via React Router's outlet context.
 */
export function useLayoutAudio(): AudioApi {
  return useOutletContext<AudioApi>();
}
