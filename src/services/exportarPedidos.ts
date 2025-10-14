// import mongoose from "mongoose";
// import fs from "fs";
// import dayjs from "dayjs";
// import { Pedido } from "../models/Pedido"; // seu model

export async function exportarPedidosAntigos() {
  // const limite = dayjs().subtract(90, "day").toDate();
  // // 1️⃣ Buscar pedidos antigos
  // const pedidos = await Pedido.find({ criadoEm: { $lt: limite } }).lean();
  // if (pedidos.length === 0)
  //   return console.log("Nenhum pedido antigo encontrado.");
  // // 2️⃣ Gerar arquivo CSV
  // const header = Object.keys(pedidos[0]).join(",");
  // const linhas = pedidos.map((p) => Object.values(p).join(","));
  // const conteudo = [header, ...linhas].join("\n");
  // // 3️⃣ Salvar localmente (ou enviar pro Google Drive / S3)
  // const filename = `backup_pedidos_${dayjs().format("YYYY-MM-DD")}.csv`;
  // fs.writeFileSync(filename, conteudo, "utf8");
  // // 4️⃣ Deletar do banco após exportar
  // await Pedido.deleteMany({ criadoEm: { $lt: limite } });
  // console.log(`Backup feito (${pedidos.length} pedidos) e removidos do banco.`);
}
