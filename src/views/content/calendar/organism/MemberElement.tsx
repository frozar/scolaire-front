import { Show, createSignal } from "solid-js";
import {
  ParameterService,
  organisationMember,
} from "../../../../_services/parameter.service";
import CheckIcon from "../../../../icons/CheckIcon";
import TrashIcon from "../../../../icons/TrashIcon";
import UpdatePen from "../../../../icons/UpdatePen";
import {
  addNewGlobalSuccessInformation,
  addNewGlobalWarningInformation,
  getAuthenticatedUser,
} from "../../../../signaux";
import { setRemoveConfirmation } from "../../../../userInformation/RemoveConfirmation";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { RulesSelectorWrapper } from "../molecule/RulesSelectorWrapper";
import { setMember } from "../template/Parameters";

export function MemberElement(props: { member: organisationMember }) {
  const [isInUpdateMode, setIsInUpdateMode] = createSignal<boolean>(true);

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

  async function updateMember(updatedMember: organisationMember) {
    const xanoRes = await ParameterService.update(updatedMember);
    if ("user_id" in xanoRes) {
      setMember((oldMember) =>
        oldMember.map((member) => {
          if (member.user_id === xanoRes.user_id) {
            member.user_privilege = xanoRes.user_privilege;
          }
          return member;
        })
      );
      addNewGlobalSuccessInformation("Utilisateur modifié");
      return true;
    } else {
      addNewGlobalWarningInformation(
        "Utilisateur inexistant ou supprimé de l'organisation"
      );
      return false;
    }
  }

  return (
    <tr>
      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        {getAuthenticatedUser()?.email != props.member.email
          ? props.member.name
          : props.member.name + " (moi)"}
      </td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {props.member.email}
      </td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <RulesSelectorWrapper
          disabled={isInUpdateMode()}
          onChange={(e) => {
            if (!isInUpdateMode()) {
              updateMember({ ...props.member, user_privilege: e });
            }
          }}
          defaultValue={props.member.user_privilege}
          list={["admin", "member"]}
        />
      </td>
      <Show when={getAuthenticatedUser()?.email != props.member.email}>
        <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <ButtonIcon
            icon={isInUpdateMode() ? <UpdatePen /> : <CheckIcon />}
            onClick={() => setIsInUpdateMode((prev) => !prev)}
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
      </Show>
    </tr>
  );
}
