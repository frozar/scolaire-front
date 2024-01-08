import {
  ParameterService,
  organisationMember,
} from "../../../../_services/parameter.service";
import TrashIcon from "../../../../icons/TrashIcon";
import UpdatePen from "../../../../icons/UpdatePen";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";

export function MemberElement(props: { member: organisationMember }) {
  function removeMember() {
    const xanoRes = ParameterService.delete(props.member.user_id);
    console.log("xanores", xanoRes);
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
        <ButtonIcon icon={<UpdatePen />} onClick={() => removeMember()} />
      </td>
      <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
        <ButtonIcon
          icon={<TrashIcon />}
          onClick={() => console.log("Delete", props.member)}
        />
      </td>
    </tr>
  );
}
