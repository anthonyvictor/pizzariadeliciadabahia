import { IConfig } from "tpdb-lib";
import type { NextApiRequest, NextApiResponse } from "next";
import { ff, ffid } from "tpdb-lib";
import { ConfigsModel } from "tpdb-lib";
import { RespType } from "@util/api";
import { conectarDB } from "src/infra/mongodb/config";
import { produtoDispPelasRegras } from "@util/regras";
import { obterCliente } from "@routes/clientes";
import { ObterProduto, ObterProdutos } from "src/infra/dtos";
import { HTTPError } from "@models/error";

// Função handler da rota
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      let data;

      const { chave, chaves } = req.query;

      const dto = [];
      if (chave) dto.concat(Array.isArray(chave) ? chave : [chave]);
      if (chaves) dto.concat(Array.isArray(chaves) ? chaves : [chaves]);

      data = await obterConfigs(dto);

      res.status(200).json(data);
    } else if (req.method === "POST") {
      const data = await createConfigs();
      res.status(200).json(data);
    } else {
      res.status(405).end(); // Método não permitido
    }
  } catch (err) {
    console.error(err.message, err.stack);
    res.status(500).end();
  }
}

export const obterConfigs = async (chaves?: string[]) => {
  await conectarDB();
  const q: any = {};

  if (chaves) {
    q.chave = { $in: Array.isArray(chaves) ? chaves : [chaves] };
  }
  const data = (await ff({ m: ConfigsModel, q })) as unknown as IConfig[];

  const configs: IConfig[] = [
    {
      chave: "pagamento",
      valor: {
        chavePix: "86160308599",
        trocoMax: 70,
        cartoesRecusados: ["will"],
        metodos: {
          pix: { disponivel: true },
          especie: {
            disponivel: true,
            condicoes: [
              {
                id: "",
                tipo: "enderecos_horarios",
                valor: [
                  {
                    enderecos: [
                      { tipo: "bairros", valor: ["ondina", "rio vermelho"] },
                    ],
                    horario: { de: { h: 22, m: 30 }, ate: { h: 5 } },
                  },
                ],
                ativa: true,
              },
            ],
            excecoes: [
              {
                id: "",
                tipo: "min_distancia",
                valor: 5000,
                ativa: true,
              },

              {
                id: "",
                tipo: "periodos_horarios",
                valor: [{ de: { h: 23, m: 30 }, ate: { h: 5 } }],
                ativa: true,
              },
            ],
          },
          cartao: {
            disponivel: true,
            condicoes: [
              {
                id: "",
                tipo: "enderecos_horarios",
                valor: [
                  {
                    enderecos: [
                      { tipo: "bairros", valor: ["ondina", "rio vermelho"] },
                    ],
                    horario: { de: { h: 22, m: 30 }, ate: { h: 5 } },
                  },
                ],
                ativa: true,
              },
            ],
            excecoes: [
              {
                id: "",
                tipo: "min_distancia",
                valor: 5000,
                ativa: true,
              },

              {
                id: "",
                tipo: "periodos_horarios",
                valor: [{ de: { h: 23, m: 30 }, ate: { h: 5 } }],
                ativa: true,
              },
            ],
          },
        },
      },
    },
    {
      chave: "estimativa",
      valor: { retirada: { de: 30, ate: 50 }, entrega: { de: 40, ate: 60 } },
    },
    {
      chave: "horario_funcionamento",
      valor: {
        liberadoAte: new Date(),
        descricao:
          "Funcionamos de terça à domingo e feriados, das 18:30 até 23:30",
        condicoes: [
          {
            id: "",
            ativa: true,
            tipo: "periodos_dias",
            valor: [{ de: 3, ate: 1 }],
          },
          {
            id: "",
            ativa: true,
            tipo: "periodos_horarios",
            valor: [{ de: { h: 18, m: 30 }, ate: { h: 23, m: 30 } }],
          },
          {
            id: "",
            ativa: true,
            tipo: "datas",
            valor: [{ y: 2025, m: 12, d: 8 }],
          },
        ],
      },
    },
    {
      chave: "entrega_avancada",
      valor: {
        disponivel: true,
        condicoes: [
          {
            id: "",
            tipo: "periodos_horarios",
            valor: [{ de: { h: 18, m: 30 }, ate: { h: 23, m: 30 } }],
            ativa: true,
          },
        ],
        taxaAdicional: "* 3",
      },
    },
    {
      chave: "entrega",
      valor: {
        disponivel: true,
        condicoes: [
          {
            id: "",
            tipo: "periodos_horarios",
            valor: [{ de: { h: 5 }, ate: { h: 23, m: 30 } }],
            ativa: true,
          },
        ],
        excecoes: [
          {
            id: "",
            tipo: "enderecos_horarios",
            valor: [
              {
                enderecos: [
                  {
                    tipo: "bairros",
                    valor: [
                      "calabar",
                      "alto das pombas",
                      "brotas",
                      "cosme de farias",
                      "engenho velho de brotas",
                      "engenho velho da federação",
                      "federação",
                    ],
                  },
                ],
                horario: { de: { h: 22, m: 30 }, ate: { h: 4, m: 59 } },
              },
            ],
            ativa: true,
          },
          {
            id: "",
            tipo: "min_distancia",
            valor: 8000,
            ativa: true,
          },
        ],
        adicionalDinamico: {
          valor: "* 3",
          ate: new Date("2025-08-31 07:00:00"),
        },
      },
    },
  ];

  return data;
};

