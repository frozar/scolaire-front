import { Show, createSignal } from "solid-js";
import { Transition } from "solid-transition-group";

import ClickOutside from "../../../../component/ClickOutside";
import { getAuthenticatedUser } from "../../../../signaux";

import LoginMenu from "../atom/LoginMenu";
import LoginAvatar from "../molecule/LoginAvatar";

import { login, logout } from "../../authentication";

import "./LoginDropdown.css";

// HACK for the documentation to preserve the ClickOutside directive on save
// https://www.solidjs.com/guides/typescript#use___
false && ClickOutside;

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
    if (!getAuthenticatedUser()) {
      await login();
    } else {
      await logout();
    }
  };

  let refLoginButton!: HTMLButtonElement;

  // Local signal
  const [displayedSubComponent, setDisplayedSubComponent] = createSignal(false);

  function toggleSubComponentDisplayed() {
    setDisplayedSubComponent((bool) => !bool);
  }

  const xOffsetClassName = () =>
    "translate-x-[" + String(props.xOffset ?? 0) + "rem]";

  return (
    <button
      id="login-btn"
      type="button"
      aria-expanded="false"
      ref={refLoginButton}
      onClick={toggleSubComponentDisplayed}
      use:ClickOutside={(e: MouseEvent) => {
        if (e.target && e.target != refLoginButton && displayedSubComponent()) {
          toggleSubComponentDisplayed();
        }
      }}
    >
      <LoginAvatar profilePicture={getAuthenticatedUser()?.picture} />

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
              authenticated={getAuthenticatedUser() ? true : false}
              onClick={handleLogin}
            />
          </div>
        </Show>
      </Transition>
    </button>
  );
}
