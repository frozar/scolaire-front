import { useStateGui } from "../../StateGui";
import { getAuthenticatedUser } from "../../signaux";
import UserInstructionContainer from "./UserInstructionContainer";
import "./UserInstructionContainer.css";
import UserInstructionContent, {
  InstructionEnum,
} from "./UserInstructionContent";

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
      {messageToDisplay()}
    </UserInstructionContainer>
  );
}
function messageToDisplay() {
  if (getAuthenticatedUser()?.organisation.length === 0) {
    return (
      <UserInstructionContent
        message="Aucune organisation associée à ce compte. "
        type={InstructionEnum.alert}
      />
    );
  }
  return (
    <UserInstructionContent
      message="Veuillez sélectionner une carte par double clique svp"
      type={InstructionEnum.information}
    />
  );
}
