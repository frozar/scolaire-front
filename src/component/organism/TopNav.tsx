import { splitProps } from "solid-js";
import LoginDropdownComponent from "./LoginDropdown";
import { LoginDropdown } from "./LoginDropdown.stories";
import "./TopNav.css";

export interface NavTopProps {
  handleLogin?: () => Promise<void>;
  getProfilePicture?: () => string;
  authenticated?: () => boolean;
}

export default function (props: NavTopProps) {
  const [local] = splitProps(props, [
    "handleLogin",
    "getProfilePicture",
    "authenticated",
  ]);
  // Check props

  const handleLogin = () => {
    console.log(local.authenticated);

    if (local.handleLogin === undefined) {
      return LoginDropdown.args.handleLogin();
    } else return local.handleLogin();
  };

  const getProfilePicture = () => {
    if (local.getProfilePicture === undefined) {
      return LoginDropdown.args.getProfilePicture();
    } else return local.getProfilePicture();
  };

  const Authenticated = () => {
    if (local.authenticated === undefined) {
      return LoginDropdown.args.authenticated();
    } else return local.authenticated();
  };

  return (
    <nav id="nav-top">
      <LoginDropdownComponent
        handleLogin={handleLogin}
        getProfilePicture={getProfilePicture}
        authenticated={Authenticated}
        xOffset={-11}
      />
    </nav>
  );
}
