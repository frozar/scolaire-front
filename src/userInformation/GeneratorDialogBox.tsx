import { Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Transition } from "solid-transition-group";

import ClickOutside from "../component/ClickOutside";
import {
  closeGeneratorDialogBox,
  getDisplayedGeneratorDialogBox,
} from "../signaux";

import { assertIsNode } from "../utils";
import { generateCircuit } from "../views/content/graphicage/generationCircuit";

let refDialogueBox: HTMLDivElement;

function exitModal({ code }: KeyboardEvent) {
  // @ts-expect-error: Currently the 'keyboard' field doesn't exist on 'navigator'
  const keyboard = navigator.keyboard;
  // eslint-disable-next-line solid/reactivity
  keyboard.getLayoutMap().then(() => {
    if (code === "Escape") {
      if (getDisplayedGeneratorDialogBox()) {
        closeGeneratorDialogBox();
      }
    }
  });
}

export default function () {
  onMount(() => {
    document.addEventListener("keyup", exitModal);
  });

  onCleanup(() => {
    document.removeEventListener("keyup", exitModal);
  });

  const displayed = () => getDisplayedGeneratorDialogBox();
  const [nbVehicles, setNbVehicles] = createSignal(1);
  const [vehiclesCapacity, setVehiclesCapacity] = createSignal(50);
  const [timeLimitSeconds, setTimeLimitSeconds] = createSignal(10);
  const [maximumTravelDistance, setMaximumTravelDistance] = createSignal(200);
  const [globalSpanCostCoefficient, setGlobalSpanCostCoefficient] =
    createSignal(10);

  function handlerOnClickSoumettre() {
    closeGeneratorDialogBox();
    generateCircuit(
      nbVehicles(),
      vehiclesCapacity(),
      maximumTravelDistance(),
      globalSpanCostCoefficient(),
      timeLimitSeconds()
    );
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
                    if (!refDialogueBox.contains(e.target)) {
                      closeGeneratorDialogBox();
                    }
                  }}
                >
                  <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={closeGeneratorDialogBox}
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
                  <div class="sm:flex sm:items-start justify-center">
                    <div class="mt-7 mr-2 max-w-xl text-sm text-gray-900 w-1/3">
                      <p class="text-right">Nombre de véhicules :</p>
                    </div>
                    <form class="mt-5 sm:flex sm:items-center">
                      <div class="w-full sm:max-w-xs">
                        <label for="nb_vehicle" class="sr-only">
                          Nombre de véhicules
                        </label>
                        <input
                          type="number"
                          name="nb_vehicle"
                          id="nb_vehicle"
                          class="block w-40 rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-gray-300"
                          disabled={true}
                          min={1}
                          max={1}
                          onChange={(evt: Event) => {
                            if (!evt.target) {
                              return;
                            }
                            const target = evt.target as HTMLInputElement;
                            setNbVehicles(parseInt(target.value));
                          }}
                          value={nbVehicles()}
                        />
                      </div>
                    </form>
                  </div>
                  <div class="sm:flex sm:items-start justify-center">
                    <div class="mt-7 mr-2 max-w-xl text-sm text-gray-900 w-1/3">
                      <p class="text-right">Capacité des véhicules :</p>
                    </div>
                    <form class="mt-5 sm:flex sm:items-center">
                      <div class="w-full sm:max-w-xs">
                        <label for="vehicle_capacity" class="sr-only">
                          Capacité des véhicules
                        </label>
                        <input
                          type="number"
                          name="vehicle_capacity"
                          id="vehicle_capacity"
                          class="block w-40 rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                          min={1}
                          onChange={(evt: Event) => {
                            if (!evt.target) {
                              return;
                            }
                            const target = evt.target as HTMLInputElement;
                            setVehiclesCapacity(parseInt(target.value));
                          }}
                          value={vehiclesCapacity()}
                        />
                      </div>
                    </form>
                  </div>

                  <h4 class="text-sm text-left font-semibold leading-6 text-gray-500 mt-7">
                    Paramètres avancés du solveur de circuit
                  </h4>
                  <div class="sm:flex sm:items-start justify-center">
                    <div class="mt-5 mr-2 max-w-xl text-sm text-gray-900 w-1/2">
                      <p class="text-right">
                        Temps maximum de génération (s) :
                      </p>
                    </div>
                    <form class="mt-3 sm:flex sm:items-center">
                      <div class="w-full sm:max-w-xs">
                        <label for="time_limit_seconds" class="sr-only">
                          Temps maximum de génération
                        </label>
                        <input
                          type="number"
                          name="time_limit_seconds"
                          id="time_limit_seconds"
                          class="block w-40 rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                          step={1}
                          min={10}
                          max={50}
                          onChange={(evt: Event) => {
                            if (!evt.target) {
                              return;
                            }
                            const target = evt.target as HTMLInputElement;
                            setTimeLimitSeconds(parseInt(target.value));
                          }}
                          value={timeLimitSeconds()}
                        />
                      </div>
                    </form>
                  </div>
                  <div class="sm:flex sm:items-start justify-center">
                    <div class="mt-5 mr-2 max-w-xl text-sm text-gray-900 w-1/2">
                      <p class="text-right">
                        Distance maximale parcourue (km) :
                      </p>
                    </div>
                    <form class="mt-3 sm:flex sm:items-center">
                      <div class="w-full sm:max-w-xs">
                        <label for="maximum_travel_distance" class="sr-only">
                          Distance maximale parcourue
                        </label>
                        <input
                          type="number"
                          name="maximum_travel_distance"
                          id="maximum_travel_distance"
                          class="block w-40 rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                          step={5}
                          min={10}
                          onChange={(evt: Event) => {
                            if (!evt.target) {
                              return;
                            }
                            const target = evt.target as HTMLInputElement;
                            setMaximumTravelDistance(parseInt(target.value));
                          }}
                          value={maximumTravelDistance()}
                        />
                      </div>
                    </form>
                  </div>
                  <div class="sm:flex sm:items-start justify-center">
                    <div class="mt-4 mr-2 max-w-xl text-sm text-gray-900 w-1/2">
                      <p class="text-right">Paramétre d'homogénéisation :</p>
                      <p class="text-right text-xs text-gray-500">
                        GlobalSpanCostCoefficient (x100 000 000)
                      </p>
                    </div>
                    <form class="mt-3 sm:flex sm:items-center">
                      <div class="w-full sm:max-w-xs">
                        <label
                          for="global_span_cost_coefficient"
                          class="sr-only"
                        >
                          Paramétre d'homogénéisation
                        </label>
                        <input
                          type="number"
                          name="global_span_cost_coefficient"
                          id="global_span_cost_coefficient"
                          class="block w-40 rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                          step={1}
                          min={1}
                          onChange={(evt: Event) => {
                            if (!evt.target) {
                              return;
                            }
                            const target = evt.target as HTMLInputElement;
                            setGlobalSpanCostCoefficient(
                              parseInt(target.value)
                            );
                          }}
                          value={globalSpanCostCoefficient()}
                        />
                      </div>
                    </form>
                  </div>

                  <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      ref={setRefButton}
                      type="button"
                      class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                      onClick={handlerOnClickSoumettre}
                    >
                      Soumettre
                    </button>
                    <button
                      type="button"
                      class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={closeGeneratorDialogBox}
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
