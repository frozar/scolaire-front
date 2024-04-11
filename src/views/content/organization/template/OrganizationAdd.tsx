import { For, Show, createEffect, createSignal, onMount } from "solid-js";
import {
  OrganizationMapBoundType,
  OrganizationType,
} from "../../../../_entities/organization.entity";
import {
  OrganisationService,
  OrganizationMemberType,
} from "../../../../_services/organisation.service";
import { OrganizationStore } from "../../../../_stores/organization.store";
import Button from "../../../../component/atom/Button";
import { disableSpinningWheel, enableSpinningWheel } from "../../../../signaux";
import { ViewManager } from "../../ViewManager";
import LabeledInputField from "../../board/component/molecule/LabeledInputField";
import InputSearch from "../../schools/component/molecule/InputSearch";
import { OrganizationAddMapBound } from "../organism/OrganizationAddMapBound";

export function OrganizationAdd() {
  const [canSubmit, setCanSubmit] = createSignal(false);
  const [userSearch, setUserSearch] = createSignal("");
  const [localUsers, setLocalUsers] = createSignal<OrganizationMemberType[]>(
    []
  );
  const [newOrg, setNewOrg] = createSignal<OrganizationType>(
    {} as OrganizationType
  );
  const [newMapBound, setNewMapBounds] = createSignal<OrganizationMapBoundType>(
    {} as OrganizationMapBoundType
  );

  // createEffect(() => {
  //   if (userSearch() != "" && localUsers().length > 0) {
  //     console.log("in");
  //     setLocalUsers(filterUsers(userSearch()));
  //     return;
  //   }
  //   // if (OrganizationStore.getMembers().length <= 0) {
  //   //   setLocalUsers(OrganizationStore.getMembers());
  //   // }

  // });

  createEffect(() => {
    if (
      !newOrg().name ||
      !newOrg().referent ||
      !newMapBound().corner1.lat ||
      !newMapBound().corner1.lon ||
      !newMapBound().corner2.lat ||
      !newMapBound().corner2.lon
    )
      return setCanSubmit(false);
    setCanSubmit(true);
  });

  function onNameInput(value: string) {
    setNewOrg((prev) => {
      return { ...prev, name: value };
    });
  }

  function submit() {
    setNewOrg((prev) => {
      return { ...prev, mapBounds: newMapBound(), status: "active" };
    });
    console.log(newOrg());
    console.log(newMapBound());
  }

  onMount(async () => {
    if (OrganizationStore.getMembers().length <= 0) {
      enableSpinningWheel();
      const allUsers = await OrganisationService.getMembers();
      setLocalUsers(allUsers);
      disableSpinningWheel();
    } else setLocalUsers(OrganizationStore.getMembers());
  });

  return (
    <div class="organizations">
      <header>
        <h1>Ajout d'organisation</h1>
      </header>
      <div class="flex gap-3">
        <Button
          label="Annuler"
          variant="danger"
          onClick={() => ViewManager.organizations()}
        />
        <Button label="Valider" isDisabled={!canSubmit()} onClick={submit} />
      </div>
      <LabeledInputField
        label="Nom de l'organisation"
        name="name"
        onInput={(e) => onNameInput(e.target.value)}
        value={""}
      />
      <div>
        <InputSearch onInput={setUserSearch} />
        <Show when={userSearch() != ""}>
          <div>
            <For each={localUsers()}>
              {(user) => (
                <div>
                  <p>{user.email}</p>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
      <OrganizationAddMapBound setter={setNewMapBounds} />
    </div>
  );
}

// const filterUsers = (filter: string) =>
//   OrganizationStore.getMembers().filter((member) =>
//     member.email.toLowerCase().includes(filter.toLowerCase())
//   );
