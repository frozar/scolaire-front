import { Setter, createEffect, onMount } from "solid-js";
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

export default function (props: {
  display: boolean;
  setDisplay: Setter<boolean>;
}) {
  createEffect(() => {
    if (props.display) {
      mapDragDropDiv.classList.add("highlight");
    }
  });

  onMount(() => {
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

        if (!e.dataTransfer) {
          props.setDisplay(false);
          disableSpinningWheel();
          mapDragDropDiv.classList.remove("highlight");
          addNewUserInformation({
            displayed: true,
            level: MessageLevelEnum.warning,
            type: MessageTypeEnum.global,
            content: "Pas de fichier à importer",
          });
          return;
        }

        const files = e.dataTransfer.files;

        if (files.length != 1) {
          props.setDisplay(false);
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
          })
          .catch((err) => {
            console.log(err);
          });

        props.setDisplay(false);
        mapDragDropDiv.classList.remove("highlight");
      },
      false
    );
  });

  return (
    <div ref={mapDragDropDiv}>
      <div class="child">Drop your file here</div>
    </div>
  );
}
