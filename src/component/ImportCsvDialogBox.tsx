import { Show, createEffect, createSignal } from "solid-js";
import { Transition } from "solid-transition-group";
import {
  closeImportCsvBox,
  disableSpinningWheel,
  getImportCsvBox,
} from "../signaux";

import { useStateGui } from "../StateGui";
import ClickOutside from "../component/ClickOutside";
import { assertIsNode } from "../utils";
import { FileUtils } from "../utils/file.utils";

// HACK for the documentation to preserve the ClickOutside directive on save
// https://www.solidjs.com/guides/typescript#use___
false && ClickOutside;

const [, { getSelectedMenu }] = useStateGui();

export default function (props: {
  callbackSuccess?: () => void;
  callbackFail?: () => void;
}) {
  let refDialogueBox!: HTMLDivElement;

  const [refInputCsv, setRefInputCsv] = createSignal<
    HTMLInputElement | undefined
  >();

  const [refButton, setRefButton] = createSignal<
    HTMLButtonElement | undefined
  >();

  const [nbFileToImport, setNbFileToImport] = createSignal(0);

  createEffect(() => {
    refInputCsv()?.focus();
  });

  createEffect(() => {
    if (0 < nbFileToImport()) {
      refButton()?.focus();
    }
  });

  const displayed = () => getImportCsvBox()["displayed"];

  const strFileToImport = () => {
    let res = "etablissements";
    switch (getSelectedMenu()) {
      case "etablissements":
        res = "etablissements";
        break;
      case "ramassages":
        res = "points de ramassages";
        break;
    }
    return res;
  };

  // TODO Add import overview
  async function handlerOnClickValider() {
    const files = refInputCsv()?.files;

    if (await FileUtils.importFile(files)) {
      props.callbackSuccess ? props.callbackSuccess() : "";
    } else {
      props.callbackFail ? props.callbackFail() : "";
    }

    closeImportCsvBox();
    disableSpinningWheel();
  }

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
      <Show when={displayed()}>
        <div
          class="relative z-modal"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

          {/* Forum github pour les nested transitions
          https://github.com/reactjs/react-transition-group/issues/558 */}
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

                    // If the target element is an SVG element => exit
                    const targetType = e.target.constructor.name;
                    if (targetType.slice(0, 3) === "SVG") {
                      return;
                    }

                    assertIsNode(e.target);
                    if (!refDialogueBox.contains(e.target)) {
                      closeImportCsvBox();
                    }
                  }}
                >
                  <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={closeImportCsvBox}
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
                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3
                        class="text-base font-semibold leading-6 text-gray-900"
                        id="modal-title"
                      >
                        Importer des {strFileToImport()} (.csv)
                      </h3>
                      <form method="post" enctype="multipart/form-data">
                        <div class="mt-5">
                          <input
                            ref={setRefInputCsv}
                            type="file"
                            id="file"
                            name="file"
                            accept=".csv"
                            onChange={(e) => {
                              if (!e.target.files) {
                                return;
                              }

                              setNbFileToImport(e.target.files.length);
                            }}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                  <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      ref={setRefButton}
                      class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto disabled:bg-gray-300 disabled:opacity-75"
                      onClick={handlerOnClickValider}
                      disabled={nbFileToImport() == 0}
                    >
                      Importer
                    </button>
                    <button
                      type="button"
                      class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={closeImportCsvBox}
                    >
                      Annuler
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
