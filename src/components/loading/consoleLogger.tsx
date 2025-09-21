import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

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
        if (type === "error")
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

  return !logs.length ? (
    <></>
  ) : (
    <div style={{ background: "#111", color: "#eee", padding: "1rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <h2>Erros:</h2>
          <p>
            Por gentileza, mande um print ou informe à pizzaria os erros abaixo:
          </p>
        </div>
        <button
          style={{
            background: "transparent",
            border: "none",
            color: "#eee",
            cursor: "pointer",
            fontSize: "1.5rem",
          }}
          onClick={() => setLogs([])}
        >
          <MdClose />
        </button>
      </header>
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
