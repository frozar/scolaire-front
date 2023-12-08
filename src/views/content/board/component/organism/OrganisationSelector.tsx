import { createEffect, createSignal } from "solid-js";
import { getAuthenticatedUser } from "../../../../../signaux";
import { OrganisationType } from "../../../../layout/authentication";
import { Selector } from "../molecule/Selector";

const onChange = (
  res: Event & {
    currentTarget: HTMLSelectElement;
    target: HTMLSelectElement;
  }
) => {
  console.log(res);
  console.log("Value", res.target.value);
  const selectedOrganisation = getAuthenticatedUser()!.organisation.filter(
    (orga) => orga.organisation_id === Number(res.target.value)
  )[0];
  setSelectedOrganisation(selectedOrganisation);
};

export const [getSelectedOrganisation, setSelectedOrganisation] =
  createSignal<OrganisationType>(getAuthenticatedUser()!.organisation[0]);

export function OrganisationSelector(props: any) {
  //   onMount(() => console.log(getAuthenticatedUser()!.organisation));
  createEffect(() => {
    console.log(getAuthenticatedUser()!.organisation);
  });
  return (
    <Selector
      selectorTitle={"Titre"}
      content={getAuthenticatedUser()!.organisation.map((orga) => {
        return { value: orga.organisation_id, name: orga.name };
      })}
      disabled={false}
      selectedValue={getSelectedOrganisation().organisation_id}
      onChange={onChange}
    />
    // <select
    //   name="school-select"
    //   onChange={(e) => props.onChange(e.target)}
    //   disabled={props.selector.disabled}
    //   class="school-selection"
    // >
    //   <option value="default">Organisation</option>
    //   <For each={getAuthenticatedUser()!.organisation}>
    //     {(organisation) => (
    //       <option
    //         selected={
    //           organisation.organisation_id == Number(props.selector.value)
    //         }
    //         value={organisation.organisation_id}
    //       >
    //         {organisation.name}
    //       </option>
    //     )}
    //   </For>
    // </select>
  );
}
