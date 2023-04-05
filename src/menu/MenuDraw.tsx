import { createSignal, Show } from "solid-js";

import { setLineUnderConstructionState } from "../signaux";
import ClickOutside from "./ClickOutside";
import { assertIsNode } from "../utils";
import { Transition } from "solid-transition-group";

export default function MenuDraw() {
  const [show, setShow] = createSignal(false);

  function toggleShow() {
    setShow((show) => !show);
  }

  let refDrawnMenu: HTMLUListElement | undefined;
  let refLabelMenu: HTMLLabelElement | undefined;

  return (
    <div class="absolute top-[20px] left-[80px] z-[999] outline-none cursor-pointer">
      <label
        ref={refLabelMenu}
        tabIndex={0}
        class="btn btn-circle"
        onClick={() => {
          toggleShow();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </label>
      <Transition
        name="slide-fade"
        enterActiveClass="transition ease-out duration-200"
        enterClass="opacity-0 translate-y-1"
        enterToClass="opacity-100 translate-y-0"
        exitActiveClass="transition ease-in duration-150"
        exitClass="opacity-100 translate-y-0"
        exitToClass="opacity-0 translate-y-1"
      >
        <Show when={show()}>
          <ul
            ref={refDrawnMenu}
            tabIndex={0}
            class="absolute menu p-2 shadow bg-base-100 rounded-box w-52"
            use:ClickOutside={(e: MouseEvent) => {
              if (!refLabelMenu || !refDrawnMenu || !e.target) {
                return;
              }
              assertIsNode(e.target);
              if (
                !refLabelMenu.contains(e.target) &&
                !refDrawnMenu.contains(e.target)
              ) {
                toggleShow();
              }
            }}
          >
            <li>
              <a
                class="menu-link-shortcut"
                onClick={() => {
                  toggleShow();
                  setLineUnderConstructionState((lineState) =>
                    !lineState.active
                      ? { ...lineState, active: true }
                      : lineState
                  );
                }}
              >
                Ligne
                <kbd class="kbd">L</kbd>
              </a>
            </li>
          </ul>
        </Show>
      </Transition>
    </div>
  );
}
