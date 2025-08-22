import { useItemBuilder } from "@context/itemContext";
import { ItemBuilderHeaderStyle } from "./styles";
import { formatCurrency } from "@util/format";
import Image from "next/image";
import { tamanhoDescricao } from "@util/pizza";

export const ItemBuilderHeader = () => {
  const { builder } = useItemBuilder();
  return (
    <ItemBuilderHeaderStyle>
      {/* <div
        className="capa"
        style={{
          backgroundImage: `url("${
            builder.tipo === "pizza"
              ? builder.tamanho.imagemUrl
              : builder.tipo === "bebida"
              ? builder.bebida.imagemUrl
              : builder.tipo === "lanche"
              ? builder.lanche.imagemUrl
              : builder.combo.imagemUrl
          }")`,
          objectFit:
            builder.tipo === "pizza"
              ? "cover"
              : builder.tipo === "bebida"
              ? "scale-down"
              : builder.tipo === "lanche"
              ? "cover"
              : "cover",
        }}
      /> */}
      <aside className="prod-img">
        <Image
          src={
            builder.tipo === "pizza"
              ? builder.tamanho.imagemUrl
              : builder.tipo === "bebida"
              ? builder.bebida.imagemUrl
              : builder.tipo === "lanche"
              ? builder.lanche.imagemUrl
              : builder.combo.imagemUrl
          }
          layout={"fill"}
          objectFit={
            builder.tipo === "pizza"
              ? "cover"
              : builder.tipo === "bebida"
              ? "contain"
              : builder.tipo === "lanche"
              ? "cover"
              : "cover"
          }
          objectPosition={"center top"}
          priority
        />
        <div className="bottom-shape">
          <div className="shape"></div>
        </div>
      </aside>
      <aside className="info">
        <h1 className="titulo">
          {builder.tipo === "pizza"
            ? `Pizza ${builder.tamanho.nome}`
            : builder.tipo === "bebida"
            ? builder.bebida.nome
            : builder.tipo === "lanche"
            ? builder.lanche.nome
            : builder.combo.nome}
        </h1>
        <small className="descricao">
          {builder.tipo === "pizza"
            ? tamanhoDescricao(builder.tamanho)
            : builder.tipo === "bebida"
            ? builder.bebida.descricao
            : builder.tipo === "lanche"
            ? builder.lanche.descricao
            : builder.combo.descricao}
        </small>
        <b>
          {builder.tipo === "combo"
            ? `À partir de ${formatCurrency(builder.combo.valorMin)}`
            : builder.tipo === "pizza"
            ? `À partir de ${formatCurrency(builder.tamanho.valorMin)}`
            : builder.tipo === "bebida"
            ? formatCurrency(builder.bebida.valor)
            : formatCurrency(builder.lanche.valor)}
        </b>
      </aside>
    </ItemBuilderHeaderStyle>
  );
};

//  <ItemBuilderHeaderStyle>
//       {/* <div
//           className="capa"
//           style={{
//             backgroundImage: `url("${
//               item.tipo === "pizza"
//                 ? item.tamanho.imagemUrl
//                 : item.tipo === "bebida"
//                 ? item.bebida.imagemUrl
//                 : item.tipo === "lanche"
//                 ? item.lanche.imagemUrl
//                 : item.combo.imagemUrl
//             }")`,
//           }}
//         /> */}

//       <aside className="info">
//         <h1 className="titulo">
//           {builder.tipo === "pizza"
//             ? `Pizza ${builder.tamanho.nome}`
//             : builder.tipo === "bebida"
//             ? builder.bebida.nome
//             : builder.tipo === "lanche"
//             ? builder.lanche.nome
//             : builder.combo.nome}
//         </h1>
//         <small className="descricao">
//           {builder.tipo === "pizza"
//             ? tamanhoDescricao(builder.tamanho)
//             : builder.tipo === "bebida"
//             ? builder.bebida.descricao
//             : builder.tipo === "lanche"
//             ? builder.lanche.descricao
//             : builder.combo.descricao}
//         </small>
//         <b>
//           {builder.tipo === "combo"
//             ? `À partir de ${formatCurrency(builder.combo.valorMin)}`
//             : builder.tipo === "pizza"
//             ? `À partir de ${formatCurrency(builder.tamanho.valorMin)}`
//             : builder.tipo === "bebida"
//             ? formatCurrency(builder.bebida.valor)
//             : formatCurrency(builder.lanche.valor)}
//         </b>
//       </aside>
//       <aside className="prod-img">
//         <Image
//           src={
//             builder.tipo === "pizza"
//               ? builder.tamanho.imagemUrl
//               : builder.tipo === "bebida"
//               ? builder.bebida.imagemUrl
//               : builder.tipo === "lanche"
//               ? builder.lanche.imagemUrl
//               : builder.combo.imagemUrl
//           }
//           layout={"fill"}
//           style={{ flexShrink: 0 }}
//           objectFit="cover"
//         />
//       </aside>
//     </ItemBuilderHeaderStyle>
