import { useEffect, useRef, useState } from "react";

interface CountUpOptions {
  /** Starting value of the animation. Defaults to 0. */
  from?: number;
  /** Animation length in milliseconds. */
  durationMs?: number;
}

/**
 * Animate a number from `from` to `target` once the target becomes available.
 * Returns `null` while `target` is `null` (e.g. loading or error state).
 * `target` may be lower than `from`, in which case the value counts down.
 * The count-up runs once; later re-renders with the same data show the final
 * value, and `prefers-reduced-motion` skips straight to it.
 */
export function useCountUp(
  target: number | null,
  { from = 0, durationMs = 3000 }: CountUpOptions = {},
): number | null {
  const [value, setValue] = useState<number | null>(
    target === null ? null : from,
  );
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

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setValue(target);
      animatedRef.current = true;
      return;
    }

    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // ease-out quint: decelerates very hard, so the value crawls into
      // the target over a long, visibly slowing tail.
      const eased = 1 - Math.pow(1 - t, 5);
      setValue(Math.round(from + eased * (target - from)));
      // Mark "done" only on completion — not at the start. Strict Mode runs
      // the effect twice on mount (effect → cleanup → effect); flagging early
      // would make the second run skip straight to the target.
      if (t < 1) raf = requestAnimationFrame(step);
      else animatedRef.current = true;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, from, durationMs]);

  return value;
}
