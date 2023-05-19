import "leaflet/dist/leaflet.css";

import { Show, onMount } from "solid-js";

import PointsRamassageAndEtablissement, {
  fetchPointsRamassage,
} from "../../PointsRamassageAndEtablissement";

import { buildMapL7 } from "../../l7MapBuilder";
import BusLines from "../../line/BusLines";
import { useStateAction } from "../../StateAction";
import LineUnderConstruction from "../../line/LineUnderConstruction";
import {
  disableSpinningWheel,
  enableSpinningWheel,
  setDragAndDropConfirmation,
  setPoints,
} from "../../signaux";
import { ReturnMessageType } from "../../type";
import ControlMapMenu from "./rightMapMenu/RightMapMenu";
import { InformationBoard } from "./rightMapMenu/InformationBoard";
import { auth0Client } from "../../auth/auth";

const [, { isInAddLineMode }] = useStateAction();

function buildMap(div: HTMLDivElement) {
  const option: string = "l7";
  switch (option) {
    case "l7": {
      buildMapL7(div);
      break;
    }
  }
}

export default function () {
  let mapDiv: HTMLDivElement;
  let mapDragDropDiv: HTMLDivElement;
  onMount(() => {
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
      () => {
        mapDragDropDiv.classList.remove("highlight");
      },
      false
    );
    mapDragDropDiv.addEventListener(
      "dragend",
      () => {
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

        // process all File objects
        for (let i = 0, file; (file = files[i]); i++) {
          const formData = new FormData();
          formData.append("file", file, file.name);
          auth0Client
            .getTokenSilently()
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
                  setDragAndDropConfirmation({
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
        }
        mapDragDropDiv.classList.remove("highlight");
      },
      false
    );
    return buildMap(mapDiv);
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
    </>
  );
}