export const createConfigs = async () => {
  const configs = [
    {
      chave: "pagamento",
      valor: {
        chavePix: "86160308599",
        trocoMax: 70,
        cartoesRecusados: ["will"],
        metodos: {
          pix: {
            disponivel: true,
          },
          especie: {
            disponivel: true,
            condicoes: [
              {
                tipo: "enderecos_horarios",
                valor: [
                  {
                    enderecos: [
                      {
                        tipo: "bairros",
                        valor: ["ondina", "rio vermelho"],
                      },
                    ],
                    horario: {
                      de: {
                        h: 22,
                        m: 30,
                      },
                      ate: {
                        h: 5,
                      },
                    },
                  },
                ],
                ativa: true,
              },
            ],
            excecoes: [
              {
                tipo: "min_distancia",
                valor: 5000,
                ativa: true,
              },
              {
                tipo: "periodos_horarios",
                valor: [
                  {
                    de: {
                      h: 23,
                      m: 30,
                    },
                    ate: {
                      h: 5,
                    },
                  },
                ],
                ativa: true,
              },
            ],
          },
          cartao: {
            disponivel: true,
            condicoes: [
              {
                tipo: "enderecos_horarios",
                valor: [
                  {
                    enderecos: [
                      {
                        tipo: "bairros",
                        valor: ["ondina", "rio vermelho"],
                      },
                    ],
                    horario: {
                      de: {
                        h: 22,
                        m: 30,
                      },
                      ate: {
                        h: 5,
                      },
                    },
                  },
                ],
                ativa: true,
              },
            ],
            excecoes: [
              {
                tipo: "min_distancia",
                valor: 5000,
                ativa: true,
              },
              {
                tipo: "periodos_horarios",
                valor: [
                  {
                    de: {
                      h: 23,
                      m: 30,
                    },
                    ate: {
                      h: 5,
                    },
                  },
                ],
                ativa: true,
              },
            ],
          },
        },
      },
    },
    {
      chave: "estimativa",
      valor: {
        retirada: {
          de: 30,
          ate: 50,
        },
        entrega: {
          de: 40,
          ate: 60,
        },
      },
    },
    {
      chave: "horario_funcionamento",
      valor: {
        liberadoAte: "2025-09-03T07:06:51.975Z",
        descricao:
          "Funcionamos de terça à domingo e feriados, das 18:30 até 23:30",
        condicoes: [
          {
            ativa: true,
            tipo: "periodos_dias",
            valor: [
              {
                de: 3,
                ate: 1,
              },
            ],
          },
          {
            ativa: true,
            tipo: "periodos_horarios",
            valor: [
              {
                de: {
                  h: 18,
                  m: 30,
                },
                ate: {
                  h: 23,
                  m: 30,
                },
              },
            ],
          },
          {
            ativa: true,
            tipo: "datas",
            valor: [
              {
                y: 2025,
                m: 12,
                d: 8,
              },
            ],
          },
        ],
      },
    },
    {
      chave: "entrega_avancada",
      valor: {
        disponivel: true,
        condicoes: [
          {
            tipo: "periodos_horarios",
            valor: [
              {
                de: {
                  h: 18,
                  m: 30,
                },
                ate: {
                  h: 23,
                  m: 30,
                },
              },
            ],
            ativa: true,
          },
        ],
        taxaAdicional: "* 3",
      },
    },
    {
      chave: "entrega",
      valor: {
        disponivel: true,
        condicoes: [
          {
            tipo: "periodos_horarios",
            valor: [
              {
                de: {
                  h: 5,
                },
                ate: {
                  h: 23,
                  m: 30,
                },
              },
            ],
            ativa: true,
          },
        ],
        excecoes: [
          {
            tipo: "enderecos_horarios",
            valor: [
              {
                enderecos: [
                  {
                    tipo: "bairros",
                    valor: [
                      "calabar",
                      "alto das pombas",
                      "brotas",
                      "cosme de farias",
                      "engenho velho de brotas",
                      "engenho velho da federação",
                      "federação",
                    ],
                  },
                ],
                horario: {
                  de: {
                    h: 22,
                    m: 30,
                  },
                  ate: {
                    h: 4,
                    m: 59,
                  },
                },
              },
            ],
            ativa: true,
          },
          {
            tipo: "min_distancia",
            valor: 8000,
            ativa: true,
          },
        ],
      },
    },
  ];
  await ConfigsModel.create(configs);

  return await obterConfigs();
};
