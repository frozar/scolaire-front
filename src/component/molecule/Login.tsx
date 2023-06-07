import LoginButton from "../atom/LoginDropdown";
import { splitProps } from "solid-js";

export interface LoginProps {
  show: boolean;
  toggleShow: () => void;
  handleLogin: () => void;
  getProfilePic: () => boolean | string | undefined;
  authenticated: boolean;
  xOffset: number;
}

export default function (props: LoginProps) {
  const [local] = splitProps(props, [
    "getProfilePic",
    "handleLogin",
    "toggleShow",
    "show",
    "authenticated",
    "xOffset",
  ]);

  return (
    <div>
      <LoginButton
        getProfilePic={local.getProfilePic}
        onClick={local.toggleShow}
        show={local.show}
        authenticated={local.authenticated}
        handleLogin={local.handleLogin}
        xOffset={local.xOffset}
      />
    </div>
  );
}
