import { Show } from "solid-js";
import { getAuthenticatedUser } from "../../../../signaux";
import { OrganisationSelector } from "../../../content/board/component/organism/OrganisationSelector";
import LoginDropdown from "./LoginDropdown";
import { MapSelector } from "./MapSelector";
import "./TopNav.css";

export default function () {
  return (
    <nav id="top-nav">
      <Show when={getAuthenticatedUser()}>
        <div class="top-nav-selectors">
          <OrganisationSelector />
          <MapSelector />
        </div>
      </Show>
      <LoginDropdown xOffset={-7} />
    </nav>
  );
}
