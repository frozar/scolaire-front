import {
  For,
  Match,
  Show,
  Switch,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { Transition } from "solid-transition-group";
import {
  closeExportConfirmationBox,
  getExportConfirmationDialogBox,
  setExportType,
} from "../../../../../signaux";
import { ExportTypeEnum } from "../../../../../type";
import { assertIsNode } from "../../../../../utils";
import GtfsExportLogo from "./logo/GtfsExportLogo";
import ImageExportLogo from "./logo/ImageExportLogo";
import { exportData } from "./utils";

const [selected, setSelected] = createSignal<string | null>(null);

function ExportTypeSelect() {
  return (
    <div class="export-select">
      <For
        each={Object.values(ExportTypeEnum).filter(
          (exportType) => typeof exportType === "string"
        )}
      >
        {(exportType) => {
          return (
            <div
              id="export-type"
              onClick={() => {
                if (selected() != null && selected() === exportType) {
                  setSelected(null);
                } else {
                  setSelected(exportType as string);
                }
              }}
              classList={{
                "bg-green-300": selected() === exportType,
              }}
            >
              <div class="mb-4">
                <Switch fallback={null}>
                  <Match when={exportType === "gtfs"}>
                    <GtfsExportLogo />
                  </Match>
                  <Match when={exportType === "csv"}>
                    <GtfsExportLogo />
                  </Match>
                  <Match when={exportType === "image"}>
                    <ImageExportLogo />
                  </Match>
                </Switch>
              </div>
              <div class="text-center text-base">{exportType}</div>
            </div>
          );
        }}
      </For>
    </div>
  );
}

function exitModal({ code }: KeyboardEvent) {
  // @ts-expect-error: Currently the 'keyboard' field doesn't exist on 'navigator'
  const keyboard = navigator.keyboard;
  // eslint-disable-next-line solid/reactivity
  keyboard.getLayoutMap().then(() => {
    if (code === "Escape") {
      if (getExportConfirmationDialogBox()["displayed"]) {
        closeExportConfirmationBox();
      }
    }
  });
}

export default function () {
  let refDialogueBox!: HTMLDivElement;

  onMount(() => {
    // document.addEventListener("keyup", exitModal);
  });

  onCleanup(() => {
    // document.removeEventListener("keyup", exitModal);
  });

  const displayed = () => getExportConfirmationDialogBox()["displayed"];

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
          <div class="export-modal-background" />
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
                  ref={refDialogueBox}
                  tabindex="-1"
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
                      setSelected(null);
                      closeExportConfirmationBox();
                    }
                  }}
                >
                  <div class="card-container">
                    <div class="sm:flex sm:items-start w-full">
                      <div class="card-container-title">
                        <h3 id="modal-title">Choisissez le type d'export :</h3>
                        <div class="mt-2 w-full flex">
                          <ExportTypeSelect />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="button-wrapper">
                    <button
                      type="button"
                      class="export-modal-confirm"
                      onClick={() => {
                        if (selected()) {
                          setExportType(selected());
                          exportData();
                          setSelected(null);
                          closeExportConfirmationBox();
                        }
                      }}
                    >
                      Exporter
                    </button>
                    <button
                      type="button"
                      class="export-modal-cancel"
                      onClick={() => {
                        setSelected(null);
                        closeExportConfirmationBox();
                      }}
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
