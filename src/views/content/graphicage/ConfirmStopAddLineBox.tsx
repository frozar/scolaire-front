import { Show, createSignal, onCleanup, onMount } from "solid-js";
import { Transition } from "solid-transition-group";
import { assertIsNode } from "../../../utils";
import { useStateAction } from "../../../StateAction";
import ClickOutside from "../../../ClickOutside";

const [, { isInAddLineMode, getLineUnderConstruction, setModeRead }] =
  useStateAction();

export const [displayedConfirmStopAddLine, setDisplayedConfirmStopAddLine] =
  createSignal(false);

const toggleConfirmStopAddLine = () =>
  setDisplayedConfirmStopAddLine(!displayedConfirmStopAddLine());

let refDialogue: HTMLDivElement;

let modalToOpen: () => void;
export function defineModalToOpen(obj: () => void) {
  modalToOpen = obj;
}

export const confirmAbortEditionNeedToBeCall = () => {
  const hasLineUnderConstruction = getLineUnderConstruction().stops.length > 0;

  if (isInAddLineMode() && hasLineUnderConstruction) {
    toggleConfirmStopAddLine();
  } else {
    modalToOpen();
  }
};

function exitModal({ code }: KeyboardEvent) {
  // @ts-expect-error: Currently the 'keyboard' field doesn't exist on 'navigator'
  const keyboard = navigator.keyboard;
  // eslint-disable-next-line solid/reactivity
  keyboard.getLayoutMap().then(() => {
    if (code === "Escape") {
      if (displayedConfirmStopAddLine()) {
        setDisplayedConfirmStopAddLine(false);
      }
    }
  });
}

export default function () {
  const confirmStopingEdition = () => {
    setModeRead();
    toggleConfirmStopAddLine();
    modalToOpen();
  };

  onMount(() => {
    document.addEventListener("keyup", exitModal);
  });

  onCleanup(() => {
    document.removeEventListener("keyup", exitModal);
  });

  return (
    <Transition
      name="slide-fade"
      enterActiveClass="ease-out duration-300"
      enterClass="opacity-0"
      enterToClass="opacity-100"
      exitActiveClass="ease-in duration-300"
      exitClass="opacity-100"
      exitToClass="opacity-0"
    >
      <Show when={displayedConfirmStopAddLine()}>
        <div
          class="relative z-[1400]"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div class="export-modal-background"></div>
          <Transition
            name="slide-fade"
            enterActiveClass="ease-out duration-300"
            enterClass="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterToClass="opacity-100 translate-y-0 sm:scale-100"
            exitActiveClass="ease-in duration-200"
            exitClass="opacity-100 translate-y-0 sm:scale-100"
            exitToClass="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            appear
          >
            <div class="fixed inset-0 z-10 overflow-y-auto">
              <div class="export-modal-box">
                <div
                  class="dialog-box"
                  ref={refDialogue}
                  tabindex="-1"
                  use:ClickOutside={(e: MouseEvent) => {
                    if (!refDialogue || !e.target) {
                      return;
                    }

                    const targetType = e.target.constructor.name;
                    if (targetType.slice(0, 3) === "SVG") {
                      return;
                    }

                    assertIsNode(e.target);
                    if (!refDialogue.contains(e.target)) {
                      setDisplayedConfirmStopAddLine(false);
                    }
                  }}
                >
                  <div class="card-container">
                    <div class="sm:flex sm:items-start w-full">
                      <div class="card-container-title">
                        <h3 id="modal-title">
                          Ête vous sure de vouloir quitter l'édition de ligne ?
                        </h3>
                        <div class="mt-2 w-full flex"></div>
                      </div>
                    </div>
                  </div>
                  <div class="button-wrapper flex gap-5">
                    <button
                      type="button"
                      class="export-modal-cancel"
                      onClick={toggleConfirmStopAddLine}
                    >
                      Non
                    </button>
                    <button
                      type="button"
                      class="export-modal-confirm"
                      onClick={confirmStopingEdition}
                    >
                      Oui
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Show>
    </Transition>
  );
}
