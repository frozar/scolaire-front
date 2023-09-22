import { Show, createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { getSelectedBusLine } from "../../../map/component/organism/BusLines";
import { schoolDetailsItem } from "../../../schools/component/organism/SchoolDetails";
import { stopDetailsItem } from "../../../stops/component/organism/StopDetails";
import { changeBoard, onBoard } from "../template/ContextManager";
import "./Breadcrumb.css";

const [, { getLineUnderConstruction }] = useStateAction();

export default function () {
  const [arianText, setArianText] = createSignal("");
  const [subCrumb, setSubCrumb] = createSignal("");

  createEffect(() => {
    setSubCrumb("");
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

      case "stops-details":
        setArianText("Liste des arrêts");
        setSubCrumb(stopDetailsItem()?.name.toLowerCase() as string);
        break;

      case "school-details":
        setArianText("Liste des écoles");
        setSubCrumb(schoolDetailsItem()?.name.toLowerCase() as string);
        break;

      case "line-details":
        setArianText("Lignes");
        setSubCrumb(getSelectedBusLine()?.name?.toLowerCase() as string);
      default:
        setArianText("Lignes");
        break;
    }
  });

  function onClick() {
    if (subCrumb() != "") {
      switch (arianText()) {
        case "Liste des arrêts":
          changeBoard("stops");
          break;

        case "Liste des écoles":
          changeBoard("schools");
          break;

        case "Lignes":
          changeBoard("line");
          break;
      }

      setSubCrumb("");
    }
  }

  return (
    <div class="fil-arian flex">
      <button onClick={onClick}>{arianText()}</button>
      <Show when={subCrumb() != ""}>
        <p class="sub-crumb">{" > "}</p>
        <p class="sub-crumb">{subCrumb()}</p>
      </Show>
    </div>
  );
}
