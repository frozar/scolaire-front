import { onMount } from "solid-js";
import { OrganisationService } from "../../../../_services/organisation.service";

export function Organizations() {
  onMount(async () => {
    const organizations = await OrganisationService.getAll();
    console.log(organizations);
  });

  return <div class="organizations">TODO</div>;
}
