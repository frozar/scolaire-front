import "leaflet/dist/leaflet.css";

import { Show, onMount } from "solid-js";

import PointsRamassageAndEtablissement, {
  fetchPointsRamassage,
} from "./PointsRamassageAndEtablissement";

import { buildMapL7 } from "./l7MapBuilder";
import BusLines from "./line/BusLines";
import { useStateAction } from "./StateAction";
import LineUnderConstruction from "./line/LineUnderConstruction";
import { setDragAndDropConfirmation, setPoints } from "./signaux";
import { ReturnMessage } from "./type";
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
        const files = e.target.files || e.dataTransfer.files;

        // process all File objects
        for (let i = 0, file; (file = files[i]); i++) {
          const formData = new FormData();
          formData.append("file", file, file.name);
          fetch(import.meta.env.VITE_BACK_URL + "/uploadfile/", {
            method: "POST",
            body: formData,
          })
            .then((res) => {
              return res.json();
            })
            .then((res: ReturnMessage) => {
              setDragAndDropConfirmation({
                displayed: true,
                message: res.message,
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
      <div ref={mapDiv} id="main-map" />
      <PointsRamassageAndEtablissement />
      <Show when={isInAddLineMode()}>
        <LineUnderConstruction />
      </Show>
      <BusLines />
    </>
  );
}
