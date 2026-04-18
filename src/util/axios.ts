import { env } from "@config/env";
import axios from "axios";

export const api = axios.create({
  baseURL: env.apiURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosOk = (status: number) => {
  return status >= 200 && status < 300;
};
