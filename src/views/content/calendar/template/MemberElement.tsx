import { organisationMember } from "../../../../_services/parameter.service";
import TrashIcon from "../../../../icons/TrashIcon";
import UpdatePen from "../../../../icons/UpdatePen";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";

export function MemberElement(props: { member: organisationMember }) {
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
          onClick={() => console.log("Update")}
        />
      </td>
      <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
        <ButtonIcon
          icon={<TrashIcon />}
          onClick={() => console.log("delete")}
        />
      </td>
    </tr>
  );
}
