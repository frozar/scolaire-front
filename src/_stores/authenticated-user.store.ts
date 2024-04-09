import { createSignal } from "solid-js";
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

  export function isUser(email: string) {
    return getUser()?.email == email;
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
  window.history.replaceState(
    { user: undefined, organisation: undefined },
    document.title,
    "/"
  );
}
