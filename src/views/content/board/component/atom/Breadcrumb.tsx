import { Show, createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { getSelectedBusLine } from "../../../map/component/organism/BusLines";
import { schoolDetailsItem } from "../../../schools/component/organism/SchoolDetails";
import { stopDetailsItem } from "../../../stops/component/organism/StopDetails";
import { changeBoard, onBoard } from "../template/ContextManager";
import "./Breadcrumb.css";

const [, { getLineUnderConstruction }] = useStateAction();

export default function () {
  const [crumbText, setCrumbText] = createSignal("");
  const [subCrumb, setSubCrumb] = createSignal("");

  createEffect(() => {
    setSubCrumb("");
    switch (onBoard()) {
      case "line-draw":
        if (getLineUnderConstruction().busLine.schools.length > 0) {
          setCrumbText("Editer votre ligne");
          break;
        }
        setCrumbText("Création d'une ligne");
        break;

      case "schools":
        setCrumbText("Liste des écoles");
        break;

      case "stops":
        setCrumbText("Liste des arrêts");
        break;

      case "stop-details":
        setCrumbText("Liste des arrêts");
        setSubCrumb(stopDetailsItem()?.name.toLowerCase() as string);
        break;

      case "school-details":
        setCrumbText("Liste des écoles");
        setSubCrumb(schoolDetailsItem()?.name.toLowerCase() as string);
        break;

      case "line-details":
        setCrumbText("Lignes");
        setSubCrumb(getSelectedBusLine()?.name?.toLowerCase() as string);
      default:
        setCrumbText("Lignes");
        break;
    }
  });

  function onClick() {
    if (subCrumb() != "") {
      switch (crumbText()) {
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
    <div class="breadcrumb flex">
      <button onClick={onClick}>{crumbText()}</button>
      <Show when={subCrumb() != ""}>
        <p class="sub-crumb">{" > "}</p>
        <p class="sub-crumb">{subCrumb()}</p>
      </Show>
    </div>
  );
}
