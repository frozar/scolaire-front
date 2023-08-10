import { Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Transition } from "solid-transition-group";

import ClickOutside from "../../../../../component/ClickOutside";

import Button from "../../../../../component/atom/Button";

import { assertIsNode } from "../../../../../utils";
import DrawHelperDialogItem from "../atom/DrawHelperDialogItem";
true && ClickOutside;

export const [getDisplayedDrawHelperDialog, setDisplayedDrawHelperDialog] =
  createSignal<boolean>(false);

export function openDrawHelperDialog() {
  setDisplayedDrawHelperDialog(true);
}

let refDialogueBox: HTMLDivElement;
//TODO need to be refactored
export default function (props: {
  requestCircuit: (capacity?: number) => Promise<void>;
}) {
  function closeDrawHelperDialog() {
    setDisplayedDrawHelperDialog(false);
  }

  function exitModal({ code }: KeyboardEvent) {
    // @ts-expect-error: Currently the 'keyboard' field doesn't exist on 'navigator'
    const keyboard = navigator.keyboard;
    // eslint-disable-next-line solid/reactivity
    keyboard.getLayoutMap().then(() => {
      if (code === "Escape") {
        if (getDisplayedDrawHelperDialog()) {
          closeDrawHelperDialog();
        }
      }
    });
  }
  onMount(() => {
    document.addEventListener("keyup", exitModal);
  });

  onCleanup(() => {
    document.removeEventListener("keyup", exitModal);
  });

  const displayed = () => getDisplayedDrawHelperDialog();
  const [nbVehicles, setNbVehicles] = createSignal(1);
  const [vehiclesCapacity, setVehiclesCapacity] = createSignal(30);
  // TODO Uncoment to add time limit
  //const [timeLimitSeconds, setTimeLimitSeconds] = createSignal(10);

  function handlerOnClickSoumettre() {
    closeDrawHelperDialog();

    props.requestCircuit(vehiclesCapacity());
    // TODO Uncoment to add time limit
    //props.requestCircuit(vehiclesCapacity(),timeLimitSeconds());
  }

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
      <Show when={displayed()}>
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
                    if (!refDialogueBox.contains(e.target as Node)) {
                      closeDrawHelperDialog();
                    }
                  }}
                >
                  <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={closeDrawHelperDialog}
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

                  <h3 class="text-base text-center font-semibold leading-6 text-gray-900">
                    Paramètres de la génération de circuit
                  </h3>
                  <DrawHelperDialogItem
                    value={nbVehicles}
                    setValue={setNbVehicles}
                    text={"Nombre de véhicules"}
                    disabled={true}
                  />
                  <DrawHelperDialogItem
                    value={vehiclesCapacity}
                    setValue={setVehiclesCapacity}
                    text={"Capacité des véhicules"}
                    disabled={false}
                  />
                  {/* TODO  Uncoment to add time limit */}
                  {/* <h4 class="text-sm text-left font-semibold leading-6 text-gray-500 mt-7">
                    Paramètres avancés du solveur de circuit
                  </h4>
                  <DrawHelperDialogItem
                    value={timeLimitSeconds}
                    setValue={setTimeLimitSeconds}
                    text={"Temps maximum de génération (s)"}
                    disabled={false}
                  /> */}

                  <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse ">
                    <Button
                      onClick={closeDrawHelperDialog}
                      label={"Annuler"}
                      variant="primary"
                      isDisabled={false}
                    />
                    <Button
                      ref={setRefButton}
                      onClick={handlerOnClickSoumettre}
                      label={"Soumettre"}
                      variant="primary"
                      isDisabled={false}
                    />
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
