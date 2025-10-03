export type IDeveEstar = {
  visivel: boolean;
  disponivel: boolean;
  emCondicoes: boolean;
  comEstoque: boolean;
};

export const dvEst: {
  tudo: IDeveEstar;
  visivel: IDeveEstar;
  nada: IDeveEstar;
} = {
  tudo: {
    visivel: true,
    disponivel: true,
    emCondicoes: true,
    comEstoque: true,
  },
  nada: {
    visivel: false,
    disponivel: false,
    emCondicoes: false,
    comEstoque: false,
  },
  visivel: {
    visivel: true,
    disponivel: false,
    emCondicoes: false,
    comEstoque: false,
  },
};

export const deve_estar = (arr: any[], deveEstar: IDeveEstar) => {
  return arr.filter((x) =>
    deveEstar
      ? (deveEstar.visivel ? x.visivel : true) &&
        (deveEstar.disponivel ? x.disponivel : true) &&
        (deveEstar.comEstoque ? x.estoque !== 0 : true) &&
        (deveEstar.emCondicoes ? x.emCondicoes : true)
      : true
  );
};
