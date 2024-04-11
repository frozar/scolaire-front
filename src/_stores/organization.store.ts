import { createSignal } from "solid-js";
import { OrganizationType } from "../_entities/organization.entity";
import { OrganizationMemberType } from "../_services/organisation.service";

const [getOrganizations, setOrganizations] = createSignal<OrganizationType[]>(
  []
);

const [getOrganizationMembers, setOrganizationsMembers] = createSignal<
  OrganizationMemberType[]
>([]);

export namespace OrganizationStore {
  export function set(
    organizations:
      | OrganizationType[]
      | ((prev: OrganizationType[]) => OrganizationType[])
  ) {
    setOrganizations(organizations);
  }

  export function get() {
    return getOrganizations();
  }

  export function getMembers() {
    return getOrganizationMembers();
  }

  export function setMembers(
    members:
      | OrganizationMemberType[]
      | ((prev: OrganizationMemberType[]) => OrganizationMemberType[])
  ) {
    setOrganizationsMembers(members);
  }
}
