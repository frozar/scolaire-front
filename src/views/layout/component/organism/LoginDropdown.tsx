import { Show, createSignal, mergeProps, onMount } from "solid-js";
import { Transition } from "solid-transition-group";

import { authenticated, setAuthenticated } from "../../../../signaux";

import LoginMenu from "../atom/LoginMenu";
import LoginAvatar from "../molecule/LoginAvatar";

import {
  getProfilePicture,
  isAuthenticated,
  login,
  logout,
} from "../../authentication";
import "./LoginDropdown.css";

export interface LoginDropdownProps {
  // Shared props
  getProfilePicture?: () => string;
  authenticated?: () => boolean;
  // Props sub component
  handleLogin?: () => Promise<void>;
  xOffset?: number;
}

export default function (props: LoginDropdownProps) {
  const handleLogin = async () => {
    if (!authenticated()) {
      await login();
    } else {
      await logout();
    }
  };

  onMount(async () => {
    setAuthenticated(await isAuthenticated());
  });

  // Local signal
  const [displayedSubComponent, setDisplayedSubComponent] = createSignal(false);

  function toggleSubComponentDisplayed() {
    setDisplayedSubComponent((bool) => !bool);
  }

  // Merged props
  const defaultXOffset = 0;
  const mergedProps = mergeProps(
    { authenticated, handleLogin, getProfilePicture, xOffset: defaultXOffset },
    props
  );

  const xOffsetClassName = () =>
    "translate-x-[" + String(mergedProps.xOffset) + "rem]";

  return (
    <button
      id="login-btn"
      type="button"
      aria-expanded="false"
      onClick={toggleSubComponentDisplayed}
    >
      <LoginAvatar
        authenticated={mergedProps.authenticated()}
        profilePicture={mergedProps.getProfilePicture()}
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
          <div id="login-menu-container" class={xOffsetClassName()}>
            <LoginMenu
              authenticated={mergedProps.authenticated()}
              onClick={mergedProps.handleLogin}
            />
          </div>
        </Show>
      </Transition>
    </button>
  );
}
