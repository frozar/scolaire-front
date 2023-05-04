import "leaflet/dist/leaflet.css";

import { Show, onMount } from "solid-js";

import PointsRamassageAndEtablissement, {
  fetchPointsRamassage,
} from "./PointsRamassageAndEtablissement";

import { buildMapL7 } from "./l7MapBuilder";
import BusLines from "./line/BusLines";
import { useStateAction } from "./StateAction";
import LineUnderConstruction from "./line/LineUnderConstruction";
import { setPoints } from "./signaux";
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

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  console.log("dt ", dt, "files ", files);
}
export default function () {
  let mapDiv: HTMLDivElement;
  let mapDiv2: HTMLDivElement;
  onMount(() => {
    mapDiv.addEventListener(
      "dragenter",
      (e) => {
        e.preventDefault();
        mapDiv2.classList.remove("dropbox-none");
        mapDiv2.classList.add("highlight");
      },
      false
    );

    mapDiv2.addEventListener(
      "dragleave",
      () => {
        mapDiv2.classList.remove("highlight");
      },
      false
    );
    mapDiv2.addEventListener(
      "dragend",
      (e) => {
        const data = e.dataTransfer.getData("text/html");
        mapDiv2.classList.remove("highlight");
        console.log("test end, ", data);
      },
      false
    );
    mapDiv2.addEventListener(
      "dragover",
      (e) => {
        e.preventDefault();
      },
      false
    );
    mapDiv2.addEventListener(
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
          });
          if (true) {
            const reader = new FileReader();
            reader.onload = function (e) {
              // get file content
              const text = e.target.result;
              console.log(text);
            };
            reader.readAsText(file);
          }
        }
        mapDiv2.classList.remove("highlight");
        fetchPointsRamassage();
      },
      false
    );
    return buildMap(mapDiv);
  });
  return (
    <>
      <div ref={mapDiv2}>
        <div class="child">Drop here</div>
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
