import { createSignal } from "solid-js";
import { useStateGui } from "../StateGui";
import { getSelectedOrganisation } from "../views/content/board/component/organism/OrganisationSelector";
import { xanoUser } from "../views/layout/authentication";
import { UserOrganizationStore } from "./user-organization.store";

const [, { setActiveMapId }] = useStateGui();

export const [getUser, setUser] = createSignal<xanoUser | undefined>();

export const [authenticated, setAuthenticated] = createSignal(false);

export namespace AuthenticatedUserStore {
  export function get(): xanoUser | undefined {
    const output = getUser();
    if (!output) {
      const authenticatedString = localStorage.getItem("authenticated");
      if (authenticatedString) {
        return JSON.parse(authenticatedString);
      }
    }
    return output;
  }

  export function getToken() {
    const user = getUser();
    if (!user) return undefined;

    return user.token;
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
    localStorage.setItem("authenticated", JSON.stringify(user));
    UserOrganizationStore.set(user.organisation);
  }

  export function unset() {
    setAuthenticated(false);
    UserOrganizationStore.unset();
    localStorage.removeItem("authenticated");
    setActiveMapId(null);
  }
}
