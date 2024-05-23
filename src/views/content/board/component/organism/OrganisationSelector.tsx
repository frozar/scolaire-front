import { createSignal } from "solid-js";
import { useStateGui } from "../../../../../StateGui";
import {
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { OrganisationType } from "../../../../layout/authentication";
import { setSelectedMenu } from "../../../../layout/menuItemFields";
import { Selector } from "../molecule/Selector";
import { changeBoard } from "../template/ContextManager";
const [, { setActiveOrganizationId, resetState }] = useStateGui();

import { MapStore } from "../../../../../_stores/map.store";
import { UserOrganizationStore } from "../../../../../_stores/user-organization.store";
import "./OrganisationSelector.css";

export const DEFAULT_ORGANISATION = {
  organisation_id: -1,
  name: "Organisation not found",
  user_privilege: "none",
};

export const [getSelectedOrganisation, setSelectedOrganisation] =
  createSignal<OrganisationType>(DEFAULT_ORGANISATION);

export function OrganisationSelector() {
  return (
    <div id="organisation-selector">
      <label
        id="organisation-selector-label"
        for="organisation-selector-select"
      >
        Organisation
      </label>
      <Selector
        id="organisation-selector-select"
        content={UserOrganizationStore.get().map((orga) => {
          return { value: orga.organisation_id, name: orga.name };
        })}
        disabled={false}
        selectedValue={getSelectedOrganisation().organisation_id}
        onChange={onChange}
      />
    </div>
  );
}

const onChange = async (
  res: Event & {
    currentTarget: HTMLSelectElement;
    target: HTMLSelectElement;
  }
) => {
  const organisation = UserOrganizationStore.get().filter(
    (orga) => orga.organisation_id === Number(res.target.value)
  )[0];

  await setOrganisation(organisation);
};

// TODO revoir cette function
async function setOrganisation(organisation: OrganisationType) {
  enableSpinningWheel();
  setActiveOrganizationId(organisation.organisation_id);
  changeBoard(undefined);
  setSelectedOrganisation(organisation);
  await MapStore.fetchUserMaps();
  setSelectedMenu("maps");
  disableSpinningWheel();
  resetState();
}
