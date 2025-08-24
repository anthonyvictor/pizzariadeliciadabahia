import { TabStyle } from "./styles";

export const Tab = ({ id, label }: { id: string; label: string }) => {
  return (
    <TabStyle
      onClick={() => {
        const el = document.querySelector(`#${id}-ul`);
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {label}
    </TabStyle>
  );
};
