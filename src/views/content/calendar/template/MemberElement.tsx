import {
  ParameterService,
  organisationMember,
} from "../../../../_services/parameter.service";
import TrashIcon from "../../../../icons/TrashIcon";
import UpdatePen from "../../../../icons/UpdatePen";
import {
  addNewGlobalSuccessInformation,
  addNewGlobalWarningInformation,
} from "../../../../signaux";
import { setRemoveConfirmation } from "../../../../userInformation/RemoveConfirmation";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { setMember } from "./Parameters";

export function MemberElement(props: { member: organisationMember }) {
  async function removeMember() {
    const xanoRes = await ParameterService.delete(props.member.user_id);
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
    <tr>
      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        {props.member.name}
      </td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {props.member.email}
      </td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {props.member.user_privilege}
      </td>
      <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
        <ButtonIcon
          icon={<UpdatePen />}
          onClick={() => console.log("Update", props.member)}
        />
      </td>
      <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
        <ButtonIcon
          icon={<TrashIcon />}
          onClick={() =>
            setRemoveConfirmation({
              textToDisplay:
                "Êtes-vous sûr de vouloir supprimer l'utilisateur : ",
              itemName: props.member.name,
              validate: removeMember,
            })
          }
        />
      </td>
    </tr>
  );
}
