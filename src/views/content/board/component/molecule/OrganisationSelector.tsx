import { For, createSignal } from "solid-js";
import { getAuthenticatedUser } from "../../../../../signaux";
export const [currentOrganisation, setCurrentOrganisation] = createSignal<any>(
  []
);

export function OrganisationSelector(props: any) {
  return (
    <select
      name="school-select"
      onChange={(e) => props.onChange(e.target)}
      disabled={props.selector.disabled}
      class="school-selection"
    >
      <option value="default">Organisation</option>
      <For each={getAuthenticatedUser()!.organisation}>
        {(organisation) => (
          <option
            selected={
              organisation.organisation_id == Number(props.selector.value)
            }
            value={organisation.organisation_id}
          >
            {organisation.name}
          </option>
        )}
      </For>
    </select>
  );
}
