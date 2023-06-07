import { Show, splitProps } from "solid-js";
import CurrentUserLogo from "../../views/layout/topMenu/logo/CurrentUserLogo";
import LoggedInUserLogo from "../../views/layout/topMenu/logo/LoggedInUserLogo";
import LoginModal from "./LoginMenu";
import "./LoginDropdown.css";

export interface LoginDropdownProps {
  // Props button parent
  getProfilePic: () => boolean | string | undefined;
  onClick: () => void;
  // Props modal
  authenticated: boolean;
  show: boolean;
  xOffset?: number;
  handleLogin: () => void;
}

export default function (props: LoginDropdownProps) {
  const [local] = splitProps(props, [
    "getProfilePic",
    "onClick",
    "authenticated",
    "show",
    "xOffset",
    "handleLogin",
  ]);
  const profile = () => local.getProfilePic();

  return (
    <button
      id="login-btn"
      type="button"
      aria-expanded="false"
      onClick={() => local.onClick()}
    >
      <Show
        when={!local.authenticated}
        fallback={<LoggedInUserLogo path={profile()} />}
      >
        <CurrentUserLogo />
      </Show>
      <Show when={local.show}>
        <LoginModal
          authenticated={local.authenticated}
          // show={local.show}
          xOffset={local.xOffset}
          onClick={local.handleLogin}
        />
      </Show>
    </button>
  );
}
