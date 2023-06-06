import { Show, splitProps } from "solid-js";
import { Transition } from "solid-transition-group";
import "./Login.css";

export interface LoginModalProps {
  onClick: () => void;
  authenticated: () => boolean;
  show: () => boolean;
}

export default function (props: LoginModalProps) {
  const [local, rest] = splitProps(props, ["authenticated", "show"]);

  return (
    <Transition
      enterActiveClass="transition ease-out duration-200"
      enterClass="opacity-0 translate-y-1"
      enterToClass="opacity-100 translate-y-0"
      exitActiveClass="transition ease-in duration-150"
      exitClass="opacity-100 translate-y-0"
      exitToClass="opacity-0 translate-y-1"
    >
      <Show when={local.show()}>
        <div id="login-dialog">
          <div>
            <button {...rest}>
              {local.authenticated() ? "Se déconnecter" : "Se connecter"}
            </button>
          </div>
        </div>
      </Show>
    </Transition>
  );
}
