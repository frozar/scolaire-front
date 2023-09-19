import { Show } from "solid-js";

import CurrentUserLogo from "../../../../icons/CurrentUserLogo";
import LoggedInUserLogo from "../../../../icons/LoggedInUserLogo";

export interface LoginAvatarProps {
  profilePicture: string | undefined;
}

export default function (props: LoginAvatarProps) {
  const logoPath = () => (props.profilePicture ? props.profilePicture : "");

  return (
    <Show when={props.profilePicture} fallback={<CurrentUserLogo />}>
      <LoggedInUserLogo path={logoPath()} />
    </Show>
  );
}
