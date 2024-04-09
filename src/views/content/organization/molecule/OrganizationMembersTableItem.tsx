import { Show, createSignal } from "solid-js";
import { OrganizationMemberType } from "../../../../_services/organisation.service";
import { AuthenticatedUserStore } from "../../../../_stores/authenticated-user.store";
import { RulesSelectorWrapper } from "../../calendar/molecule/RulesSelectorWrapper";
import { ButtonDeleteMember } from "../atom/ButtonDeleteMember";
import { ButtonUpdateMember } from "../atom/ButtonUpdateMember";

export function OrganizationMembersTableItem(props: {
  member: OrganizationMemberType;
}) {
  const [isInUpdateMode, setIsInUpdateMode] = createSignal<boolean>(true);
  const [currentPrivilege, setCurrentPrivilege] = createSignal<string>(
    props.member.user_privilege // eslint-disable-line
  );
  //  TODO: Put CSS in a css file
  return (
    <tr>
      <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        {!AuthenticatedUserStore.isTheUser(props.member.email)
          ? props.member.name
          : props.member.name + " (moi)"}
      </td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {props.member.email}
      </td>
      <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <RulesSelectorWrapper
          disabled={isInUpdateMode()}
          // eslint-disable-next-line solid/reactivity
          onChange={async (e) => {
            setCurrentPrivilege(e);
          }}
          defaultValue={currentPrivilege()}
          list={["admin", "member"]}
        />
      </td>
      <Show when={!AuthenticatedUserStore.isTheUser(props.member.email)}>
        <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <ButtonUpdateMember
            member={props.member}
            isInUpdateMode={isInUpdateMode}
            currentPrivilege={currentPrivilege}
            setCurrentPrivilege={setCurrentPrivilege}
            setIsInUpdateMode={setIsInUpdateMode}
          />
        </td>

        <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
          <ButtonDeleteMember member={props.member} />
        </td>
      </Show>
    </tr>
  );
}
