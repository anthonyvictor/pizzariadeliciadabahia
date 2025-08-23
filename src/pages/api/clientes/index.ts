import { conectarDB } from "src/infra/mongodb/config";
import { ICliente } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid, serializeMongo } from "tpdb-lib";
import { ClientesModel } from "tpdb-lib";
import { EnderecosModel } from "tpdb-lib";
import { RespType, salvarCookie } from "@util/api";
import { Types } from "mongoose";
import { DistanciasModel } from "tpdb-lib";
import { encontrarTaxa } from "@util/distancias";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<ICliente>>
) {
  if (req.method === "GET") {
    let data: ICliente | ICliente[];
    if (req.query.id) {
      data = await obterCliente(
        req.query.id as string,
        req.query.comEnderecoCompleto as unknown as boolean
      );
    } else {
      data = await obterClientes();
    }
    res.status(200).json(data);
  } else if (req.method === "POST") {
    const cliente = req.body.cliente;
    const data = await loginCliente(cliente);
    salvarCookie("clienteId", data.id, res, 60 * 60 * 24 * 30);
    res.writeHead(302, { Location: "/pedido" });
    res.end();
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterCliente = async (
  id: string | ICliente | undefined,
  comEnderecoCompleto = false
) => {
  if (!id) return null;
  if ((id as ICliente)?.id) return id as ICliente;

  await conectarDB();

  const cliente = await ffid({ m: ClientesModel, id: id as unknown as string });
  if (!cliente) return null;

  if (!cliente.enderecos || cliente.enderecos.length === 0) return cliente;

  const distancias = (await ff({ m: DistanciasModel })).sort(
    (a, b) => a.de - b.de
  );

  const enderecosCompletos = comEnderecoCompleto
    ? await Promise.all(
        cliente.enderecos.map(async (endereco: any) => {
          const enderecoExtra = (
            await ff({
              m: EnderecosModel,
              q: {
                cep: endereco.cep,
              },
            })
          )[0];

          const taxaPorDistancia = encontrarTaxa(
            enderecoExtra.distancia_metros,
            distancias
          );

          return {
            ...enderecoExtra,
            ...endereco,
            cep: endereco.cep,
            taxa: enderecoExtra?.taxa ?? taxaPorDistancia,
          };
        })
      )
    : cliente.enderecos;

  return { ...cliente, enderecos: enderecosCompletos } as ICliente;
};
export const obterClientes = async () => {
  await conectarDB();

  const data = await ff({ m: ClientesModel });

  return data;
};

export const loginCliente = async (cliente: ICliente) => {
  await conectarDB();

  const { nome, whatsapp, dadosExtras } = cliente as ICliente;

  const filter = { whatsapp: cliente.whatsapp };

  const clienteEncontrado = await ClientesModel.findOne(filter).lean();

  if (clienteEncontrado)
    return await obterCliente(clienteEncontrado._id.toString());

  const result = await ClientesModel.create({
    nome,
    whatsapp,
    dadosExtras: dadosExtras ?? [],
  });

  return await obterCliente(result._id.toString());
};
export const upsertCliente = async (cliente: ICliente) => {
  await conectarDB();

  const { id, enderecos: _enderecos, ...rest } = cliente as ICliente;

  const filter = id
    ? { _id: new Types.ObjectId(id) }
    : !!cliente.cpf
    ? { cpf: cliente.cpf }
    : { whatsapp: cliente.whatsapp };

  const update = {
    $set: {
      ...rest,
      enderecos: _enderecos?.length
        ? _enderecos.map((x) => ({
            cep: x.cep,
            numero: x.numero,
            local: x.local,
            referencia: x.referencia,
          }))
        : [],
    },
  };

  const result = serializeMongo(
    await ClientesModel.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }).lean()
  );

  return result as unknown as ICliente;
};
