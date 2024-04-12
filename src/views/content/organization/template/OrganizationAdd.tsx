import { Show, createEffect, createSignal, onMount } from "solid-js";
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
import {
  addNewGlobalSuccessInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { ViewManager } from "../../ViewManager";
import LabeledInputField from "../../board/component/molecule/LabeledInputField";
import { OrganizationAddMapBound } from "../organism/OrganizationAddMapBound";
import "./OrganizationAdd.css";

export function OrganizationAdd() {
  const [canSubmit, setCanSubmit] = createSignal(false);
  const [foundUser, setFoundUser] = createSignal<OrganizationMemberType>();
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

  function searchForUser(value: string) {
    setUserSearch(value);
    localUsers().every((user) => {
      if (userSearch() == user.email) {
        setFoundUser(user);
        return false;
      }
      setFoundUser(undefined);
      return true;
    });
  }

  createEffect(() => {
    if (
      !newOrg().name ||
      !newMapBound().corner1.lat ||
      !newMapBound().corner1.lng ||
      !newMapBound().corner2.lat ||
      !newMapBound().corner2.lng ||
      !foundUser()
    )
      return setCanSubmit(false);
    setCanSubmit(true);
  });

  function onNameInput(value: string) {
    setNewOrg((prev) => {
      return { ...prev, name: value };
    });
  }

  async function submit() {
    setNewOrg((prev) => {
      return {
        ...prev,
        mapBounds: newMapBound(),
        status: "active",
        referent: foundUser() as OrganizationMemberType,
      };
    });
    enableSpinningWheel();
    const created = await OrganisationService.create(newOrg());
    disableSpinningWheel();
    OrganizationStore.set((prev) => {
      return [...prev, created];
    });
    addNewGlobalSuccessInformation("Organisation créée");
    ViewManager.organizations();
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
      <div class="organization-add-buttons">
        <Button
          label="Annuler"
          variant="danger"
          onClick={() => ViewManager.organizations()}
        />
        <Button label="Valider" isDisabled={!canSubmit()} onClick={submit} />
      </div>
      <div class="organization-add-input-container">
        <LabeledInputField
          label="Nom de l'organisation"
          name="name"
          placeholder="Entrer un nom"
          onInput={(e) => onNameInput(e.target.value)}
          value={""}
        />
        <div>
          <LabeledInputField
            label="Référent"
            name="ref"
            onInput={(e) => searchForUser(e.target.value)}
            placeholder="Recherche par mail"
            value={""}
          />
          <Show fallback={<div>Aucun référent trouvé</div>} when={foundUser()}>
            <div>
              <p>Nom : {foundUser()?.name}</p>
              <p>Email : {foundUser()?.email}</p>
              <p>Rôle : {foundUser()?.role}</p>
            </div>
          </Show>
        </div>
        <OrganizationAddMapBound setter={setNewMapBounds} />
      </div>
    </div>
  );
}
