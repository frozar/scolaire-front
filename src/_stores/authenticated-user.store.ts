import { createSignal } from "solid-js";
import { getSelectedOrganisation } from "../views/content/board/component/organism/OrganisationSelector";
import { setStoredData, xanoUser } from "../views/layout/authentication";
import { UserOrganizationStore } from "./user-organization.store";

export const [getUser, setUser] = createSignal<xanoUser | undefined>();

export const [authenticated, setAuthenticated] = createSignal(false);

export namespace AuthenticatedUserStore {
  export function get(): xanoUser | undefined {
    return getUser();
  }

  export function getToken() {
    return get()?.token;
  }

  export function isTheUser(email: string) {
    return getUser()?.email == email;
  }

  export function isAdmin() {
    return (
      authenticated() && getSelectedOrganisation().user_privilege === "admin"
    );
  }

  export function isFlaxib() {
    return authenticated() && getUser()?.role === "staff";
  }

  export function set(user: xanoUser) {
    setUser(user);
    setAuthenticated(true);
    UserOrganizationStore.set(user.organisation);
    setStoredData({ user });
  }

  export function unset() {
    setUser(undefined);
    setAuthenticated(false);
    UserOrganizationStore.unset();
    deleteStoredData();
  }
}

function deleteStoredData() {
  setStoredData({ user: undefined });
}
