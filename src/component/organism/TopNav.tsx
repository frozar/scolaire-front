import LoginDropdownComponent from "./LoginDropdown";
import "./TopNav.css";

export default function () {
  return (
    <nav id="nav-top">
      <LoginDropdownComponent xOffset={-7} />
    </nav>
  );
}
