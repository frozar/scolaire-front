import "leaflet/dist/leaflet.css";

import { Show, createSignal, onCleanup, onMount } from "solid-js";

import PointsRamassageAndEtablissement, {
  fetchPointsRamassage,
} from "../../PointsRamassageAndEtablissement";

import { buildMapL7 } from "../../l7MapBuilder";
import BusLines from "../../line/BusLines";
import { useStateAction } from "../../StateAction";

import LineUnderConstruction from "../../line/LineUnderConstruction";
import {
  addNewUserInformation,
  closeRemoveConfirmationBox,
  disableSpinningWheel,
  enableSpinningWheel,
  setImportConfirmation,
  fetchBusLines,
  setPoints,
  getClearConfirmation,
} from "../../signaux";
import {
  MessageLevelEnum,
  MessageTypeEnum,
  ReturnMessageType,
} from "../../type";
import ControlMapMenu from "./rightMapMenu/RightMapMenu";
import { InformationBoard } from "./rightMapMenu/InformationBoard";
import { getToken } from "../../auth/auth";
import { addBusLine } from "../../request";
import {
  displayAddLineMessage,
  displayRemoveLineMessage,
} from "../../userInformation/utils";
import { getExportConfirmation } from "../../signaux";
import { getDisplayedGeneratorDialogueBox } from "../../signaux";
import ConfirmStopAddLine, {
  dialogConfirmStopAddLine,
} from "./ConfirmStopAddLine";
import { listHandlerLMap } from "./shortcut";

const [, { isInAddLineMode }] = useStateAction();

function buildMap(div: HTMLDivElement) {
  const option = "l7";
  switch (option) {
    case "l7": {
      buildMapL7(div);
      break;
    }
  }
}

export const [mapDiv, setMapDiv] = createSignal<HTMLDivElement>(
  document.createElement("div")
);

export default function () {
  // let mapDiv: HTMLDivElement;
  let mapDragDropDiv: HTMLDivElement;

  onMount(() => {
    mapDiv().addEventListener(
      "dragenter",
      (e) => {
        e.preventDefault();
        mapDragDropDiv.classList.add("highlight");
      },
      false
    );
    mapDragDropDiv.addEventListener(
      "dragleave",
      (e) => {
        e.preventDefault();
        mapDragDropDiv.classList.remove("highlight");
      },
      false
    );
    mapDragDropDiv.addEventListener(
      "dragend",
      (e) => {
        e.preventDefault();
        mapDragDropDiv.classList.remove("highlight");
      },
      false
    );
    mapDragDropDiv.addEventListener(
      "dragover",
      (e) => {
        e.preventDefault();
      },
      false
    );
    mapDragDropDiv.addEventListener(
      "drop",
      (e) => {
        e.preventDefault();
        enableSpinningWheel();
        const files = e.target.files || e.dataTransfer.files;

        if (files.length != 1) {
          disableSpinningWheel();
          mapDragDropDiv.classList.remove("highlight");
          addNewUserInformation({
            displayed: true,
            level: MessageLevelEnum.warning,
            type: MessageTypeEnum.global,
            content: "Importer un fichier à la fois svp",
          });
          return;
        }

        const file = files[0];

        // process all File objects
        const formData = new FormData();
        formData.append("file", file, file.name);
        getToken()
          .then((token) => {
            fetch(import.meta.env.VITE_BACK_URL + "/uploadfile/", {
              method: "POST",
              headers: {
                authorization: `Bearer ${token}`,
              },
              body: formData,
            })
              .then((res) => {
                return res.json();
              })
              .then((res: ReturnMessageType) => {
                setImportConfirmation({
                  displayed: true,
                  message: res.message,
                  metrics: {
                    total: res.metrics.total,
                    success: res.metrics.success,
                  },
                  error: {
                    etablissement: res.error.etablissement,
                    ramassage: res.error.ramassage,
                  },
                  success: {
                    etablissement: res.success.etablissement,
                    ramassage: res.success.ramassage,
                  },
                });
                setPoints([]);
                fetchPointsRamassage();
                disableSpinningWheel();
              });
          })
          .catch((err) => {
            console.log(err);
          });

        mapDragDropDiv.classList.remove("highlight");
      },
      false
    );

    // Déplacer dans app.tsx dans un createEffect sur le menuSelected

    buildMap(mapDiv());
  });

  onCleanup(() => {
    for (const handler of listHandlerLMap) {
      mapDiv().removeEventListener("keydown", handler);
    }
  });

  return (
    <>
      <div ref={mapDragDropDiv}>
        <div class="child">Drop your file here</div>
      </div>
      <InformationBoard />
      <div ref={setMapDiv} id="main-map" tabindex="-1" />
      <PointsRamassageAndEtablissement />
      <Show when={isInAddLineMode()}>
        <LineUnderConstruction />
      </Show>
      <BusLines />
      <ControlMapMenu />
      <ConfirmStopAddLine />
    </>
  );
}
