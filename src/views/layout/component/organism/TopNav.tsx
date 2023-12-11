import { Show } from "solid-js";
import { getAuthenticatedUser } from "../../../../signaux";
import { OrganisationSelector } from "../../../content/board/component/organism/OrganisationSelector";
import LoginDropdown from "./LoginDropdown";
import "./TopNav.css";

export default function () {
  return (
    <nav id="top-nav">
      <Show when={getAuthenticatedUser()}>
        <OrganisationSelector />
      </Show>
      <LoginDropdown xOffset={-7} />
    </nav>
  );
}
