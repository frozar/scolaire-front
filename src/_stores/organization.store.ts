import { createSignal } from "solid-js";
import { OrganizationType } from "../_entities/organization.entity";

const [getOrganizations, setOrganizations] = createSignal<OrganizationType[]>(
  []
);

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
}
