import { MyInputStyle } from "@components/pedido/myInput/styles";
import { useState } from "react";
import { DatetimeInput } from "react-easy-ux";
import { BiTrash } from "react-icons/bi";
import { EditorForm } from "src/views/loja/components/editorForm";
import { DescricaoInput } from "src/views/loja/components/inputs";
import {
  IConfigHorarioFuncionamento,
  ICliente,
  IPeriodoHorario,
} from "tpdb-lib";
import { useConfigs } from "../context";
import { formatDataFutura } from "@util/date";

export const Horario = ({
  config,
}: {
  config: IConfigHorarioFuncionamento;
}) => {
  const [formData, setFormData] = useState<IConfigHorarioFuncionamento>(config);
  const { setEditando, handleSubmit, configs } = useConfigs();

  const configsHorarios = configs.find(
    (x) => x.chave === "horario_funcionamento",
  )?.valor;
  const horarios = (
    configsHorarios as IConfigHorarioFuncionamento
  ).condicoes.find(
    (x) =>
      x.tipo === "periodos_horarios" &&
      x.ativa &&
      (!x.validaAte || new Date().getTime() > new Date(x.validaAte).getTime()),
  )?.valor;

  const Dt = ({
    chave,
    badgeClick,
  }: {
    chave: "fechadoAte" | "liberadoAte";
    badgeClick: (min: number | Date) => void;
  }) => {
    return (
      <MyInputStyle>
        <div className="input-label">
          <label>
            {chave === "liberadoAte" ? `Liberado` : `Fechado`} até{" "}
            {formData[chave] &&
            new Date(formData[chave]).getTime() > new Date().getTime()
              ? formatDataFutura(formData[chave])
              : "..."}
          </label>
          <div className="input-buttons">
            <DatetimeInput
              value={formData[chave] ? new Date(formData[chave]) : null}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [chave]: e,
                }));
              }}
            />

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  [chave]: null,
                }))
              }
            >
              <BiTrash />
            </button>
          </div>
          <ul className="badges no-scroll">
            {horarios?.length && (
              <>
                <li
                  className="badge"
                  onClick={() => {
                    const agora = new Date();
                    const periodo = horarios[0] as IPeriodoHorario;

                    if (chave === "fechadoAte") {
                      agora.setHours(periodo.de.h, periodo.de.m, 0);
                      badgeClick(agora);
                    } else {
                      agora.setHours(periodo.ate.h, periodo.ate.m, 59);
                      badgeClick(agora);
                    }
                  }}
                >
                  Fim do exp.
                </li>

                <li
                  className="badge"
                  onClick={() => {
                    const agora = new Date();
                    agora.setDate(agora.getDate() + 1);
                    const periodo = horarios[0] as IPeriodoHorario;

                    if (chave === "fechadoAte") {
                      agora.setHours(periodo.de.h, periodo.de.m, 0);
                      badgeClick(agora);
                    } else {
                      agora.setHours(periodo.ate.h, periodo.ate.m, 59);
                      badgeClick(agora);
                    }
                  }}
                >
                  Amanhã
                </li>
              </>
            )}
            {(chave === "fechadoAte" //fechado ate amanha
              ? [10, 30, 60, 60 * 3, 60 * 12, 60 * 24, 60 * 24 * 2, 60 * 24 * 3]
              : [2, 5, 10, 20, 30, 60, 60 * 2]
            ).map((x) => {
              return (
                <li
                  className="badge"
                  key={x}
                  onClick={() => {
                    badgeClick(x);
                  }}
                >
                  +{x >= 60 * 24 ? x / 60 / 24 : x >= 60 ? x / 60 : x}
                  {x >= 60 * 24 ? "d" : x >= 60 ? "h" : "min"}
                </li>
              );
            })}
          </ul>
        </div>
      </MyInputStyle>
    );
  };

  return (
    <EditorForm
      handleClose={() => setEditando(undefined)}
      handleSubmit={() => handleSubmit("horario_funcionamento", formData)}
    >
      <DescricaoInput
        value={formData.descricao ?? ""}
        setValue={(val) =>
          setFormData((prev) => ({
            ...prev,
            descricao: val,
          }))
        }
      />
      <Dt
        chave="fechadoAte"
        badgeClick={(x) => {
          const fechadoAte = new Date(formData.fechadoAte);
          if (fechadoAte && fechadoAte > new Date()) {
            if (x instanceof Date) {
              fechadoAte.setTime(x.getTime());
            } else {
              fechadoAte.setMinutes(fechadoAte.getMinutes() + x);
            }
            setFormData((prev) => ({
              ...prev,
              fechadoAte: fechadoAte,
            }));
          } else {
            const d = new Date();
            if (x instanceof Date) {
              d.setTime(x.getTime());
            } else {
              d.setMinutes(d.getMinutes() + x);
            }
            setFormData((prev) => ({
              ...prev,
              fechadoAte: d,
            }));
          }
        }}
      />
      <Dt
        chave="liberadoAte"
        badgeClick={(x) => {
          setFormData((prev) => {
            const novaData = new Date();
            if (x instanceof Date) {
              novaData.setTime(x.getTime());
            } else {
              novaData.setMinutes(novaData.getMinutes() + x);
            }
            return {
              ...prev,
              liberadoAte: novaData,
            };
          });
        }}
      />
    </EditorForm>
  );

  return <></>;
};
