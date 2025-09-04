import { conectarDB } from "src/infra/mongodb/config";
import { ICliente } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ClientesModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { normalizePhone } from "@util/enderecos/format";
import { uniqueId } from "lodash";
import { HTTPError } from "@models/error";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<string>>
) {
  try {
    if (req.method !== "POST") return res.status(405).end();

    const { email, senha } = req.body;
    const data = await loginLoja(email, senha);
    res.status(200).send(data);
  } catch (err) {
    console.error(err);
    if (err instanceof HTTPError) {
      res.status(err.code).end();
    } else {
      res.status(500).end();
    }
  }
}

export const loginLoja = async (email: string, senha: string) => {
  await conectarDB();

  console.log(senha, process.env.SENHA_LOJA);
  console.log(email.toLowerCase(), process.env.EMAIL_LOJA.toLowerCase());
  if (
    email.toLowerCase() === process.env.EMAIL_LOJA.toLowerCase() &&
    senha === process.env.SENHA_LOJA
  )
    return uniqueId();
  throw new HTTPError("Email/senha incorretos!", 404);
};
