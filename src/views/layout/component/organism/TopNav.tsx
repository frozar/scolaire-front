import { Show } from "solid-js";
import { OrganisationSelector } from "../../../content/board/component/organism/OrganisationSelector";
import LoginDropdown from "./LoginDropdown";
import { MapSelector } from "./MapSelector";
import "./TopNav.css";
import { authenticated } from "../../../../_stores/authenticated-user.store";

export default function () {
  return (
    <nav id="top-nav">
      <Show when={authenticated()}>
        <div class="top-nav-selectors">
          <OrganisationSelector />
          <MapSelector />
        </div>
      </Show>
      <LoginDropdown xOffset={-7} />
    </nav>
  );
}
