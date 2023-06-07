import { splitProps } from "solid-js";
import "./LoginMenu.css";

export interface LoginMenuProps {
  onClick: () => void;
  authenticated: boolean;
  // show: boolean;
  xOffset?: number;
}

export default function (props: LoginMenuProps) {
  // const [local, rest] = splitProps(props, ["authenticated", "xOffset", "show"]);
  const [local, rest] = splitProps(props, ["authenticated", "xOffset"]);

  const defaultXOffset = 0;
  const xOffsetClassName = () => {
    let res = defaultXOffset;
    if (local.xOffset) {
      res = local.xOffset;
    }
    return "translate-x-[" + String(res) + "rem]";
  };

  return (
    <div id="login-dialog" class={xOffsetClassName()}>
      <div>
        <button {...rest}>
          {local.authenticated ? "Se déconnecter" : "Se connecter"}
        </button>
      </div>
    </div>
  );
}
