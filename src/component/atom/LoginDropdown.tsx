import { Show, createSignal, splitProps } from "solid-js";
import CurrentUserLogo from "../../views/layout/topMenu/logo/CurrentUserLogo";
import LoggedInUserLogo from "../../views/layout/topMenu/logo/LoggedInUserLogo";
import LoginMenu from "./LoginMenu";
import "./LoginDropdown.css";
import { Transition } from "solid-transition-group";

export interface LoginDropdownProps {
  // Props button parent
  getProfilePic: () => boolean | string | undefined;
  onClick: (arg: MouseEvent | undefined) => void;
  // Props modal
  authenticated: boolean;
  show: boolean;
  xOffset?: number;
  handleLogin: () => void;
}

export default function (props: LoginDropdownProps) {
  const [displayedSubComponent, setDisplayedSubComponent] = createSignal(false);

  function toggleSubComponentDisplayed() {
    setDisplayedSubComponent((bool) => !bool);
  }

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
      onClick={(e: MouseEvent) => {
        toggleSubComponentDisplayed();
        local.onClick(e);
      }}
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
            // show={displayedSubComponent()}
          />
        </Show>
      </Transition>
    </button>
  );
}
