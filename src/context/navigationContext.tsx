import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePromo } from "./promoContext";
import ModalPromo2 from "@components/modalPromo2";
import { useRouter } from "next/router";

const NavigationContext = createContext<{
  menuOpen: Boolean;
  setMenuOpen: Dispatch<SetStateAction<Boolean>>;
  somenteOndina: Boolean;
  showModalSomenteOndina: Boolean;
  setShowModalSomenteOndina: Dispatch<SetStateAction<Boolean>>;
  modalPromo: ReactNode;
  setModalPromo: Dispatch<SetStateAction<ReactNode>>;
}>(null);

const NavigationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState<Boolean>(false);
  const { getKids, getDuasRefri60, promosCarregadas } = usePromo();
  const [modalPromo, setModalPromo] = useState(<></>);
  const router = useRouter();

  useEffect(() => {
    if (!promosCarregadas) return;
    setModalPromo(
      getDuasRefri60() && !getKids() && router.pathname.startsWith("/home") ? (
        <ModalPromo2
          url="/pedido/promocao-duas"
          image="/images/promo-duas-refri-60-modal.png"
        />
      ) : getKids() && router.pathname.startsWith("/home") ? (
        <ModalPromo2
          url="/pedido/promocao-dia-das-criancas"
          image="/images/promo-dia-das-criancas-modal.png"
        />
      ) : (
        <></>
      )
    );
  }, [promosCarregadas]);

  const somenteOndina = false;

  const [showModalSomenteOndina, setShowModalSomenteOndina] = useState(false);

  return (
    <NavigationContext.Provider
      value={{
        menuOpen,
        setMenuOpen,
        modalPromo,
        setModalPromo,
        somenteOndina,
        showModalSomenteOndina,
        setShowModalSomenteOndina,
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
