import { createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../StateAction";
import {
  currentStep,
  drawModeStep,
} from "../../../content/graphicage/component/organism/DrawModeBoardContent";
import "./FilAriane.css";

const [, { isInReadMode, isInAddLineMode }] = useStateAction();

export default function (props: { text?: string }) {
  const [text, setText] = createSignal(props.text ?? "Acceuil");

  createEffect(() => {
    if (isInReadMode()) {
      setText("Acceuil");
    }
  });

  createEffect(() => {
    if (isInAddLineMode()) {
      setText("Création d'une ligne");
    }
  });

  createEffect(() => {
    if (isInAddLineMode() && currentStep() == drawModeStep.editLine) {
      setText("Editer votre ligne");
    }
  });

  return <div class="fil-arian">{text()}</div>;
}
