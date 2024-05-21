import { createSignal } from "solid-js";
import { useStateGui } from "../StateGui";
import { getSelectedOrganisation } from "../views/content/board/component/organism/OrganisationSelector";
import { xanoUser } from "../views/layout/authentication";
import { UserOrganizationStore } from "./user-organization.store";

const [, { setActiveMapId, setLoggedUser }] = useStateGui();

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
    setLoggedUser(user);
  }

  export function unset() {
    setAuthenticated(false);
    setUser(undefined);
    UserOrganizationStore.unset();
    setLoggedUser(undefined);
    setActiveMapId(null);
  }
}
