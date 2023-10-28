import { createEffect, createSignal } from "solid-js";
import { addNewUserInformation } from "../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../type";
import { assertIsNode } from "../../../utils";
import { closeCreateMapModal } from "./Dashboard";
import { createMap } from "./dashboard";

import ClickOutside from "../../../component/ClickOutside";

false && ClickOutside;

export default function () {
  const [buttonRef, setButtonRef] = createSignal<
    HTMLButtonElement | undefined
  >();

  createEffect(() => {
    buttonRef()?.focus();
  });

  let refDialogueBox!: HTMLDivElement;

  let refInput!: HTMLInputElement;

  return (
    <div
      class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
      ref={refDialogueBox}
      use:ClickOutside={(e: MouseEvent) => {
        if (!e.target) {
          return;
        }

        // If the target element is an SVG element => exit
        const targetType = e.target.constructor.name;
        if (targetType.slice(0, 3) === "SVG") {
          return;
        }

        assertIsNode(e.target);
        if (!refDialogueBox.contains(e.target)) {
          closeCreateMapModal();
        }
      }}
    >
      <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
        <button
          type="button"
          class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => {
            closeCreateMapModal();
          }}
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
            Créer une nouvelle carte
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              Veuillez entrer le nom de la carte que vous souhaitez
            </p>
          </div>
          <div class="mt-1">
            <input
              type="text"
              ref={refInput}
              class="w-full p-2 mt-2 border border-gray-400 rounded-md bg-white"
              placeholder="Nom de la carte"
            />
          </div>
        </div>
      </div>
      <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          ref={setButtonRef}
          class="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:ml-3 sm:w-auto"
          onClick={() => {
            closeCreateMapModal();
            const mapName = refInput.value;
            if (mapName) {
              createMap(mapName);
            } else {
              addNewUserInformation({
                type: MessageTypeEnum.global,
                content: "Le nom de la carte ne peut pas être vide",
                displayed: true,
                level: MessageLevelEnum.error,
              });
            }
          }}
        >
          Valider
        </button>
        <button
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={() => {
            closeCreateMapModal();
          }}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
