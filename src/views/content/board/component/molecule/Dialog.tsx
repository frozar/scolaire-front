import {
  Accessor,
  JSXElement,
  Setter,
  Show,
  children,
  createEffect,
  createSignal,
} from "solid-js";
import { Transition } from "solid-transition-group";

import ClickOutside from "../../../../../component/ClickOutside";

import "./Dialog.css";

import { assertIsNode } from "../../../../../utils";
true && ClickOutside;

// enum CsvTypeEnum {
//   stop = "stops",
//   schools = "schools",
//   students = "students",
// }
// ! Externalise
// export const [getDisplayedImportDialog, setDisplayedImportDialog] =
//   createSignal<boolean>(false);
// ! Externalise
// export function openImportDialog() {
//   setDisplayedImportDialog(true);
// }

let refDialogBox: HTMLDivElement;
//TODO need to be refactored
export default function (props: {
  children: JSXElement;
  isDisplayed: Accessor<boolean>;
  setIsDisplayed: Setter<boolean>;
}) {
  const child = children(() => props.children);

  // const [importCsvType, setImportCsvType] = createSignal<CsvTypeEnum>();

  // function onChangeCsvType(event: Event & { target: HTMLInputElement }) {
  //   const csvType = event.target.value as CsvTypeEnum;
  //   setImportCsvType(csvType);
  //   console.log("csvType selected =>", importCsvType());
  // }

  // function closeDrawHelperDialog() {
  //   setDisplayedImportDialog(false);
  // }

  function closeDialog() {
    props.setIsDisplayed(false);
  }

  // const displayed = () => getDisplayedImportDialog();

  // async function handlerOnClickSoumettre() {
  //   console.log("TODO");

  //   closeDrawHelperDialog();
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [refButton, setRefButton] = createSignal<
    HTMLButtonElement | undefined
  >();

  createEffect(() => {
    refButton()?.focus();
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
      {/* <Show when={displayed()}> */}
      <Show when={props.isDisplayed()}>
        <div
          class="relative z-[1400]"
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
                  ref={refDialogBox}
                  use:ClickOutside={(e: MouseEvent) => {
                    if (!refDialogBox || !e.target) {
                      return;
                    }

                    // If the target element is an SVG element => exit
                    const targetType = e.target.constructor.name;
                    if (targetType.slice(0, 3) === "SVG") {
                      return;
                    }

                    assertIsNode(e.target);
                    if (!refDialogBox.contains(e.target as Node)) {
                      closeDialog();
                    }
                  }}
                >
                  <div class="absolute right-0 top-0 pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={closeDialog}
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
                  {child()}
                  {/* TODO: Refcator: put {childs()} here ! */}
                  {/* <h3 class="drawer-helper-dialog-title"> */}
                  {/* Paramètres de la génération de circuit */}
                  {/* Séléctionner un type de fichier: */}
                  {/* </h3> */}
                  {/* <div>
                    <input
                      type="radio"
                      id="schools"
                      name="import_csv"
                      value="schools"
                      onChange={onChangeCsvType}
                    />
                    <label for="schools">Établissements</label>
                  </div> */}

                  {/* <div>
                    <input
                      type="radio"
                      id="stops"
                      name="import_csv"
                      value="stops"
                      onChange={onChangeCsvType}
                    />
                    <label for="stops">Arrêts</label>
                  </div> */}

                  {/* <div>
                    <input
                      type="radio"
                      id="students"
                      name="import_csv"
                      value="students"
                      onChange={onChangeCsvType}
                    />
                    <label for="students">Élèves</label>
                  </div> */}
                  {/* <div class="draw-helper-dialog-buttons">
                    <Button
                      onClick={closeDrawHelperDialog}
                      label={"Annuler"}
                      variant="danger"
                      isDisabled={false}
                    />
                    <Button
                      ref={setRefButton}
                      onClick={handlerOnClickSoumettre}
                      label={"Soumettre"}
                      variant="primary"
                      isDisabled={false}
                    />
                  </div> */}
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Show>
    </Transition>
  );
}
