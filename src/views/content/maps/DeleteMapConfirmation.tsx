import { createEffect, createSignal } from "solid-js";
import { Transition } from "solid-transition-group";
import { MapStore } from "../../../_stores/map.store";
import ClickOutside from "../../../component/ClickOutside";
import { assertIsNode } from "../../../utils";
import { CarteToDeleteType, closeDeleteMapModal } from "./Maps";

ClickOutside;

interface DeleteMapConfirmationProps {
  carteToDelete: CarteToDeleteType;
}

export default function (props: DeleteMapConfirmationProps) {
  let refDialogueBox: HTMLDivElement | undefined;

  const [buttonRef, setButtonRef] = createSignal<
    HTMLButtonElement | undefined
  >();

  createEffect(() => {
    buttonRef()?.focus();
  });

  return (
    <div
      class="relative z-[1400]"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

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
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
              ref={refDialogueBox}
              use:ClickOutside={(e: MouseEvent) => {
                if (!refDialogueBox || !e.target) {
                  return;
                }

                const targetType = e.target.constructor.name;
                if (targetType.slice(0, 3) === "SVG") {
                  return;
                }

                assertIsNode(e.target);
                if (!refDialogueBox.contains(e.target)) {
                  closeDeleteMapModal();
                }
              }}
            >
              <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={closeDeleteMapModal}
                >
                  <span class="sr-only">Close</span>
                  <svg
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    class="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3
                    class="text-base font-semibold leading-6 text-gray-900"
                    id="modal-title"
                  >
                    Supprimer une carte
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Etes-vous sûr de vouloir supprimer la carte "
                      {props.carteToDelete?.title}" ?
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  ref={setButtonRef}
                  class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  onClick={() => {
                    if (!props.carteToDelete) {
                      return;
                    }
                    MapStore.deleteMap(props.carteToDelete.id);
                  }}
                >
                  Valider
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={closeDeleteMapModal}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
}
