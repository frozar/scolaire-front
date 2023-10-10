import { For, Show, createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { getSelectedCourse } from "../../../map/component/organism/Courses";
import { schoolDetailsItem } from "../../../schools/component/organism/SchoolDetails";
import { stopDetailsItem } from "../../../stops/component/organism/StopDetails";
import BreadcrumbButton from "../atom/BreadcrumbButton";
import DisplayBreadcrumbText from "../atom/DisplayBreadcrumbText";
import { changeBoard, onBoard } from "../template/ContextManager";
import "./Breadcrumb.css";

const [, { getCourseUnderConstruction }] = useStateAction();

type CrumbType = {
  text: string;
  onClick?: () => void;
};

export default function () {
  const [crumbs, setCrumbs] = createSignal<CrumbType[]>([{ text: "Lignes" }]);

  createEffect(() => {
    switch (onBoard()) {
      case "course-draw":
        if (getCourseUnderConstruction().course.schools.length > 0) {
          setCrumbs([{ text: "Editer votre course" }]);
          break;
        }
        setCrumbs([{ text: "Création d'une course" }]);
        break;

      case "schools":
        setCrumbs([{ text: "Ecoles" }]);
        break;

      case "stops":
        setCrumbs([{ text: "Arrêts" }]);
        break;

      case "stop-details":
        setCrumbs([
          {
            text: "Arrêts",
            onClick: () => {
              changeBoard("stops");
            },
          },
          {
            text: stopDetailsItem()?.name.toLowerCase() as string,
          },
        ]);
        break;

      case "school-details":
        setCrumbs([
          {
            text: "Ecoles",
            onClick: () => {
              changeBoard("schools");
            },
          },
          {
            text: schoolDetailsItem()?.name.toLowerCase() as string,
          },
        ]);
        break;

      case "school-class-add":
      case "school-class-modify":
        setCrumbs([
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
            text: "classe",
          },
        ]);
        break;

      case "line-details":
        setCrumbs([
          {
            text: "Lignes",
            onClick: () => {
              changeBoard("line");
              MapElementUtils.deselectAllPointsAndBusCourses();
            },
          },
          {
            text: getSelectedCourse()?.name?.toLowerCase() as string,
          },
        ]);
    }
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
