import { useStateGui } from "../../StateGui";
import UserInstructionContainer from "./UserInstructionContainer";
import "./UserInstructionContainer.css";
import UserInstructionContent from "./UserInstructionContent";

const [, { getActiveMapId, getSelectedMenu }] = useStateGui();

export default function () {
  const toShow = () => {
    return getSelectedMenu() == "dashboard" && getActiveMapId() == null;
  };

  return (
    <UserInstructionContainer show={toShow()}>
      <UserInstructionContent message="Veuillez sélectionner une carte par double clique svp" />
    </UserInstructionContainer>
  );
}
