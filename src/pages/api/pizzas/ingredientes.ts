import { IPizzaIngrediente } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff } from "tpdb-lib";
import { PizzaIngrsModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { bulkUpsert } from "src/infra/mongodb/util";
import { toArray } from "@util/array";
import { normalize } from "@util/format";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RespType<IPizzaIngrediente>>,
) {
  if (req.method === "GET") {
    let data;
    console.log("Entrou ingredientes api");
    data = await obterIngredientes();

    res.status(200).json(data);
  } else if (req.method === "POST") {
    let data;
    const { ingredientes } = req.body;

    if (!ingredientes) return res.status(400).end();

    data = await upsertIngredientes(toArray(ingredientes));
    res.status(200).json(data);
  } else {
    res.status(405).end(); // Método não permitido
  }
}

export const obterIngredientes = async () => {
  await conectarDB();

  const data = (
    (await ff({ m: PizzaIngrsModel })) as unknown as IPizzaIngrediente[]
  ).sort((a, b) => (b.disponivel ? 1 : a.disponivel ? -1 : 0));
  return data;
};

export const upsertIngredientes = async (ingredientes: IPizzaIngrediente[]) => {
  //   const slugify = (str: string) =>
  //   str
  //     .normalize("NFD")
  //     .replace(/[\u0300-\u036f]/g, "")
  //     .toLowerCase()
  //     .trim()
  //     .replace(/\s+/g, "_");

  //   const _ingredientes = await PizzaIngrsModel.find({
  //   slug: { $exists: false },
  // });

  // const ops = _ingredientes.map((ing) => {
  //   const slug = slugify(ing.nome);

  //   return {
  //     updateOne: {
  //       filter: { _id: ing._id },
  //       update: { $set: { slug } },
  //     },
  //   };
  // });

  // await PizzaIngrsModel.bulkWrite(ops);

  const ops = ingredientes.map((ing) => {
    const slug = normalize(ing.nome).replaceAll(" ", "_");

    return {
      updateOne: {
        filter: { slug },
        update: {
          $set: {
            substituto: ing.substituto,
            disponivel: ing.disponivel,
          },
          $setOnInsert: {
            nome: ing.nome,
            slug,
          },
        },
        upsert: true,
      },
    };
  });

  const data = await PizzaIngrsModel.bulkWrite(ops);

  return data;
};
