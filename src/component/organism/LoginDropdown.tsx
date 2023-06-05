import { Show, createSignal, splitProps } from "solid-js";
import { Transition } from "solid-transition-group";
import LoginMenu from "../atom/LoginMenu";

import "./LoginDropdown.css";
import { authenticated } from "../../signaux";
import LoginAvatar from "../atom/LoginAvatar";

export interface LoginDropdownProps {
  // Props button parent
  getProfilePicture: () => string;
  // Shared props
  authenticated?: () => boolean;
  // Props sub component
  handleLogin: () => Promise<void>;
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

  // Props check
  const Authenticated = () => {
    if (local.authenticated === undefined) {
      return authenticated();
    } else {
      return local.authenticated();
    }
  };

  return (
    <button
      id="login-btn"
      type="button"
      aria-expanded="false"
      onClick={toggleSubComponentDisplayed}
    >
      <LoginAvatar
        authenticated={Authenticated}
        profilePicture={local.getProfilePicture}
      />

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
            authenticated={Authenticated()}
            xOffset={local.xOffset}
            onClick={local.handleLogin}
          />
        </Show>
      </Transition>
    </button>
  );
}
