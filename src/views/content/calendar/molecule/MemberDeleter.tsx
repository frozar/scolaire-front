import {
  organisationMember,
  OrganisationService,
} from "../../../../_services/organisation.service";
import TrashIcon from "../../../../icons/TrashIcon";
import {
  addNewGlobalSuccessInformation,
  addNewGlobalWarningInformation,
} from "../../../../signaux";
import { setRemoveConfirmation } from "../../../../userInformation/RemoveConfirmation";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { setMember } from "../template/Organisation";
import "./MonthItem.css";

export function MemberDeleter(props: { member: organisationMember }) {
  async function removeMember() {
    const xanoRes = await OrganisationService.deleteMember(
      props.member.user_id
    );

    if ("user_id" in xanoRes) {
      setMember((oldMember) =>
        oldMember.filter((member) => member.user_id != xanoRes.user_id)
      );
      addNewGlobalSuccessInformation("Utilisateur supprimé de l'organisation");
      return true;
    } else {
      addNewGlobalWarningInformation(
        "Utilisateur inexistant ou déjà supprimé de l'organisation"
      );
      return false;
    }
  }

  return (
    <ButtonIcon
      icon={<TrashIcon />}
      onClick={() =>
        setRemoveConfirmation({
          textToDisplay: "Êtes-vous sûr de vouloir supprimer l'utilisateur : ",
          itemName: props.member.name,
          validate: removeMember,
        })
      }
    />
  );
}
