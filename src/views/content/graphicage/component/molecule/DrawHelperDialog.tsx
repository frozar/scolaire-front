import { Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Transition } from "solid-transition-group";

import ClickOutside from "../../../../../component/ClickOutside";

import Button from "../../../../../component/atom/Button";

import "./DrawHelperDialog.css";

import { assertIsNode } from "../../../../../utils";
import DrawHelperDialogItem from "../atom/DrawHelperDialogItem";
import {
  currentStep,
  drawModeStep,
  setCurrentStep,
} from "../organism/DrawModeBoardContent";
true && ClickOutside;

export const [getDisplayedDrawHelperDialog, setDisplayedDrawHelperDialog] =
  createSignal<boolean>(false);

export function openDrawHelperDialog() {
  setDisplayedDrawHelperDialog(true);
}

let refDialogueBox: HTMLDivElement;
//TODO need to be refactored
export default function (props: {
  requestCircuit: (
    capacity: number,
    timeLimitSeconds: number,
    nbLimitSolution: number
  ) => Promise<void>;
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
  const [timeLimitSeconds, setTimeLimitSeconds] = createSignal(10);
  const [nbLimitSolution, setNbLimitSolution] = createSignal(50000);

  async function handlerOnClickSoumettre() {
    closeDrawHelperDialog();

    await props.requestCircuit(
      vehiclesCapacity(),
      timeLimitSeconds(),
      nbLimitSolution()
    );
    // ! Temporaire !?
    // ! Doit systématiquement afficher la ligne d'orTools juste après
    if (currentStep() != drawModeStep.stopSelection) {
      setCurrentStep(drawModeStep.stopSelection);
    }
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

                  <h3 class="drawer-helper-dialog-title">
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
                  <h4 class="drawer-helper-dialog-title">
                    Paramètres avancés du solveur de circuit
                  </h4>
                  <DrawHelperDialogItem
                    value={timeLimitSeconds}
                    setValue={setTimeLimitSeconds}
                    text={"Temps maximum de génération (s)"}
                    disabled={false}
                  />
                  <DrawHelperDialogItem
                    value={nbLimitSolution}
                    setValue={setNbLimitSolution}
                    text={"Nombre maximum de génération (s)"}
                    disabled={false}
                  />

                  <div class="draw-helper-dialog-buttons">
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
