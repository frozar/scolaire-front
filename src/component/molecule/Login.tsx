import LoginButton from "../atom/LoginButton";
import LoginModal from "../atom/LoginModal";
import { splitProps } from "solid-js";

export interface LoginProps {
  show: () => boolean;
  toggleShow: () => void;
  handleLogin: () => void;
  getProfilePic: () => boolean | string | undefined;
  authenticated: () => boolean;
}

export default function (props: LoginProps) {
  const [local] = splitProps(props, [
    "getProfilePic",
    "handleLogin",
    "toggleShow",
    "show",
    "authenticated",
  ]);

  return (
    <div>
      <LoginButton
        getProfilePic={local.getProfilePic}
        onClick={local.toggleShow}
      />
      <LoginModal
        show={local.show}
        authenticated={local.authenticated}
        onClick={local.handleLogin}
      />
    </div>
  );
}
