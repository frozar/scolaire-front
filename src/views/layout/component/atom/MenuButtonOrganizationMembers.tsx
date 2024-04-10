import { ViewManager } from "../../../content/ViewManager";

export function MenuButtonOrganizationMembers() {
  return (
    <button class="login-menu" onClick={() => ViewManager.organizationUsers()}>
      Utilisateurs
    </button>
  );
}
