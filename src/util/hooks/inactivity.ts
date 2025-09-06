import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useModoStore } from "src/infra/zustand/modo";

interface UseInactivityTimerOptions {
  inactivityLimit?: number; // segundos até mostrar aviso
  warningLimit?: number; // segundos até executar ação
  onTimeout?: () => void; // ação ao expirar
  warningVisible: () => boolean;
}

export function useInactivityTimer({
  inactivityLimit = 15,
  warningLimit = 30,
  warningVisible = () => true,
  onTimeout,
}: UseInactivityTimerOptions) {
  const router = useRouter();

  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);

  const resetTimers = () => {
    if (!warningVisible()) return;
    setShowWarning(false);
    setCountdown(0);

    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (warningTimer.current) clearInterval(warningTimer.current);

    inactivityTimer.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(warningLimit);

      warningTimer.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(warningTimer.current!);
            if (onTimeout) {
              onTimeout();
            } else {
              router.push("/inicio"); // fallback padrão
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, inactivityLimit * 1000);
  };

  useEffect(() => {
    resetTimers();

    const handleActivity = () => resetTimers();

    window.addEventListener("click", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    return () => {
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      if (warningTimer.current) clearInterval(warningTimer.current);
    };
  }, []);

  return { showWarning, countdown, resetTimers };
}
