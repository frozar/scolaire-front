import { useStateGui } from "../../StateGui";
import { getAuthenticatedUser } from "../../signaux";
import UserInstructionContainer from "./UserInstructionContainer";
import "./UserInstructionContainer.css";
import UserInstructionContent from "./UserInstructionContent";

const [, { getActiveMapId, getSelectedMenu }] = useStateGui();

export default function () {
  const toShow = () => {
    return (
      getAuthenticatedUser() != undefined &&
      getSelectedMenu() == "dashboard" &&
      getActiveMapId() == null
    );
  };

  return (
    <UserInstructionContainer show={toShow()}>
      <UserInstructionContent message="Veuillez sélectionner une carte par double clique svp" />
    </UserInstructionContainer>
  );
}
