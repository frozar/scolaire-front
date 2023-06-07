import { Show, createSignal, splitProps } from "solid-js";
import { Transition } from "solid-transition-group";

import CurrentUserLogo from "../../views/layout/topMenu/logo/CurrentUserLogo";
import LoggedInUserLogo from "../../views/layout/topMenu/logo/LoggedInUserLogo";
import LoginMenu from "../atom/LoginMenu";

import "./LoginDropdown.css";

export interface LoginDropdownProps {
  // Props button parent
  getProfilePicture: () => boolean | string | undefined;
  // Shared props
  authenticated: boolean;
  // Props modal
  handleLogin: () => void;
  xOffset?: number;
}

export default function (props: LoginDropdownProps) {
  const [displayedSubComponent, setDisplayedSubComponent] = createSignal(false);

  function toggleSubComponentDisplayed() {
    setDisplayedSubComponent((bool) => !bool);
  }

  const [local] = splitProps(props, [
    "getProfilePicture",
    "authenticated",
    "xOffset",
    "handleLogin",
  ]);
  const profile = () => local.getProfilePicture();

  return (
    <button
      id="login-btn"
      type="button"
      aria-expanded="false"
      onClick={toggleSubComponentDisplayed}
    >
      <Show
        when={!local.authenticated}
        fallback={<LoggedInUserLogo path={profile()} />}
      >
        <CurrentUserLogo />
      </Show>
      <Transition
        enterActiveClass="transition ease-out duration-200"
        enterClass="opacity-0 translate-y-1"
        enterToClass="opacity-100 translate-y-0"
        exitActiveClass="transition ease-in duration-150"
        exitClass="opacity-100 translate-y-0"
        exitToClass="opacity-0 translate-y-1"
      >
        <Show when={displayedSubComponent()}>
          <LoginMenu
            authenticated={local.authenticated}
            xOffset={local.xOffset}
            onClick={local.handleLogin}
          />
        </Show>
      </Transition>
    </button>
  );
}
