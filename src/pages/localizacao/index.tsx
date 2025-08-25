import { NextPage } from "next";
import { LocalizacaoStyle } from "@styles/pages/localizacao/styles";
import TextContainer from "@components/textContainer";

const Localizacao: NextPage = () => {
  return (
    <LocalizacaoStyle>
      <TextContainer
        title="LOCALIZAÇÃO"
        subtitle="Ficamos localizados na Ladeira do Jardim Zoológico, 427-B, Alto de
      Ondina, Salvador - BA"
      />

      <div className="frame">
        <iframe
          title="mapa"
          id="gmap_canvas"
          src={`https://maps.google.com/maps?q=pizzaria delicia da bahia&t=&z=18&ie=UTF8&iwloc=A&output=embed`}
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
        ></iframe>
      </div>
    </LocalizacaoStyle>
  );
};

export default Localizacao;
