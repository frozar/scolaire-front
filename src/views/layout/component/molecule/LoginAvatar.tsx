import { Show } from "solid-js";

import LoggedInUserLogo from "../../../../icons/LoggedInUserLogo";
import UnloggedUserLogo from "../../../../icons/UnloggedUserLogo";

export interface LoginAvatarProps {
  profilePicture: string | undefined;
  drawAttention: boolean;
}

export default function (props: LoginAvatarProps) {
  // const mergedProps = mergeProps(
  //   {
  //     drawAttention: true,
  //     profilePicture: props.profilePicture ? props.profilePicture : "",
  //   },
  //   props
  // );
  const logoPath = () => (props.profilePicture ? props.profilePicture : "");

  return (
    // <Show when={props.profilePicture} fallback={<UnloggedUserLogo />}>
    <Show
      when={props.profilePicture}
      fallback={<UnloggedUserLogo drawAttention={props.drawAttention} />}
    >
      <LoggedInUserLogo path={logoPath()} />
      {/* <LoggedInUserLogo path={mergedProps.profilePicture} /> */}
    </Show>
  );
}
