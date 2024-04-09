import { onMount } from "solid-js";
import { OrganisationService } from "../../../../_services/organisation.service";
import { OrganizationStore } from "../../../../_stores/organization.store";
import { OrganizationsTable } from "../organism/OrganizationsTable";

export function Organizations() {
  onMount(async () => {
    const organizations = await OrganisationService.getAll();
    OrganizationStore.set(organizations);
  });

  return (
    <div class="organizations">
      <OrganizationsTable organizations={OrganizationStore.get()} />
    </div>
  );
}
