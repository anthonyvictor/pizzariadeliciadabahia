export function setupConsoleInterceptor() {
  if (typeof window === "undefined") return; // evita rodar no SSR

  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  function intercept(
    type: "log" | "warn" | "error",
    original: (...args: any[]) => void
  ) {
    return (...args: any[]) => {
      const message = args.map(String).join(" ");
      // aqui você pode empilhar em window.__capturedLogs ou Zustand, Context, etc.
      window.__capturedLogs = [
        ...(window.__capturedLogs || []),
        `[${type.toUpperCase()}] ${message}`,
      ];
      original(...args);
    };
  }

  console.log = intercept("log", originalLog);
  console.warn = intercept("warn", originalWarn);
  console.error = intercept("error", originalError);
}

// já ativa no import
setupConsoleInterceptor();
