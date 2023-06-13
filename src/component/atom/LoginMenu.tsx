import { splitProps } from "solid-js";
import "./LoginMenu.css";

export interface LoginMenuProps {
  onClick: () => void;
  authenticated: boolean;
}

export default function (props: LoginMenuProps) {
  const [local, rest] = splitProps(props, ["authenticated"]);

  return (
    <button id="login-menu" {...rest}>
      {local.authenticated ? "Se déconnecter" : "Se connecter"}
    </button>
  );
}
