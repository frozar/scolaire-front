import { Show, splitProps } from "solid-js";
import CurrentUserLogo from "../../views/layout/topMenu/logo/CurrentUserLogo";
import LoggedInUserLogo from "../../views/layout/topMenu/logo/LoggedInUserLogo";
import "./Login.css";

export interface LoginProps {
  getProfilePic: () => boolean | string | undefined;
  onClick: () => void;
}

export default function (props: LoginProps) {
  const [local, rest] = splitProps(props, ["getProfilePic"]);

  return (
    <>
      <button id="login-btn" type="button" aria-expanded="false" {...rest}>
        <Show when={!local.getProfilePic()} fallback={<LoggedInUserLogo />}>
          <CurrentUserLogo />
        </Show>
      </button>
    </>
  );
}
