import { NoLogError } from "@models/error";
import { api } from "@util/axios";
import { toast } from "react-toastify";
import { axiosOk } from "@util/axios";
import { ZodSchema } from "zod";

export const salvar = async (url: string, key: string, data: any) => {
  try {
    console.log(data);
    const res = await api.post(url, {
      [key]: data,
    });
    // if (!axiosOk(res.status) || !res.data)
    //   throw new NoLogError("Erro ao Salvar");
    return res.data;
  } catch (err) {
    console.error(err);
    toast.error("Oops, não foi possível salvar!");
  }
};

export const validar = (schema: ZodSchema, data: any) => {
  const resultado = schema.safeParse(data);

  if (!resultado.success) {
    toast.error(`${resultado.error.issues[0].message}`);
    return false;
  }

  return true;
};
