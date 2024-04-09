import { useStateGui } from "../../StateGui";
import { authenticated } from "../../_stores/authenticated-user.store";
import { UserOrganizationStore } from "../../_stores/user-organization.store";
import UserInstructionContainer from "./UserInstructionContainer";
import "./UserInstructionContainer.css";
import UserInstructionContent, {
  InstructionEnum,
} from "./UserInstructionContent";

const [, { getActiveMapId }] = useStateGui();

export default function () {
  const toShow = () => {
    return authenticated() && getActiveMapId() == null;
  };

  return (
    <UserInstructionContainer show={toShow()}>
      {messageToDisplay()}
    </UserInstructionContainer>
  );
}
function messageToDisplay() {
  if (UserOrganizationStore.hasNoOrganization()) {
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
