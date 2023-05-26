import { Show, createEffect, createSignal } from "solid-js";
import { Transition } from "solid-transition-group";
import { assertIsNode } from "../../utils";
import { useStateAction } from "../../StateAction";
import ClickOutside from "../../ClickOutside";

const [, { isInAddLineMode, getLineUnderConstruction, setModeRead }] =
  useStateAction();

export const [dialogConfirmStopAddLine, setDialogConfirmStopAddLine] =
  createSignal<boolean>(false);

export const toggleConfirmStopAddLine = () =>
  setDialogConfirmStopAddLine(!dialogConfirmStopAddLine());

const [refDialog, setRefDialog] = createSignal<HTMLDivElement>(
  document.createElement("div")
);

let modalToOpen: () => void;
export const defineModalToOpen = (obj: () => void) => {
  modalToOpen = obj;
};

export const ConfirmAbortEditionNeedToBeCall = () => {
  const lineInBuild = getLineUnderConstruction().stops.length > 0;

  if (isInAddLineMode() && lineInBuild) {
    toggleConfirmStopAddLine();
  } else if (isInAddLineMode()) {
    setModeRead();
    modalToOpen();
  } else {
    modalToOpen();
  }
};

export default function () {
  const confirmStopingEdition = () => {
    setModeRead();
    toggleConfirmStopAddLine();
    modalToOpen();
  };

  document.addEventListener("click", () => {
    refDialog().focus();
    console.log("ok confirm");
  });

  createEffect(() => {
    refDialog().focus();
    refDialog().addEventListener("keyup", (e) => {
      if (e.key == "Escape") {
        toggleConfirmStopAddLine();
      }
    });
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
      <Show when={dialogConfirmStopAddLine()}>
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
                  ref={setRefDialog}
                  tabindex="-1"
                  use:ClickOutside={(e: MouseEvent) => {
                    if (!refDialog() || !e.target) {
                      return;
                    }

                    const targetType = e.target.constructor.name;
                    if (targetType.slice(0, 3) === "SVG") {
                      return;
                    }

                    assertIsNode(e.target);
                    if (!refDialog().contains(e.target)) {
                      setDialogConfirmStopAddLine(false);
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
