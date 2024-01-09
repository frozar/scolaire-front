import { Accessor, Setter } from "solid-js";
import {
  OrganisationService,
  organisationMember,
} from "../../../../_services/organisation.service";
import CheckIcon from "../../../../icons/CheckIcon";
import UpdatePen from "../../../../icons/UpdatePen";
import {
  addNewGlobalSuccessInformation,
  addNewGlobalWarningInformation,
} from "../../../../signaux";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { setMember } from "../template/Organisation";

export function MemberUpdater(props: {
  member: organisationMember;
  isInUpdateMode: Accessor<boolean>;
  currentPrivilege: Accessor<string>;
  setCurrentPrivilege: Setter<string>;
  setIsInUpdateMode: Setter<boolean>;
}) {
  async function updateMember(updatedMember: organisationMember) {
    const xanoRes = await OrganisationService.updateMember(updatedMember);
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
    <ButtonIcon
      icon={props.isInUpdateMode() ? <UpdatePen /> : <CheckIcon />}
      /* eslint-disable-next-line solid/reactivity */
      onClick={async () => {
        if (!props.isInUpdateMode()) {
          try {
            await updateMember({
              ...props.member,
              user_privilege: props.currentPrivilege(),
            });
          } catch (e) {
            props.setCurrentPrivilege(props.member.user_privilege);
          }
        }
        props.setIsInUpdateMode((prev) => !prev);
      }}
    />
  );
}
