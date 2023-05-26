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
import { useStateGui } from "../../StateGui";
import { getExportConfirmation } from "../../signaux";
import { getDisplayedGeneratorDialogueBox } from "../../signaux";
import ConfirmStopAddLine, {
  dialogConfirmStopAddLine,
} from "./ConfirmStopAddLine";

const [
  ,
  {
    setModeAddLine,
    setModeRemoveLine,
    isInAddLineMode,
    isInReadMode,
    resetLineUnderConstruction,
    getLineUnderConstruction,
    setModeRead,
    isInRemoveLineMode,
  },
  history,
] = useStateAction();

function buildMap(div: HTMLDivElement) {
  const option = "l7";
  switch (option) {
    case "l7": {
      buildMapL7(div);
      break;
    }
  }
}

// Handler the Undo/Redo from the user
function undoRedoHandler({ ctrlKey, shiftKey, code }: KeyboardEvent) {
  // // @ts-expect-error
  // const keyboard = navigator.keyboard;
  // // @ts-expect-error
  // keyboard.getLayoutMap().then((keyboardLayoutMap) => {
  //   const upKey = keyboardLayoutMap.get(code);
  //   if (upKey === "x") {
  //     if (history.undos && history.undos[0] && history.undos[0][0]) {
  //       const anUndo = history.undos[0][0];
  //     }
  //   }
  // });

  if (ctrlKey) {
    // @ts-expect-error: Currently the 'keyboard' field doesn't exist on 'navigator'
    const keyboard = navigator.keyboard;
    // @ts-expect-error: The type 'KeyboardLayoutMap' is not available
    keyboard.getLayoutMap().then((keyboardLayoutMap) => {
      const upKey = keyboardLayoutMap.get(code);
      if (upKey === "z") {
        if (!shiftKey && history.isUndoable()) {
          history.undo();
        } else if (shiftKey && history.isRedoable()) {
          history.redo();
        }
      }
    });
  }
}

function escapeHandler({ code }: KeyboardEvent) {
  if (code === "Escape") {
    if (isInReadMode()) {
      return;
    }

    resetLineUnderConstruction();
    setModeRead();
  }
}

function enterHandler({ code }: KeyboardEvent) {
  if (code === "Enter") {
    if (!isInAddLineMode()) {
      return;
    }
    const ids_point = getLineUnderConstruction().stops.map(function (value) {
      return value["id_point"];
    });

    addBusLine(ids_point).then(async (res) => {
      await res.json();
      resetLineUnderConstruction();
      setModeRead();
      fetchBusLines();
    });
  }
}

function toggleLineUnderConstruction({ code }: KeyboardEvent) {
  // @ts-expect-error: Currently the 'keyboard' field doesn't exist on 'navigator'
  const keyboard = navigator.keyboard;
  // @ts-expect-error: The type 'KeyboardLayoutMap' is not available
  keyboard.getLayoutMap().then((keyboardLayoutMap) => {
    const upKey = keyboardLayoutMap.get(code);
    if (upKey === "l") {
      if (isInAddLineMode()) {
        setModeRead();
      } else {
        setModeAddLine();
        displayAddLineMessage();
      }
    }
    if (upKey === "d") {
      // Toggle behavior
      if (!isInRemoveLineMode()) {
        setModeRemoveLine();
        displayRemoveLineMessage();
      } else {
        setModeRead();
        closeRemoveConfirmationBox();
      }
    }
  });
}

export const [mapDiv, setMapDiv] = createSignal<HTMLDivElement>(
  document.createElement("div")
);
export default function () {
  // let mapDiv: HTMLDivElement;
  let mapDragDropDiv: HTMLDivElement;

  onMount(() => {
    mapDiv().focus();

    document.addEventListener("click", () => {
      console.log(document.activeElement);

      if (
        !getExportConfirmation().displayed &&
        !getDisplayedGeneratorDialogueBox() &&
        !getClearConfirmation().displayed &&
        !dialogConfirmStopAddLine
      ) {
        mapDiv().focus();
      }
    });

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
    mapDiv().addEventListener("keydown", undoRedoHandler);
    mapDiv().addEventListener("keydown", escapeHandler);
    mapDiv().addEventListener("keydown", enterHandler);
    mapDiv().addEventListener("keydown", toggleLineUnderConstruction);
    buildMap(mapDiv());
  });

  onCleanup(() => {
    mapDiv().removeEventListener("keydown", undoRedoHandler);
    mapDiv().removeEventListener("keydown", escapeHandler);
    mapDiv().removeEventListener("keydown", enterHandler);
    mapDiv().removeEventListener("keydown", toggleLineUnderConstruction);
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
