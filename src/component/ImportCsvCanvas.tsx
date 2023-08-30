import { Setter, onCleanup, onMount } from "solid-js";
import {
  addNewUserInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../type";
import { FileUtils } from "../utils/file.utils";
import { setSchools } from "../views/content/graphicage/component/organism/SchoolPoints";
import { setStops } from "../views/content/graphicage/component/organism/StopPoints";

let mapDragDropDiv: HTMLDivElement;
export default function (props: {
  display: boolean;
  setDisplay: Setter<boolean>;
  callbackSuccess?: () => void;
  callbackFail?: () => void;
}) {
  function dragLeaveHandler(e: DragEvent, setDisplay: Setter<boolean>) {
    // console.log("dragleave");
    e.preventDefault();
    setDisplay(false);
  }

  function dragEndHandler(e: DragEvent, setDisplay: Setter<boolean>) {
    // console.log("dragend");
    e.preventDefault();
    setDisplay(false);
  }

  function dragOverHandler(e: DragEvent) {
    // console.log("dragover");
    e.preventDefault();
  }

  // TODO code à mutualiser avec ImportCsvDialogBox.handlerOnClickValider()
  async function dropHandler(e: DragEvent, setDisplay: Setter<boolean>) {
    e.preventDefault();

    enableSpinningWheel();

    function exitCanvas() {
      setDisplay(false);
      disableSpinningWheel();
    }

    if (!e.dataTransfer) {
      exitCanvas();
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.warning,
        type: MessageTypeEnum.global,
        content: "Pas de fichier à importer",
      });
      return;
    }

    const files = e.dataTransfer.files;

    if (!files || files.length == 0) {
      exitCanvas();
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.warning,
        type: MessageTypeEnum.global,
        content: "Aucun fichier sélectionné",
      });
      return;
    }

    if (files.length != 1) {
      exitCanvas();
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.warning,
        type: MessageTypeEnum.global,
        content: "Veuillez importer un fichier à la fois",
      });
      return;
    }

    const file = files[0];

    const { stops, schools } = await FileUtils.importFile(file);

    if (schools || stops) {
      schools ? setSchools(schools) : "";
      stops ? setStops(stops) : "";
      props.callbackSuccess ? props.callbackSuccess() : "";
    } else {
      props.callbackFail ? props.callbackFail() : "";
    }

    exitCanvas();
    disableSpinningWheel();
  }

  function dragLeaveHandlerAux(e: DragEvent) {
    dragLeaveHandler(e, props.setDisplay);
  }

  function dragEndHandlerAux(e: DragEvent) {
    dragEndHandler(e, props.setDisplay);
  }

  function dropHandlerAux(e: DragEvent) {
    dropHandler(e, props.setDisplay);
  }

  onMount(() => {
    mapDragDropDiv.addEventListener("dragleave", dragLeaveHandlerAux);
    mapDragDropDiv.addEventListener("dragend", dragEndHandlerAux);
    mapDragDropDiv.addEventListener("dragover", dragOverHandler);
    mapDragDropDiv.addEventListener("drop", dropHandlerAux);
  });

  onCleanup(() => {
    mapDragDropDiv.removeEventListener("dragleave", dragLeaveHandlerAux);
    mapDragDropDiv.removeEventListener("dragend", dragEndHandlerAux);
    mapDragDropDiv.removeEventListener("dragover", dragOverHandler);
    mapDragDropDiv.removeEventListener("drop", dropHandlerAux);
  });

  return (
    <div ref={mapDragDropDiv} classList={{ highlight: props.display }}>
      <div class="child" classList={{ invisible: !props.display }}>
        Drop your file here
      </div>
    </div>
  );
}
