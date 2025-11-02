// import { MyInputStyle } from "@components/pedido/myInput/styles";
// import { useState } from "react";
// import { DatetimeInput } from "react-easy-ui";
// import { BiTrash } from "react-icons/bi";
// import { EditorForm } from "src/views/loja/components/editorForm";
// import { DescricaoInput } from "src/views/loja/components/inputs";
import { IConfigHorarioFuncionamento, ICliente } from "tpdb-lib";
// import { useConfigs } from "../context";

export const Horario = ({
  config,
}: {
  config: IConfigHorarioFuncionamento;
}) => {
  // const [formData, setFormData] = useState<IConfigHorarioFuncionamento>(config);
  // const { setEditando, handleSubmit } = useConfigs();

  // const Dt = ({
  //   chave,
  //   badgeClick,
  // }: {
  //   chave: "fechadoAte" | "liberadoAte";
  //   badgeClick: (x: number) => void;
  // }) => {
  //   return (
  //     <MyInputStyle>
  //       <div className="input-label">
  //         <label>
  //           {chave === "liberadoAte" ? `Liberado` : `Fechado`} até...
  //         </label>
  //         <div className="input-buttons">
  //           <DatetimeInput
  //             value={formData[chave] ? new Date(formData[chave]) : null}
  //             onChange={(e) => {
  //               setFormData((prev) => ({
  //                 ...prev,
  //                 [chave]: e,
  //               }));
  //             }}
  //           />
  //           <button
  //             type="button"
  //             onClick={() =>
  //               setFormData((prev) => ({
  //                 ...prev,
  //                 [chave]: null,
  //               }))
  //             }
  //           >
  //             <BiTrash />
  //           </button>
  //         </div>
  //         <ul className="badges no-scroll">
  //           {(chave === "fechadoAte"
  //             ? [10, 30, fechado ate amanha 60, 60 * 3, 60 * 12, 60 * 24, 60 * 24 * 2, 60 * 24 * 3]
  //             : [2, 5,  10, 20, 30, 60, 60 * 2]
  //           ).map((x) => {
  //             return (
  //               <li
  //                 className="badge"
  //                 key={x}
  //                 onClick={() => {
  //                   badgeClick(x);
  //                 }}
  //               >
  //                 +{x >= 60 * 24 ? x / 60 / 24 : x >= 60 ? x / 60 : x}
  //                 {x >= 60 * 24 ? "d" : x >= 60 ? "h" : "min"}
  //               </li>
  //             );
  //           })}
  //         </ul>
  //       </div>
  //     </MyInputStyle>
  //   );
  // };

  // return (
  //   <EditorForm
  //     handleClose={() => setEditando(undefined)}
  //     handleSubmit={() => handleSubmit("horario_funcionamento", formData)}
  //   >
  //     <DescricaoInput
  //       value={formData.descricao ?? ""}
  //       setValue={(val) =>
  //         setFormData((prev) => ({
  //           ...prev,
  //           descricao: val,
  //         }))
  //       }
  //     />
  //     <Dt
  //       chave="fechadoAte"
  //       badgeClick={(x) => {
  //         const fechadoAte = new Date(formData.fechadoAte);
  //         if (fechadoAte && fechadoAte > new Date()) {
  //           fechadoAte.setMinutes(fechadoAte.getMinutes() + x);
  //           setFormData((prev) => ({
  //             ...prev,
  //             fechadoAte: fechadoAte,
  //           }));
  //         } else {
  //           const d = new Date();
  //           d.setMinutes(d.getMinutes() + x);
  //           setFormData((prev) => ({
  //             ...prev,
  //             fechadoAte: d,
  //           }));
  //         }
  //       }}
  //     />
  //     <Dt
  //       chave="liberadoAte"
  //       badgeClick={(x) => {
  //         setFormData((prev) => {
  //           const novaData = new Date();
  //           novaData.setMinutes(novaData.getMinutes() + x);
  //           return {
  //             ...prev,
  //             liberadoAte: novaData,
  //           };
  //         });
  //       }}
  //     />
  //   </EditorForm>
  // );

  return <></>;
};
