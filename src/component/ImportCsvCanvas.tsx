import { Setter, onCleanup, onMount } from "solid-js";
import {
  addNewUserInformation,
  disableSpinningWheel,
  enableSpinningWheel,
  setImportConfirmation,
  setPoints,
} from "../signaux";
import { MessageLevelEnum, MessageTypeEnum, ReturnMessageType } from "../type";
import { uploadLine } from "../request";
import { fetchPointsRamassage } from "../PointsRamassageAndEtablissement";

let mapDragDropDiv: HTMLDivElement;

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

function dropHandler(
  e: DragEvent,
  setDisplay: Setter<boolean>,
  callback?: () => void
) {
  // console.log("drop");
  e.preventDefault();

  enableSpinningWheel();

  if (!e.dataTransfer) {
    setDisplay(false);
    disableSpinningWheel();
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
    setDisplay(false);
    disableSpinningWheel();
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.warning,
      type: MessageTypeEnum.global,
      content: "Aucun fichier sélectionné",
    });
    return;
  }

  if (files.length != 1) {
    setDisplay(false);
    disableSpinningWheel();
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.warning,
      type: MessageTypeEnum.global,
      content: "Importez un fichier à la fois svp",
    });
    return;
  }

  const file = files[0];

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

      if (body.message === "Pas de fichier envoyé.") {
        setImportConfirmation({
          displayed: true,
          message: body.message,
          metrics: {
            total: 0,
            success: 0,
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
      } else {
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
      }

      setPoints([]);
      fetchPointsRamassage();
      disableSpinningWheel();

      if (callback && typeof callback === "function") {
        callback();
      }
    })
    .catch((err) => {
      console.log(err);
    });

  setDisplay(false);
}

export default function (props: {
  display: boolean;
  setDisplay: Setter<boolean>;
  callback?: () => void;
}) {
  function dragLeaveHandlerAux(e: DragEvent) {
    dragLeaveHandler(e, props.setDisplay);
  }

  function dragEndHandlerAux(e: DragEvent) {
    dragEndHandler(e, props.setDisplay);
  }

  function dropHandlerAux(e: DragEvent) {
    dropHandler(e, props.setDisplay, props.callback);
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
