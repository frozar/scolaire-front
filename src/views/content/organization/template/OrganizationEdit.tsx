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
import { OrganizationMapWrapper } from "../organism/OrganizationMapWrapper";
import "./OrganizationEdit.css";

export const [editOrganization, setEditOrganization] =
  createSignal<OrganizationType>({} as OrganizationType);

export function OrganizationEdit() {
  const [canSubmit, setCanSubmit] = createSignal(false);
  const [editMapBounds, setEditMapBounds] =
    createSignal<OrganizationMapBoundType>(
      editOrganization()?.mapBounds as OrganizationMapBoundType
    );
  const [foundUser, setFoundUser] = createSignal<OrganizationMemberType>();
  const [userSearch, setUserSearch] = createSignal("");

  const [localUsers, setLocalUsers] = createSignal<OrganizationMemberType[]>(
    []
  );

  createEffect(() => {
    if (!editOrganization().name || !foundUser()) return setCanSubmit(false);
    setCanSubmit(true);
  });

  onMount(async () => {
    if (OrganizationStore.getMembers().length <= 0) {
      enableSpinningWheel();
      const allUsers = await OrganisationService.getMembers();
      setLocalUsers(allUsers);
      disableSpinningWheel();
    } else setLocalUsers(OrganizationStore.getMembers());
    setFoundUser(editOrganization()?.referent);
  });

  async function submit() {
    setEditOrganization((prev) => {
      return {
        ...prev,
        mapBounds: editMapBounds(),
        referent: foundUser() as OrganizationMemberType,
      } as OrganizationType;
    });
    enableSpinningWheel();
    const edited = await OrganisationService.edit(editOrganization());

    const newList = OrganizationStore.get().map((item) => {
      if (item.id == edited.id) return edited;
      return item;
    });
    OrganizationStore.set(newList);
    disableSpinningWheel();
    addNewGlobalSuccessInformation(edited.name + " a bien été édité");
    ViewManager.organizationDetails(edited);
  }

  function onNameInput(value: string) {
    setEditOrganization((prev) => {
      return { ...prev, name: value } as OrganizationType;
    });
  }

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

  return (
    <div class="organizations">
      <header>
        <h1>Edition d'organisation</h1>
      </header>
      <div class="organization-edit-buttons">
        <Button
          label="Annuler"
          variant="danger"
          onClick={() => ViewManager.organizations()}
        />
        <Button label="Valider" isDisabled={!canSubmit()} onClick={submit} />
      </div>
      <div class="organization-edit-input-container">
        <LabeledInputField
          label="Nom de l'organisation"
          name="name"
          placeholder="Entrer un nom"
          onInput={(e) => onNameInput(e.target.value)}
          value={editOrganization()?.name as string}
        />
        <div>
          <LabeledInputField
            label="Référent"
            name="ref"
            onInput={(e) => searchForUser(e.target.value)}
            placeholder="Recherche par mail"
            value={editOrganization()?.referent.email as string}
          />
          <Show fallback={<div>Aucun référent trouvé</div>} when={foundUser()}>
            <div>
              <p>Nom : {foundUser()?.name}</p>
              <p>Email : {foundUser()?.email}</p>
            </div>
          </Show>
          <OrganizationMapWrapper
            mapBounds={editMapBounds()}
            mapBoundssetter={setEditMapBounds}
            editing
          />
        </div>
      </div>
    </div>
  );
}
