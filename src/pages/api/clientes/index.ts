import { conectarDB } from "src/infra/mongodb/config";
import { ICliente, populates } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid, serializeMongo } from "tpdb-lib";
import { ClientesModel } from "tpdb-lib";
import { RespType } from "@util/api";
import mongoose, { Types } from "mongoose";
import { normalizePhone } from "@util/enderecos/format";
import { obterDistancias } from "@routes/distancias";
import { encontrarTaxa } from "@util/distancias";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<ICliente>>
) {
  try {
    if (req.method === "GET") {
      let data: ICliente | ICliente[];
      if (req.query.id) {
        data = await obterCliente(req.query.id as string);
      } else {
        const { ids } = req.query as {
          ids: any;
        };
        data = await obterClientes({ ids });
      }
      res.status(200).json(data);
    } else if (req.method === "POST") {
      const cliente = req.body.cliente;
      const data = await loginCliente(cliente);
      res.status(200).send(data);
    } else {
      res.status(405).end(); // Método não permitido
    }
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
}

export const obterCliente = async (id: string | ICliente | undefined) => {
  if (!id) return null;
  if ((id as ICliente)?.id) return id as ICliente;

  await conectarDB();

  const cliente = await ffid({
    m: ClientesModel,
    id: id as unknown as string,
    populates: populates.clientes,
  });

  const distancias = await obterDistancias();

  return {
    ...cliente,
    enderecos: (cliente?.enderecos ?? []).map((endereco) => {
      const taxa = encontrarTaxa(
        endereco.enderecoOriginal.distancia_metros,
        distancias
      );

      console.log(
        "taxaaaaaaa",
        taxa,
        endereco.enderecoOriginal.taxa != null
          ? endereco.enderecoOriginal.taxa
          : taxa
      );

      return {
        ...endereco,
        enderecoOriginal: {
          ...endereco.enderecoOriginal,
          taxa:
            endereco.enderecoOriginal.taxa != null
              ? endereco.enderecoOriginal.taxa
              : taxa,
        },
      };
    }),
  };
};
export const obterClientes = async ({ ids }: { ids?: string[] }) => {
  await conectarDB();
  const q: any = {};
  if (ids && ids.length)
    q._id = { $in: ids.map((x) => new mongoose.Types.ObjectId(x)) };
  let clientes = await ff({
    m: ClientesModel,
    q,
    populates: populates.clientes,
  });

  const distancias = await obterDistancias();

  return clientes.map((cliente) => {
    return {
      ...cliente,
      enderecos: (cliente?.enderecos ?? []).map((endereco) => {
        const taxa = encontrarTaxa(
          endereco.enderecoOriginal.distancia_metros,
          distancias
        );
        return {
          ...endereco,
          enderecoOriginal: {
            ...endereco.enderecoOriginal,
            taxa:
              endereco.enderecoOriginal.taxa != null
                ? endereco.enderecoOriginal.taxa
                : taxa,
          },
        };
      }),
    };
  });
};

export const loginCliente = async (cliente: ICliente) => {
  await conectarDB();

  const { nome, whatsapp, dadosExtras } = cliente as ICliente;

  const filter = { whatsapp: normalizePhone(whatsapp) };

  const clienteEncontrado = await ClientesModel.findOne(filter).lean();

  if (clienteEncontrado)
    return await obterCliente(clienteEncontrado._id.toString());

  const result = await ClientesModel.create({
    nome,
    whatsapp: normalizePhone(whatsapp),
    dadosExtras: dadosExtras ?? [],
  });

  return await obterCliente(result._id.toString());
};
// export const upsertCliente = async (cliente: ICliente) => {
//   await conectarDB();

//   const { id, enderecos: _enderecos, ...rest } = cliente as ICliente;

//   const filter = id
//     ? { _id: new Types.ObjectId(id) }
//     : !!cliente.cpf
//     ? { cpf: cliente.cpf }
//     : { whatsapp: cliente.whatsapp };

//   const update = {
//     $set: {
//       ...rest,
//       enderecos: _enderecos?.length
//         ? _enderecos.map((x) => ({
//             cep: x.cep,
//             numero: x.numero,
//             local: x.local,
//             referencia: x.referencia,
//           }))
//         : [],
//     },
//   };

//   const result = serializeMongo(
//     await ClientesModel.findOneAndUpdate(filter, update, {
//       new: true,
//       upsert: true,
//       setDefaultsOnInsert: true,
//     }).lean()
//   );

//   return result as unknown as ICliente;
// };
