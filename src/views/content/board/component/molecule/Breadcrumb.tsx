import { For, Show, createEffect } from "solid-js";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import {
  deselectAllLines,
  getLines,
  getSelectedLine,
} from "../../../map/component/organism/BusLines";
import { selectedRace } from "../../../map/component/organism/Races";
import { selectedClasse } from "../../../schools/component/organism/ClasseBoard";
import { schoolDetailsItem } from "../../../schools/component/organism/SchoolDetails";
import { stopDetailsItem } from "../../../stops/component/organism/StopDetails";
import BreadcrumbButton from "../atom/BreadcrumbButton";
import DisplayBreadcrumbText from "../atom/DisplayBreadcrumbText";
import { currentRace } from "../organism/DrawRaceBoard";
import { changeBoard, onBoard } from "../template/ContextManager";
import "./Breadcrumb.css";

type CrumbType = {
  text: string;
  onClick?: () => void;
};

// TODO le Breadcrumb est à revoir
// TODO: Rename classe => classes; line-details => classe
export default function () {
  function crumbs(): CrumbType[] {
    switch (onBoard()) {
      case "line":
        return [{ text: "Lignes" }];
      case "course":
        return [
          {
            text: "Lignes",
            onClick: () => {
              changeBoard("line");
              MapElementUtils.deselectAllPointsAndBusRaces();
            },
          },
          {
            text: getSelectedLine()?.name as string,
          },
        ];
      case "race-draw":
        if (currentRace().schools.length > 0) {
          return [{ text: "Editer votre course" }];
        }
        return [{ text: "Création d'une course" }];

      case "schools":
        return [{ text: "Ecoles" }];

      case "stops":
        return [{ text: "Arrêts" }];

      case "stop-details":
        return [
          {
            text: "Arrêts",
            onClick: () => {
              changeBoard("stops");
            },
          },
          {
            text: stopDetailsItem()?.name.toLowerCase() as string,
          },
        ];

      case "school-details":
        return [
          {
            text: "Ecoles",
            onClick: () => {
              changeBoard("schools");
            },
          },
          {
            text: schoolDetailsItem()?.name.toLowerCase() as string,
          },
        ];

      case "school-class-add":
      case "school-class-modify":
        return [
          {
            text: "Ecoles",
            onClick: () => {
              changeBoard("schools");
            },
          },
          {
            text: schoolDetailsItem()?.name.toLowerCase() as string,
            onClick: () => changeBoard("school-details"),
          },
          {
            // ! Fix long text display style in breadcrumb
            text:
              onBoard() == "school-class-add"
                ? "Ajouter une classe"
                : (selectedClasse()?.name as string),
          },
        ];

      case "line-details":
        return [
          {
            text: "Lignes",
            onClick: () => {
              changeBoard("line");
              MapElementUtils.deselectAllPointsAndBusRaces();
            },
          },
          {
            text: getSelectedLine()?.name as string,
            onClick: () => {
              changeBoard("course");
              deselectAllLines();
              console.log("getSelectedLine()", getSelectedLine());
              const line = getLines().filter((line) =>
                line.courses
                  .map((course) => course.id)
                  .includes(selectedRace()?.id)
              )[0];
              console.log("selected line", line);
              line.setSelected(true);
            },
          },
          {
            text: selectedRace()?.name?.toLowerCase() as string,
          },
        ];
      default:
        return [];
    }
  }

  createEffect(() => {
    console.log("onBoard", onBoard());
  });

  return (
    <div class="breadcrumb">
      <For each={crumbs()}>
        {(crumb, i) => (
          <Show
            when={crumb.onClick != undefined}
            fallback={
              <DisplayBreadcrumbText crumbIndex={i()} text={crumb.text} />
            }
          >
            <BreadcrumbButton
              text={crumb.text}
              onClick={crumb.onClick as () => void}
            />
            <p class="sub-crumb">{" > "}</p>
          </Show>
        )}
      </For>
    </div>
  );
}
