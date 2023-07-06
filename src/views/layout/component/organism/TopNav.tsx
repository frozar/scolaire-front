import LoginDropdown from "./LoginDropdown";
import "./TopNav.css";

export default function () {
  return (
    <nav id="top-nav">
      <LoginDropdown xOffset={-7} />
    </nav>
  );
}
