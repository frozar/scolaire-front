import { Show } from "solid-js";
import ClickOutside from "../ClickOutside";
import {
  closeExportConfirmationBox,
  getExportConfirmation,
  setExportConfirmation,
} from "../signaux";
import { Transition } from "solid-transition-group";
import { assertIsNode } from "../utils";
import { ExportTypeEnum } from "../type";
import { exportData } from "./export";

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      ClickOutside: (e: MouseEvent) => void;
    }
  }
}

let refDialogueBox: HTMLDivElement | undefined;

function ExportTypeSelect() {
  return (
    <select
      class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 rounded shadow leading-tight focus:outline-none focus:border-blue-500"
      onChange={(e) => {
        console.log("e.target.value", e.target.value);

        const exportType = e.target.value;
        setExportConfirmation((prev) => ({
          ...prev,
          exportType: ExportTypeEnum[exportType as keyof typeof ExportTypeEnum],
        }));
      }}
    >
      <option value="">Sélectionnez un type d'export</option>
      {Object.values(ExportTypeEnum)
        .filter((exportType) => typeof exportType === "string")
        .map((exportType) => {
          return <option value={exportType}>{exportType}</option>;
        })}
    </select>
  );
}

export default function () {
  const displayed = () => getExportConfirmation()["displayed"];
  const exportType = () => getExportConfirmation()["exportType"];
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
          class="relative z-[1400]"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
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
                  class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
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
                      closeExportConfirmationBox();
                    }
                  }}
                >
                  <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 w-full">
                    <div class="sm:flex sm:items-start w-full">
                      <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                        <h3
                          class="text-base font-semibold leading-6 text-gray-900"
                          id="modal-title"
                        >
                          Exporter les données
                        </h3>
                        <div class="mt-2 w-full flex">
                          <div class="w-2/5">
                            Sélectionnez le type d'export:
                          </div>
                          <div class="w-3/5 flex">
                            <ExportTypeSelect />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={() => {
                        if (exportType() !== null && exportType() !== undefined) {
                          exportData();
                          closeExportConfirmationBox();
                        }
                      }}
                    >
                      Exporter
                    </button>
                    <button
                      type="button"
                      class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => closeExportConfirmationBox()}
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
