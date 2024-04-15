import "leaflet/dist/leaflet.css";
import { createSignal } from "solid-js";
import { OrganizationType } from "../../../../_entities/organization.entity";
import Button from "../../../../component/atom/Button";
import { OrganizationMapWrapper } from "../organism/OrganizationMapWrapper";
import "./OrganizationDetails.css";

export const [detailsOrganization, setDetailsOrganization] =
  createSignal<OrganizationType>();

export function OrganizationDetails() {
  return (
    <div class="organizations">
      <header>
        <h1>Details de l'organisation</h1>
        <Button onClick={() => console.log()} label="Editer l'organisation" />
      </header>
      <div>
        <p>Nom : {detailsOrganization()?.name} </p>
        <p>Status : {detailsOrganization()?.status} </p>
      </div>
      <div>
        <p class="organization-details-referent-title">Référent</p>
        <p class="organization-details-referent-info">
          Nom : {detailsOrganization()?.referent.name}
        </p>
        <p class="organization-details-referent-info">
          Mail : {detailsOrganization()?.referent.email}
        </p>
        <p class="organization-details-referent-info">
          Rôle : {detailsOrganization()?.referent.role}
        </p>
      </div>
      <div>
        <OrganizationMapWrapper
          org={detailsOrganization() as OrganizationType}
        />
      </div>
    </div>
  );
}
