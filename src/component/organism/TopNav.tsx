import LoginDropdown from "./LoginDropdown";
import "./TopNav.css";

export default function () {
  return (
    <nav id="nav-top">
      <LoginDropdown xOffset={-7} />
    </nav>
  );
}
