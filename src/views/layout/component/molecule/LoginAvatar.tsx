import { Show } from "solid-js";

import LoggedInUserLogo from "../atom/LoggedInUserLogo";
import CurrentUserLogo from "../atom/NoUserLogo";

export interface LoginAvatarProps {
  authenticated: boolean;
  profilePicture: string | undefined;
}

export default function (props: LoginAvatarProps) {
  const logoPath = () => (props.profilePicture ? props.profilePicture : "");

  return (
    <Show
      when={!props.authenticated}
      fallback={<LoggedInUserLogo path={logoPath()} />}
    >
      <CurrentUserLogo />
    </Show>
  );
}
