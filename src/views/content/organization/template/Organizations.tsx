import { onMount } from "solid-js";
import { OrganisationService } from "../../../../_services/organisation.service";
import { OrganizationStore } from "../../../../_stores/organization.store";
import Button from "../../../../component/atom/Button";
import { ViewManager } from "../../ViewManager";
import { OrganizationsTable } from "../organism/OrganizationsTable";
import "./Organizations.css";

export function Organizations() {
  onMount(async () => {
    const organizations = await OrganisationService.getAll();
    OrganizationStore.set(organizations);
  });

  return (
    <div class="organizations">
      <header>
        <h1>Liste des organisations</h1>
        <Button
          onClick={() => ViewManager.organizationAdd()}
          label="Nouvelle organisation"
        />
      </header>
      <OrganizationsTable organizations={OrganizationStore.get()} />
    </div>
  );
}
