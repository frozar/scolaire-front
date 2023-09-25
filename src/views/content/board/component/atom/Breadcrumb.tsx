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
        setCrumbText("Ecoles");
        break;

      case "stops":
        setCrumbText("Arrêts");
        break;

      case "stop-details":
        setCrumbText("Arrêts");
        setSubCrumb(stopDetailsItem()?.name.toLowerCase() as string);
        break;

      case "school-details":
        setCrumbText("Ecoles");
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
        case "Arrêts":
          changeBoard("stops");
          break;

        case "Ecoles":
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
    <div class="breadcrumb">
      <Show when={subCrumb() != ""} fallback={crumbText()}>
        <p class="sub-crumb">
          <button class="breadcrumb" onClick={onClick}>
            {crumbText()}
          </button>
          {" > " + subCrumb()}
        </p>
      </Show>
    </div>
  );
}
