import { Show, splitProps } from "solid-js";
import { Transition } from "solid-transition-group";

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
        <div class="absolute flex w-screen max-w-min -translate-x-44 px-1 z-[1400]">
          <div class="w-56 shrink rounded-xl bg-white text-sm leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5">
            <button class="block p-2 hover:text-indigo-600" {...rest}>
              {local.authenticated() ? "Se déconnecter" : "Se connecter"}
            </button>
          </div>
        </div>
      </Show>
    </Transition>
  );
}
