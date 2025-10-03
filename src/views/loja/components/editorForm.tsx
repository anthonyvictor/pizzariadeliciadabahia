import { ReactNode } from "react";
import styled from "styled-components";
import { EditorBottom } from "./editorBottom";

export const EditorForm = ({
  children,
  handleSubmit,
  handleClose,
}: {
  children: ReactNode[];
  handleSubmit: () => void;
  handleClose: () => void;
}) => {
  return (
    <Style
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <main className="frm no-scroll">{children}</main>
      <EditorBottom fechar={handleClose} />
    </Style>
  );
};

const Style = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  .frm {
    padding: 10px 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
`;
