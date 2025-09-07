import { useState, useEffect, useRef, useCallback } from "react";

export function useTimer() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onFinishRef = useRef<(() => void) | null>(null);

  const start = useCallback((duration: number, onFinish?: () => void) => {
    setTimeLeft(duration);
    onFinishRef.current = onFinish || null;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;

          if (onFinishRef.current) {
            onFinishRef.current();
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setTimeLeft(null);
    onFinishRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { timeLeft, start, reset, running: timeLeft !== null };
}
