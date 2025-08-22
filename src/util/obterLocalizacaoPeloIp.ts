import axios from "axios";

export const obterLocalizacaoPeloIp = async (
  ctx: any
): Promise<[number, number] | null> => {
  let ipLoc: [number, number] | null = null;
  try {
    const req = ctx.req;

    const forwarded = req.headers["x-forwarded-for"];
    const ip =
      typeof forwarded === "string"
        ? forwarded.split(",")[0]
        : req.socket.remoteAddress;

    const geoRes = await axios.get(`http://ip-api.com/json/${ip}`);
    const geoData = await geoRes.data;
    if (geoData?.status === "success" && geoData?.lat && geoData?.lon)
      ipLoc = [geoData.lat, geoData.lon];

    return ipLoc;
  } catch (err) {
    console.error("Não foi possível obter a localização do usuário pelo ip");
    console.error(err);
    return null;
  }
};
