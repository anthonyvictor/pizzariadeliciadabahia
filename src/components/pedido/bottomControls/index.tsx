import { Badge } from "@components/badge";
import { ButtonPrimary, ButtonSecondary } from "@styles/components/buttons";
import { useRouter } from "next/router";
import { useState, type FC } from "react";
import { BottomControlsStyle } from "./styles";
import { sleep } from "@util/misc";

interface BottomControlsProps {
  backButton?: boolean;
  notFixed?: boolean;
  secondaryButton?: {
    click: () => void;
    disabled?: boolean;
    text?: string;
    badge?: number;
  };
  primaryButton?: {
    click: () => void;
    disabled?: boolean;
    text?: string;
    badge?: number;
  };
}

const BottomControls: FC<BottomControlsProps> = ({
  primaryButton,
  secondaryButton,
  backButton,
  notFixed = false,
}) => {
  const router = useRouter();

  const [disabled, setDisabled] = useState({
    back: false,
    secondary: false,
    primary: false,
  });

  return (
    <BottomControlsStyle fixed={!notFixed}>
      {backButton && (
        <ButtonSecondary
          disabled={disabled.back}
          onClick={async () => {
            setDisabled((prev) => ({ ...prev, back: true }));
            router.back();
            await sleep(2000);
            setDisabled((prev) => ({ ...prev, back: false }));
          }}
        >
          VOLTAR
        </ButtonSecondary>
      )}
      {!backButton && secondaryButton && (
        <ButtonSecondary
          disabled={!!secondaryButton.disabled || disabled.secondary}
          onClick={async () => {
            setDisabled((prev) => ({ ...prev, secondary: true }));
            await secondaryButton.click();
            await sleep(3000);
            setDisabled((prev) => ({ ...prev, secondary: false }));
          }}
        >
          {secondaryButton.text || "VOLTAR"}
          {!!secondaryButton.badge && <Badge number={secondaryButton.badge} />}
        </ButtonSecondary>
      )}
      {primaryButton && (
        <ButtonPrimary
          disabled={!!primaryButton.disabled || disabled.primary}
          onClick={async () => {
            setDisabled((prev) => ({ ...prev, primary: true }));
            await primaryButton.click();
            await sleep(3000);
            setDisabled((prev) => ({ ...prev, primary: false }));
          }}
        >
          {primaryButton.text || "CONTINUAR"}
          {primaryButton.badge && <Badge number={primaryButton.badge} />}
        </ButtonPrimary>
      )}
    </BottomControlsStyle>
  );
};
export default BottomControls;
