import { Show } from "solid-js";
import { getSelectedOrganisation } from "../../../content/board/component/organism/OrganisationSelector";

interface ManagementButtonProps {
  onClick: () => void;
  authenticated: boolean;
}

export function ManagementButton(props: ManagementButtonProps) {
  return (
    <Show
      when={
        props.authenticated &&
        getSelectedOrganisation().user_privilege === "admin"
      }
    >
      <button class="login-menu" onClick={() => props.onClick()}>
        Utilisateurs
      </button>
    </Show>
  );
}
