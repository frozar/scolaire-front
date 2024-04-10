import { ViewManager } from "../../../content/ViewManager";

export function MenuButtonOrganizations() {
  return (
    <button class="login-menu" onClick={() => ViewManager.organizations()}>
      Organisations
    </button>
  );
}
