import { Signal, createEffect, createSignal } from "solid-js";
import {
  OrganisationService,
  organisationMember,
} from "../../../../_services/organisation.service";
import { getSelectedOrganisation } from "../../board/component/organism/OrganisationSelector";
import { OrganizationMembersTable } from "../organism/OrganizationMembersTable";

export const [organizationMembers, setOrganizationMembers] = createSignal(
  []
) as Signal<organisationMember[]>;
export function OrganizationMembers() {
  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    const members = await OrganisationService.getMembers();
    setOrganizationMembers(members);
  });
  return (
    <OrganizationMembersTable
      members={organizationMembers()}
      organization={getSelectedOrganisation()}
    />
  );
}
