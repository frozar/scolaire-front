import { createSignal, Show } from "solid-js";

import { useStateAction } from "../../../StateAction";
import { assertIsNode } from "../../../utils";
import { Transition } from "solid-transition-group";
import ClickOutside from "../../../ClickOutside";
import { displayAddLineMessage } from "../../../userInformation/utils";
import { FaSolidPlus } from "solid-icons/fa";
import { LastSelectionEnum } from "../type";
import { setInfoToDisplay, setEditionStopNames } from "../signaux";
import { setLocalEditionStopNames } from "../signaux";

const [, { setModeAddLine, isInAddLineMode }] = useStateAction();

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      ClickOutside: (e: MouseEvent) => void;
    }
  }
}

export default function () {
  const [show, setShow] = createSignal(false);

  function toggleShow() {
    setShow((show) => !show);
  }

  let refDrawnMenu: HTMLUListElement | undefined;
  let refLabelMenu: HTMLLabelElement | undefined;

  return (
    <div class="menu-btn group">
      <span class="tooltip group-hover:scale-100">Ajouter une ligne</span>
      <label
        ref={refLabelMenu}
        tabIndex={0}
        class="custom-btn btn-circle hover:bg-[#062F3F] hover:text-[#0cc683]"
        classList={{
          "bg-[#062F3F] text-[#0cc683]": isInAddLineMode(),
        }}
        onClick={() => {
          toggleShow();
        }}
      >
        <FaSolidPlus class="w-full p-0 h-2/3" />
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
            id="draw-line-options"
            ref={refDrawnMenu}
            tabIndex={0}
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
                  setModeAddLine();
                  displayAddLineMessage();
                  setLocalEditionStopNames([]);
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
