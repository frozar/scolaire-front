import { Show, splitProps } from "solid-js";
import CurrentUserLogo from "../../../../../component/atom/NoUserLogo";
import LoggedInUserLogo from "../../../../../component/atom/LoggedInUserLogo";

export interface LoginAvatarProps {
  authenticated: boolean;
  profilePicture: string | undefined;
}

export default function (props: LoginAvatarProps) {
  const [local] = splitProps(props, ["authenticated", "profilePicture"]);

  const logoPath = () => (local.profilePicture ? local.profilePicture : "");

  return (
    <Show
      when={!local.authenticated}
      fallback={<LoggedInUserLogo path={logoPath()} />}
    >
      <CurrentUserLogo />
    </Show>
  );
}
