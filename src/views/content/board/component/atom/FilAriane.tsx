import { createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { onBoard } from "../template/ContextManager";
import "./FilAriane.css";

const [, { getLineUnderConstruction }] = useStateAction();

export default function () {
  const [text, setText] = createSignal("");

  createEffect(() => {
    switch (onBoard()) {
      case "draw-line":
        if (getLineUnderConstruction().busLine.schools.length > 0) {
          setText("Editer votre ligne");
          break;
        }
        setText("Création d'une ligne");
        break;

      case "schools":
        setText("Liste des écoles");
        break;

      case "stops":
        setText("Liste des arrêts");
        break;

      default:
        setText("Graphicage");
        break;
    }
  });

  return <div class="fil-arian">{text()}</div>;
}
