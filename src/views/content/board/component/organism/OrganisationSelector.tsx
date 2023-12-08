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
  const organisation = getAuthenticatedUser()!.organisation.filter(
    (orga) => orga.organisation_id === Number(res.target.value)
  )[0];
  setOrganisation(organisation);
};

export const [getSelectedOrganisation, setSelectedOrganisation] =
  createSignal<OrganisationType>({
    organisation_id: -1,
    name: "Organisation not found",
    user_privilege: "none",
  });

export function OrganisationSelector(props: any) {
  //   onMount(() => console.log(getAuthenticatedUser()!.organisation));
  console.log(getAuthenticatedUser());
  createEffect(() => {
    if (getSelectedOrganisation().organisation_id == -1) {
      let organisation = window.history.state?.organisation ?? undefined;
      if (!organisation) {
        organisation = getAuthenticatedUser()!.organisation[0];
      }
      setOrganisation(organisation);
    }
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
function setOrganisation(organisation: OrganisationType) {
  const user = window.history.state.user;
  window.history.replaceState({ user, organisation }, document.title, "/");
  setSelectedOrganisation(organisation);
}
