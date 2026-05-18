import { useEffect, useRef, useState } from "react";

/**
 * Animate a number from 0 up to `target` once it becomes available.
 * Returns `null` while `target` is `null` (e.g. loading or error state).
 * The count-up runs once; later re-renders with the same data show the final
 * value, and `prefers-reduced-motion` skips straight to it.
 */
export function useCountUp(
  target: number | null,
  durationMs = 900,
): number | null {
  const [value, setValue] = useState<number | null>(target);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (target === null) {
      setValue(null);
      animatedRef.current = false;
      return;
    }
    if (animatedRef.current) {
      setValue(target);
      return;
    }
    animatedRef.current = true;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setValue(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}
