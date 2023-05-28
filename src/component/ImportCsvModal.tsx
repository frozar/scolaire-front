import { Show, createEffect, createSignal } from "solid-js";
import { Transition } from "solid-transition-group";
import ClickOutside from "../ClickOutside";
import {
  addNewUserInformation,
  closeImportCsvBox,
  getImportCsvBox,
  setImportConfirmation,
} from "../signaux";

import { assertIsNode } from "../utils";
import { MessageLevelEnum, MessageTypeEnum, ReturnMessageType } from "../type";
import { useStateGui } from "../StateGui";
import { fetchEtablissement } from "../views/etablissement/Etablissement";
import { fetchRamassage } from "../views/ramassage/Ramassage";
import { uploadLine } from "../request";

const [, { getSelectedMenu }] = useStateGui();

let fileType = "";
createEffect(() => {
  switch (getSelectedMenu()) {
    case "etablissements":
      fileType = "etablissements.csv";
      break;
    case "ramassages":
      fileType = "ramassages.csv";
      break;
  }
});

export default function (props: { doesCheckInputFilenameFormat: boolean }) {
  const displayed = () => getImportCsvBox()["displayed"];

  let refDialogueBox: HTMLDivElement | undefined;
  let refInputCsv: HTMLInputElement | undefined;

  function handlerOnClickValider() {
    if (!refInputCsv) {
      closeImportCsvBox();
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.warning,
        type: MessageTypeEnum.global,
        content: "Composant 'inputCsv' pas encore monté.",
      });
      return;
    }

    const files = refInputCsv.files;
    console.log(getSelectedMenu());
    // process all File objects

    if (!files) {
      closeImportCsvBox();
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.warning,
        type: MessageTypeEnum.global,
        content: "Aucun fichier sélectionné",
      });
      return;
    }

    if (files.length != 1) {
      closeImportCsvBox();
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.warning,
        type: MessageTypeEnum.global,
        content: "Importer un fichier à la fois svp",
      });
      return;
    }

    const file = files[0];

    // console.log("file.name.toLowerCase()", file.name.toLowerCase());
    // console.log("fileType.toLowerCase()", fileType.toLowerCase());
    // console.log(
    //   "file.name.toLowerCase().includes(fileType.toLowerCase())",
    //   file.name.toLowerCase().includes(fileType.toLowerCase())
    // );

    if (
      props.doesCheckInputFilenameFormat &&
      !file.name.toLowerCase().includes(fileType.toLowerCase())
    ) {
      closeImportCsvBox();
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content: `Format incorrect : ${file.name}.`,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file, file.name);

    uploadLine(formData)
      .then(async (res) => {
        if (!res) {
          addNewUserInformation({
            displayed: true,
            level: MessageLevelEnum.error,
            type: MessageTypeEnum.global,
            content: "Echec de l'import de fichier",
          });
          return;
        }

        const body: ReturnMessageType = await res.json();

        setImportConfirmation({
          displayed: true,
          message: body.message,
          metrics: {
            total: body.metrics.total,
            success: body.metrics.success,
          },
          error: {
            etablissement: body.error.etablissement,
            ramassage: body.error.ramassage,
          },
          success: {
            etablissement: body.success.etablissement,
            ramassage: body.success.ramassage,
          },
        });
      })
      .finally(() => {
        switch (getSelectedMenu()) {
          case "etablissements":
            fetchEtablissement();
            break;
          case "ramassages":
            fetchRamassage();
            break;
        }
      })
      .catch((e) => {
        closeImportCsvBox();
        addNewUserInformation({
          displayed: true,
          level: MessageLevelEnum.error,
          type: MessageTypeEnum.removeLine,
          content: `Une erreur est survenue : ${e}.`,
        });
      });

    closeImportCsvBox();
  }

  const [buttonRef, setButtonRef] = createSignal<
    HTMLButtonElement | undefined
  >();

  createEffect(() => {
    buttonRef()?.focus();
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
          {/* <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div> */}

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
                        Importer les établissements
                      </h3>
                      <p>Le format de fichier attendu : </p>
                      <p>AAAA-MM-JJ_hh-mm_{fileType}</p>
                      <form method="post" enctype="multipart/form-data">
                        <div>
                          <label for="file">
                            Sélectionner le fichier à envoyer
                          </label>
                          <input
                            ref={refInputCsv}
                            type="file"
                            id="file"
                            name="file"
                            accept=".csv"
                            multiple
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                  <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      ref={setButtonRef}
                      class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={handlerOnClickValider}
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
