import { Show } from "solid-js";
import { useStateAction } from "../../../../../StateAction";

import {
  DrawHelperDataType,
  GraphicageService,
} from "../../../../../_services/graphicage.service";

const [, { setPointsToCourseUnderConstruction }] = useStateAction();

import { FaSolidWandMagicSparkles } from "solid-icons/fa";
import {
  CoursePointType,
  WaypointType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/course.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import {
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import DrawHelperDialog, {
  openDrawHelperDialog,
} from "../molecule/DrawHelperDialog";

import { NatureEnum } from "../../../../../type";
import { getSchools } from "../../../map/component/organism/SchoolPoints";
import {
  getStops,
  leafletStopsFilter,
} from "../../../map/component/organism/StopPoints";
import {
  displayCourseMode,
  displayCourseModeEnum,
} from "../organism/DrawModeBoardContent";
import "./DrawHelperButton.css";

interface DrawHelperButtonProps {
  schools: SchoolType[] | undefined;
}

const [, { getCourseUnderConstruction, setCourseUnderConstruction }] =
  useStateAction();
async function drawHelper(data: DrawHelperDataType) {
  console.log("Query", data);
  enableSpinningWheel();
  const response = await GraphicageService.drawHelper(data);
  disableSpinningWheel();
  console.log("response", response);
  //TODO Resolve type problem and add quantity here
  const formattedResponse: CoursePointType[] = formatCoursePoints(response);
  setPointsToCourseUnderConstruction(formattedResponse);

  const newWaypoints: WaypointType[] = [];
  for (const point of getCourseUnderConstruction().course.points) {
    if (point.nature == NatureEnum.school) {
      newWaypoints.push({
        idSchool: point.id,
        lon: point.lon,
        lat: point.lat,
      });
    } else if (point.nature == NatureEnum.stop) {
      newWaypoints.push({
        idStop: point.id,
        lon: point.lon,
        lat: point.lat,
      });
    }
  }
  setCourseUnderConstruction({
    ...getCourseUnderConstruction(),
    course: {
      ...getCourseUnderConstruction().course,
      waypoints: newWaypoints,
    },
  });
  if (displayCourseMode() == displayCourseModeEnum.onRoad) {
    updatePolylineWithOsrm(getCourseUnderConstruction().course);
  }
}

export function DrawHelperButton(props: DrawHelperButtonProps) {
  async function requestCircuit(
    capacity: number,
    timeLimitSeconds: number,
    nbLimitSolution: number
  ) {
    const schools: SchoolType[] =
      props.schools != undefined
        ? JSON.parse(JSON.stringify(props.schools))
        : [];

    const selectedStops = JSON.parse(
      JSON.stringify(getCourseUnderConstruction().course.points)
    );

    const stops = leafletStopsFilter();

    const data: DrawHelperDataType = {
      schools: schools,
      selected: selectedStops,
      stops: stops,
      capacity: capacity,
      timeLimitSeconds: timeLimitSeconds,
      nbLimitSolution: nbLimitSolution,
    };

    await drawHelper(data);
  }

  async function onclick() {
    openDrawHelperDialog();
  }

  return (
    <div class="graphicage-draw-helper-button">
      <DrawHelperDialog requestCircuit={requestCircuit} />
      <Show when={getCourseUnderConstruction().course.points.length > 0}>
        <button onClick={onclick}>
          <FaSolidWandMagicSparkles />
        </button>
      </Show>
    </div>
  );
}

function formatCoursePoints(
  data: { id: number; leafletId: number; nature: string; quantity: number }[]
): CoursePointType[] {
  const points = [...getSchools(), ...getStops()];
  const output = [];
  for (const item of data) {
    const point = points.find((point) => item.leafletId == point.leafletId);
    if (point) output.push({ ...point, quantity: item.quantity ?? 0 });
  }
  return output;
}
