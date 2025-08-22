import fs from "fs";
import path from "path";

// Caminho do arquivo de logs
const logsPath = path.join(process.cwd(), "logs.json");

export function logJson(data: any) {
  try {
    let logs: any[] = [];

    // Se já existe, lemos o arquivo
    if (fs.existsSync(logsPath)) {
      const fileContent = fs.readFileSync(logsPath, "utf-8");
      logs = JSON.parse(fileContent || "[]");
    }

    // Adiciona timestamp e dados
    logs.push({
      timestamp: new Date().toISOString(),
      ...data,
    });

    // Salva de volta formatado
    fs.writeFileSync(logsPath, JSON.stringify(logs, null, 2), "utf-8");

    console.info("✅ Log salvo em logs.json");
  } catch (error) {
    console.error("❌ Erro ao salvar log:", error);
  }
}
