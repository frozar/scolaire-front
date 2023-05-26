import { Setter, createEffect, onMount } from "solid-js";
import { MessageLevelEnum, MessageTypeEnum, ReturnMessageType } from "../type";
import {
  addNewUserInformation,
  disableSpinningWheel,
  setImportConfirmation,
} from "../signaux";
import { fetchEtablissement } from "../views/etablissement/Etablissement";
import { uploadLine } from "../request";

let DragDropDiv: HTMLDivElement;
let DragDropChild: HTMLDivElement;

export default function (props: {
  display: boolean;
  setDisplay: Setter<boolean>;
}) {
  createEffect(() => {
    if (props.display) {
      DragDropDiv.classList.add("highlight");
      DragDropChild.classList.replace("invisible_child", "child");
    }
  });

  onMount(() => {
    DragDropDiv.addEventListener(
      "dragleave",
      () => {
        DragDropDiv.classList.remove("highlight");
        DragDropChild.classList.replace("child", "invisible_child");
      },
      false
    );

    DragDropDiv.addEventListener(
      "dragend",
      () => {
        DragDropDiv.classList.remove("highlight");

        DragDropChild.classList.replace("child", "invisible_child");
      },
      false
    );

    DragDropDiv.addEventListener(
      "dragover",
      (e) => {
        e.preventDefault();
      },
      false
    );

    DragDropDiv.addEventListener(
      "drop",
      (e: DragEvent) => {
        e.preventDefault();
        if (!e.dataTransfer) {
          DragDropDiv.classList.remove("highlight");
          DragDropChild.classList.replace("child", "invisible_child");
          return;
        }

        const files = e.dataTransfer.files;

        console.log("files", files);

        if (files.length != 1) {
          DragDropDiv.classList.remove("highlight");
          DragDropChild.classList.replace("child", "invisible_child");
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

            console.log("body", body);

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

            fetchEtablissement();
            disableSpinningWheel();
          })
          .catch((err) => {
            console.log(err);
          });

        props.setDisplay(false);
        DragDropDiv.classList.remove("highlight");
        DragDropChild.classList.replace("child", "invisible_child");
      },
      false
    );
  });

  return (
    <div ref={DragDropDiv}>
      <div ref={DragDropChild} class="invisible_child">
        Drop your file here
      </div>
    </div>
  );
}
