import { createEffect, createSignal } from "solid-js";
import { getAuthenticatedUser } from "../../../../../signaux";
import {
  OrganisationType,
  StoredDataTypeEnum,
  getStoredData,
  setStoredData,
} from "../../../../layout/authentication";
import { setSelectedMenu } from "../../../../layout/menuItemFields";
import { Selector } from "../molecule/Selector";
import { changeBoard } from "../template/ContextManager";

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
    if (
      getSelectedOrganisation().organisation_id ==
      DEFAULT_ORGANISATION.organisation_id
    ) {
      const organisation = getAuthenticatedUser()!.organisation[0];
      if (organisation) {
        setOrganisation(organisation);
      }
    }
  });
  return (
    <Selector
      content={getAuthenticatedUser()!.organisation.map((orga) => {
        return { value: orga.organisation_id, name: orga.name };
      })}
      disabled={false}
      selectedValue={getSelectedOrganisation().organisation_id}
      onChange={onChange}
    />
  );
}

const onChange = (
  res: Event & {
    currentTarget: HTMLSelectElement;
    target: HTMLSelectElement;
  }
) => {
  const organisation = getAuthenticatedUser()!.organisation.filter(
    (orga) => orga.organisation_id === Number(res.target.value)
  )[0];
  setOrganisation(organisation);
};

function setOrganisation(organisation: OrganisationType) {
  setStoredData({ organisation });
  changeBoard(undefined);
  setSelectedMenu("dashboard");
  setSelectedOrganisation(organisation);
}
