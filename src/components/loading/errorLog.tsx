import React, { useEffect, useState } from "react";

export default function ConsoleLogger() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // salva os originais
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;

    function intercept(type: "log" | "warn" | "error") {
      return (...args: any[]) => {
        const message = args.map(String).join(" ");
        setLogs((prev) => [...prev, `[${type.toUpperCase()}] ${message}`]);
        // mantém o comportamento original no console
        if (type === "error") originalError(...args);
        if (type === "warn") originalWarn(...args);
        if (type === "log") originalLog(...args);
      };
    }

    console.error = intercept("error");
    console.warn = intercept("warn");
    console.log = intercept("log");

    return () => {
      // restaura originais ao desmontar
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
    };
  }, []);

  return (
    <div style={{ background: "#111", color: "#eee", padding: "1rem" }}>
      <h2>Console em Tela</h2>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {logs.map((log, i) => (
          <div key={i} style={{ whiteSpace: "pre-wrap" }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
