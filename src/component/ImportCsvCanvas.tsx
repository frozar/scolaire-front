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
  callbackSuccess?: () => void
) {
  // console.log("drop");
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

  const formData = new FormData();
  formData.append("file", file, file.name);

  uploadLine(formData)
    .then(async (res) => {
      if (!res) {
        exitCanvas();
        addNewUserInformation({
          displayed: true,
          level: MessageLevelEnum.error,
          type: MessageTypeEnum.global,
          content: "Echec de l'import de fichier",
        });
        return;
      }

      if (res.status != 200) {
        const body = await res.json();
        exitCanvas();
        addNewUserInformation({
          displayed: true,
          level: MessageLevelEnum.error,
          type: MessageTypeEnum.global,
          content: body.message,
        });
        return;
      }

      const body: ReturnMessageType = await res.json();

      // TODO: manage eror above, with maybe an import coinfirmaiton
      //       dialogue box
      // if (body.message === "Pas de fichier envoyé.") {
      //   setImportConfirmation({
      //     displayed: true,
      //     message: body.message,
      //     metrics: {
      //       total: 0,
      //       success: 0,
      //     },
      //     error: {
      //       etablissement: body.error.etablissement,
      //       ramassage: body.error.ramassage,
      //     },
      //     success: {
      //       etablissement: body.success.etablissement,
      //       ramassage: body.success.ramassage,
      //     },
      //   });
      // } else {
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
      // }

      setPoints([]);
      fetchPointsRamassage();
      exitCanvas();

      if (callbackSuccess && typeof callbackSuccess === "function") {
        callbackSuccess();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

export default function (props: {
  display: boolean;
  setDisplay: Setter<boolean>;
  callbackSuccess?: () => void;
}) {
  function dragLeaveHandlerAux(e: DragEvent) {
    dragLeaveHandler(e, props.setDisplay);
  }

  function dragEndHandlerAux(e: DragEvent) {
    dragEndHandler(e, props.setDisplay);
  }

  function dropHandlerAux(e: DragEvent) {
    dropHandler(e, props.setDisplay, props.callbackSuccess);
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
