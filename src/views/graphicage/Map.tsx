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
  disableSpinningWheel,
  enableSpinningWheel,
  setImportConfirmation,
  setPoints,
} from "../../signaux";
import {
  MessageLevelEnum,
  MessageTypeEnum,
  ReturnMessageType,
} from "../../type";
import ControlMapMenu from "./rightMapMenu/RightMapMenu";
import { InformationBoard } from "./rightMapMenu/InformationBoard";
import { getToken } from "../../auth/auth";
import ConfirmStopAddLine from "./ConfirmStopAddLineBox";
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

let mapDiv: HTMLDivElement;

export default function () {
  let mapDragDropDiv: HTMLDivElement;

  onMount(() => {
    // Manage shortcut keyboard event
    for (const handler of listHandlerLMap) {
      document.body.addEventListener("keydown", handler);
    }

    mapDiv.addEventListener(
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

    buildMap(mapDiv);
  });

  onCleanup(() => {
    // Manage shortcut keyboard event
    for (const handler of listHandlerLMap) {
      document.body.removeEventListener("keydown", handler);
    }
  });

  return (
    <>
      <div ref={mapDragDropDiv}>
        <div class="child">Drop your file here</div>
      </div>
      <InformationBoard />
      <div ref={mapDiv} id="main-map" />
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
