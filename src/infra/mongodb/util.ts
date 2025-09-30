import mongoose, { Model } from "mongoose";
import { ff } from "tpdb-lib";

// export async function bulkUpsert(docs: any[], m: Model<any>) {
//   const operations = docs.map((doc) => {
//     if (doc.id || doc._id) {
//       const id = doc.id || doc._id;

//       // remove id do objeto para não tentar sobrescrever
//       const { id: _, _id, ...updateFields } = doc;

//       return {
//         updateOne: {
//           filter: { _id: new mongoose.Types.ObjectId(id) },
//           update: { $set: updateFields },
//           upsert: true,
//         },
//       };
//     } else {
//       return {
//         insertOne: {
//           document: doc,
//         },
//       };
//     }
//   });

//   return m.bulkWrite(operations);
// }

export async function bulkUpsert(docs: any[], m: Model<any>) {
  const operations = docs.map((doc) => {
    if (doc.id || doc._id) {
      const id = doc.id || doc._id;
      const { id: _, _id, ...updateFields } = doc;

      return {
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(id) },
          update: { $set: updateFields },
          upsert: true,
        },
      };
    } else {
      return {
        insertOne: {
          document: doc,
        },
      };
    }
  });

  // Executa operações
  const result = await m.bulkWrite(operations);

  // Agora precisamos buscar os documentos realmente afetados
  // 1. Pega todos os _ids de "upserts" criados
  const upsertedIds = result.upsertedIds
    ? Object.values(result.upsertedIds).map((v: any) => v._id)
    : [];

  // 2. Pega todos os ids originais que foram atualizados
  const updatedIds = docs
    .filter((d) => d.id || d._id)
    .map((d) => new mongoose.Types.ObjectId(d.id || d._id));

  const allIds = [...upsertedIds, ...updatedIds];

  // 3. Retorna os documentos já atualizados/inseridos
  return ff({
    m,
    q: { _id: { $in: allIds } },
  });
  //   .find({ _id: { $in: allIds } });
}
