import { createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { schoolDetailsItem } from "../../../schools/component/organism/SchoolDetails";
import { onBoard } from "../template/ContextManager";
import "./FilAriane.css";

const [, { getLineUnderConstruction }] = useStateAction();

export default function () {
  const [arianText, setArianText] = createSignal("");

  createEffect(() => {
    switch (onBoard()) {
      case "line-draw":
        if (getLineUnderConstruction().busLine.schools.length > 0) {
          setArianText("Editer votre ligne");
          break;
        }
        setArianText("Création d'une ligne");
        break;

      case "schools":
        setArianText("Liste des écoles");
        break;

      case "stops":
        setArianText("Liste des arrêts");
        break;

      case "school-details":
        setArianText("Liste des établissement > " + schoolDetailsItem()?.name);
        break;

      default:
        setArianText("Graphicage");
        break;
    }
  });

  return <div class="fil-arian">{arianText()}</div>;
}
