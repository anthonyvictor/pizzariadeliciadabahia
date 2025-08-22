import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { useRouter } from "next/router";

const NavigationContext = createContext<{
  menuOpen: Boolean;
  setMenuOpen: Dispatch<SetStateAction<Boolean>>;
}>(null);

const NavigationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState<Boolean>(false);
  const router = useRouter();

  // useEffect(() => {
  //   if (!promosCarregadas) return;
  //   setModalPromo(
  //     getDuasRefri60() && !getKids() && router.pathname.startsWith("/home") ? (
  //       <ModalPromo2
  //         url={
  //           "/pedido" //grandeOuFamilia === "grande" ? "/pedido/promocao-duas" :
  //         }
  //         image={
  //           grandeOuFamilia === "grande"
  //             ? "/images/promo-duas-refri-60-modal.png"
  //             : "/images/promo familias.png"
  //         }
  //       />
  //     ) : getKids() && router.pathname.startsWith("/home") ? (
  //       <ModalPromo2
  //         url="/pedido/promocao-dia-das-criancas"
  //         image="/images/promo-dia-das-criancas-modal.png"
  //       />
  //     ) : duasPequenas() &&
  //       pequenaPromo() &&
  //       router.pathname.startsWith("/home") ? (
  //       <ModalPromo2 url="/pedido" image="/images/promo pequenas.png" />
  //     ) : (
  //       <></>
  //     )
  //   );
  // }, [promosCarregadas]);

  return (
    <NavigationContext.Provider
      value={{
        menuOpen,
        setMenuOpen,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
export default NavigationProvider;

export const useNavigation = () => {
  return useContext(NavigationContext);
};
