import { Show, createSignal, onMount } from "solid-js";
import CurrentUserLogo from "./logo/CurrentUserLogo";
import LoggedInUserLogo from "./logo/LoggedInUserLogo";
import { Transition } from "solid-transition-group";
import { getProfilePic, isAuthenticated, login, logout } from "../../auth/auth";
import { authenticated, setAuthenticated } from "../../signaux";

export default function () {
  const [show, setShow] = createSignal(false);

  function toggleShow() {
    setShow((show) => !show);
  }

  onMount(async () => {
    setAuthenticated(await isAuthenticated());
  });

  return (
    <div>
      <button
        type="button"
        class="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
        aria-expanded="false"
        onClick={async () => {
          toggleShow();
        }}
      >
        <Show when={!getProfilePic()} fallback={<LoggedInUserLogo />}>
          <CurrentUserLogo />
        </Show>
      </button>

      <Transition
        enterActiveClass="transition ease-out duration-200"
        enterClass="opacity-0 translate-y-1"
        enterToClass="opacity-100 translate-y-0"
        exitActiveClass="transition ease-in duration-150"
        exitClass="opacity-100 translate-y-0"
        exitToClass="opacity-0 translate-y-1"
      >
        <Show when={show()}>
          <div class="absolute flex w-screen max-w-min -translate-x-44 px-1 z-[1400]">
            <div class="w-56 shrink rounded-xl bg-white text-sm leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5">
              <a
                href="#"
                class="block p-2 hover:text-indigo-600"
                onClick={async () => {
                  if (!authenticated()) {
                    await login();
                  } else {
                    await logout();
                  }
                  toggleShow();
                }}
              >
                {authenticated() ? "Se déconnecter" : "Se connecter"}
              </a>
            </div>
          </div>
        </Show>
      </Transition>
    </div>
  );
}
