import { OrganisationSelector } from "../../../content/board/component/organism/OrganisationSelector";
import LoginDropdown from "./LoginDropdown";
import "./TopNav.css";

export default function () {
  return (
    <nav id="top-nav">
      <OrganisationSelector />
      <LoginDropdown xOffset={-7} />
    </nav>
  );
}
