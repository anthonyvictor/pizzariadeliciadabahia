import { useEffect, useRef } from "react";

export const useAutoFocus = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return { inputRef };
};
