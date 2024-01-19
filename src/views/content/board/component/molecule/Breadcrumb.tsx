import { For, Show } from "solid-js";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import {
  deselectAllLines,
  getLines,
  getSelectedLine,
} from "../../../map/component/organism/BusLines";
import { getSchools } from "../../../map/component/organism/SchoolPoints";
import { selectedTrip } from "../../../map/component/organism/Trips";
import { selectedGrade } from "../../../schools/component/organism/GradeEditBoard";
import { schoolDetailsItem } from "../../../schools/component/organism/SchoolDetails";
import { stopDetailsItem } from "../../../stops/component/organism/StopDetails";
import BreadcrumbButton from "../atom/BreadcrumbButton";
import DisplayBreadcrumbText from "../atom/DisplayBreadcrumbText";
import { currentDrawTrip } from "../organism/DrawTripBoard";
import { changeBoard, onBoard } from "../template/ContextManager";
import "./Breadcrumb.css";

type CrumbType = {
  text: string;
  onClick?: () => void;
};

// TODO le Breadcrumb est à revoir
export default function () {
  function crumbs(): CrumbType[] {
    const linesCrumb: CrumbType = {
      text: "Lignes",
      onClick: () => {
        changeBoard("line");
        MapElementUtils.deselectAllPointsAndBusTrips();
      },
    };

    const schoolsCrumb: CrumbType = {
      text: "Ecoles",
      onClick: () => changeBoard("schools"),
    };

    function tripsCrumb(): CrumbType {
      const line = getLines().filter((line) =>
        line.trips.map((trip) => trip.id).includes(selectedTrip()?.id)
      )[0];
      return {
        text: line.name?.toLowerCase() as string,
        onClick: () => {
          changeBoard("trip");
          deselectAllLines();
          line.setSelected(true);
        },
      };
    }

    switch (onBoard()) {
      case "line":
        return [{ text: "Lignes" }];
      case "schools":
        return [{ text: "Ecoles" }];
      case "stops":
        return [{ text: "Arrêts" }];

      case "trip":
        return [
          linesCrumb,
          {
            text: getSelectedLine()?.name?.toLowerCase() as string,
          },
        ];
      case "stop-details":
        return [
          {
            text: "Arrêts",
            onClick: () => changeBoard("stops"),
          },
          {
            text: stopDetailsItem()?.name.toLowerCase() as string,
          },
        ];
      case "school-details":
        return [
          schoolsCrumb,
          {
            text: schoolDetailsItem()?.name.toLowerCase() as string,
          },
        ];
      case "line-details":
        return [
          linesCrumb,
          tripsCrumb(),
          {
            text: selectedTrip()?.name?.toLowerCase() as string,
          },
        ];

      case "school-grade-modify":
        const school = getSchools().filter((school) =>
          school.grades.find((grade) => grade.id == selectedGrade()?.id)
        )[0];
        return [
          schoolsCrumb,
          {
            text: school.name.toLowerCase(),
            onClick: () => changeBoard("school-details"),
          },
          {
            text: selectedGrade()?.name.toLowerCase() as string,
          },
        ];
      case "school-grade-add":
        return [
          schoolsCrumb,
          {
            text: schoolDetailsItem()?.name.toLowerCase() as string,
            onClick: () => changeBoard("school-details"),
          },
          {
            text: "grade",
          },
        ];
      case "school-grade-details":
        return [
          schoolsCrumb,
          {
            text: schoolDetailsItem()?.name.toLowerCase() as string,
            onClick: () => changeBoard("school-details"),
          },
          {
            text: (selectedGrade()?.name as string).toLowerCase(),
          },
        ];
      case "trip-draw":
        if (currentDrawTrip().schools.length > 0) {
          return [{ text: "Editer votre course" }];
        }
        return [{ text: "Création d'une course" }];

      default:
        return [];
    }
  }

  return (
    <div class="breadcrumb-list">
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
