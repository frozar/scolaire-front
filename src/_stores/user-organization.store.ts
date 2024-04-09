import { createSignal } from "solid-js";
import { OrganisationType } from "../views/layout/authentication";

export const [getUserOrganizations, setUserOrganizations] = createSignal<
  OrganisationType[]
>([]);

export namespace UserOrganizationStore {
  export function set(organizations: OrganisationType[]) {
    setUserOrganizations(organizations);
  }

  export function get(): OrganisationType[] {
    return getUserOrganizations();
  }

  export function unset() {
    setUserOrganizations([]);
  }

  export function hasNoOrganization() {
    return getUserOrganizations()?.length === 0;
  }

  export function isOrganization(id: number) {
    return getUserOrganizations()
      .flatMap((orga) => orga.organisation_id)
      .includes(id);
  }
}
