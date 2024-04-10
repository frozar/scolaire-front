import { createEffect, createSignal } from "solid-js";
import { useStateGui } from "../../../../../StateGui";
import {
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import {
  OrganisationType,
  StoredDataTypeEnum,
  getStoredData,
  setStoredData,
} from "../../../../layout/authentication";
import { setSelectedMenu } from "../../../../layout/menuItemFields";
import { Selector } from "../molecule/Selector";
import { changeBoard } from "../template/ContextManager";
const [, { resetState }] = useStateGui();

import { MapStore } from "../../../../../_stores/map.store";
import { UserOrganizationStore } from "../../../../../_stores/user-organization.store";
import "./OrganisationSelector.css";

export const DEFAULT_ORGANISATION = {
  organisation_id: -1,
  name: "Organisation not found",
  user_privilege: "none",
};

export const [getSelectedOrganisation, setSelectedOrganisation] =
  createSignal<OrganisationType>(
    getStoredData(StoredDataTypeEnum.organisation) ?? DEFAULT_ORGANISATION
  );

export function OrganisationSelector() {
  createEffect(() => {
    const currentId = getSelectedOrganisation().organisation_id;
    if (
      !UserOrganizationStore.isOrganization(currentId)
      // TODO utilité ?
      // ||
      // getSelectedOrganisation().organisation_id ==
      //   DEFAULT_ORGANISATION.organisation_id
    ) {
      const organisation = UserOrganizationStore.get()[0];
      if (organisation) {
        setOrganisation(organisation);
      } else {
        setOrganisation(DEFAULT_ORGANISATION);
      }
    }
  });
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
  setStoredData({ organisation });
  changeBoard(undefined);
  setSelectedOrganisation(organisation);
  await MapStore.fetchUserMaps();
  setSelectedMenu("maps");
  disableSpinningWheel();
  resetState();
}
