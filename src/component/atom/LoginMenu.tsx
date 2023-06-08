import { splitProps } from "solid-js";
import "./LoginMenu.css";
import { authenticated } from "../../signaux";

export interface LoginMenuProps {
  onClick: () => void;
  authenticated: boolean;
  xOffset?: number;
}

export default function (props: LoginMenuProps) {
  const [local, rest] = splitProps(props, ["authenticated", "xOffset"]);

  const defaultXOffset = 0;
  const xOffsetClassName = () => {
    let res = defaultXOffset;
    if (local.xOffset) {
      res = local.xOffset;
    }
    return "translate-x-[" + String(res) + "rem]";
  };

  // Slow load of story when use authenticated signal, ~ 4 - 5 second
  // Noticed when use any signal stored in signaux.ts, load of storybook will decrease
  console.log(authenticated());
  // console.log(isRamassageReady());

  return (
    <button id="login-dialog" class={xOffsetClassName()} {...rest}>
      {local.authenticated ? "Se déconnecter" : "Se connecter"}
    </button>
  );
}
