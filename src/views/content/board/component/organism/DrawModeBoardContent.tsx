import { Show, createSignal } from "solid-js";

import SelectedSchool from "../atom/SelectedSchool";

import BoardFooterActions from "../molecule/BoardFooterActions";

import "../../../../../css/timeline.css";

import _ from "lodash";
import { createStore } from "solid-js/store";
import {
  RaceEntity,
  RacePointType,
  RaceType,
} from "../../../../../_entities/race.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import {
  WaypointEntity,
  WaypointType,
} from "../../../../../_entities/waypoint.entity";
import { OsrmService } from "../../../../../_services/osrm.service";
import { RaceService } from "../../../../../_services/race.service";
import CheckIcon from "../../../../../icons/CheckIcon";
import CurvedLine from "../../../../../icons/CurvedLine";
import SimpleCourse from "../../../../../icons/SimpleLine";
import { updatePointColor } from "../../../../../leafletUtils";
import {
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { NatureEnum } from "../../../../../type";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { setRaces, updateRaces } from "../../../map/component/organism/Races";
import { quitModeDrawRace } from "../../../map/shortcut";
import { DrawHelperButton } from "../atom/DrawHelperButton";
import ButtonIcon from "../molecule/ButtonIcon";
import LabeledInputField from "../molecule/LabeledInputField";
import { RaceColorPicker } from "../molecule/RaceColorPicker";
import SchoolsEnumeration from "../molecule/SchoolsEnumeration";
import { changeBoard } from "../template/ContextManager";
import CollapsibleElement from "./CollapsibleElement";
import "./DrawModeBoardContent.css";
import Metrics from "./Metrics";
import { RaceTimeline } from "./RaceTimeline";

export enum DrawModeStep {
  start,
  schoolSelection,
  editCourse,
}

export const [currentStep, setCurrentStep] = createSignal<DrawModeStep>(
  DrawModeStep.start
);

export enum displayCourseModeEnum {
  straight = "straight",
  onRoad = "onRoad",
}

export const [displayCourseMode, setDisplayCourseMode] =
  createSignal<displayCourseModeEnum>(displayCourseModeEnum.straight);

export const [currentRace, setCurrentRace] = createStore<RaceType>(
  RaceEntity.defaultRace()
);

export const [currentRaceIndex, setCurrentRaceIndex] = createSignal(0);

// TODO rename function & file to RaceDrawerBoard
export default function () {
  return (
    <div class="add-line-information-board-content">
      <Show when={currentStep() == DrawModeStep.schoolSelection}>
        <SelectedSchool schoolSelected={currentRace.schools} />
      </Show>

      <Show when={currentStep() == DrawModeStep.editCourse}>
        <div class="bus-course-information-board-content-schools">
          <SchoolsEnumeration
            schoolsName={currentRace.schools.map((school) => school.name)}
          />
          <Show when={currentRace.points.length > 0}>
            <DrawHelperButton schools={currentRace.schools} />
          </Show>
        </div>
        <CollapsibleElement title="Métriques">
          <Metrics race={currentRace} />
        </CollapsibleElement>
        <LabeledInputField
          label="Nom de la course"
          value={currentRace.name}
          onInput={(e) => setCurrentRace("name", e.target.value)}
          name="line-name"
          placeholder="Entrer le nom de la course"
        />
        <ButtonIcon
          icon={<CheckIcon />}
          onClick={onClickTest}
          class="line-to-road-btn-icon"
        />

        <div class="flex mt-4 justify-between">
          <RaceColorPicker
            defaultColor={currentRace.color}
            onChange={(color) => setCurrentRace("color", color)}
          />

          <Show
            when={displayCourseMode() == displayCourseModeEnum.straight}
            fallback={
              <ButtonIcon
                icon={<SimpleCourse />}
                onClick={onClick}
                class="line-to-road-btn-icon"
              />
            }
          >
            <ButtonIcon
              icon={<CurvedLine />}
              onClick={onClick}
              class="line-to-road-btn-icon"
            />
          </Show>
        </div>
      </Show>

      <Show when={currentStep() == DrawModeStep.editCourse}>
        <div class="bus-course-information-board-content">
          <Show
            when={currentRace.points.length > 0}
            fallback={
              <div class="flex w-4/5 text-xs justify-center absolute bottom-[500px]">
                Veuillez sélectionner des points sur la carte
              </div>
            }
          >
            <RaceTimeline
              race={currentRace}
              setRace={setCurrentRace}
              inDraw={true}
            />
          </Show>
        </div>
      </Show>

      <BoardFooterActions
        nextStep={{
          callback: nextStep,
          label:
            currentStep() == DrawModeStep.editCourse ? "Valider" : "Suivant",
        }}
        previousStep={{
          callback: prevStep,
          label:
            currentStep() === DrawModeStep.schoolSelection
              ? "Annuler"
              : "Précédant",
        }}
      />
    </div>
  );
}

export function removeSchoolToRace(school: SchoolType) {
  setCurrentRace("schools", []);
}
export function addPointToRace(point: RacePointType) {
  setCurrentRace("points", (points: RacePointType[]) => {
    // TODO richard pourquoi cette condition ?
    // TODO MAYBE_ERROR
    if (!_.isEqual(points.at(-1), point)) {
      points.splice(currentRaceIndex(), 0, point);
    }
    setCurrentRaceIndex(points.length);
    return points;
  });
}

export function addSchoolToRace(school: SchoolType) {
  setCurrentRace("schools", [school]);
}

// TODO delete (use for testing)
function onClickTest() {
  console.log(currentRace);
}

async function createOrUpdateRace() {
  let race: RaceType = currentRace;
  if (currentRace.id == undefined) {
    race = await RaceService.create(currentRace);
  } else {
    race = await RaceService.update(currentRace);
  }
  updateRaces(race);
  setRaces((r) => r.id === race.id, "selected", true);

  //TODO to change
  setDisplayCourseMode((prev) =>
    prev == displayCourseModeEnum.straight
      ? prev
      : displayCourseModeEnum.straight
  );
  setCurrentStep(DrawModeStep.start);
  quitModeDrawRace();
}

async function nextStep() {
  enableSpinningWheel();
  switch (currentStep()) {
    case DrawModeStep.schoolSelection:
      if (currentRace.schools.length < 1) {
        break;
      }
      setCurrentStep(DrawModeStep.editCourse);
    case DrawModeStep.editCourse:
      if (currentRace.points.length < 2) {
        break;
      }
      if (!currentRace.waypoints) {
        // TODO doublon avec autre code plus haut
        const waypoints = WaypointEntity.createWaypointsFromRace(currentRace);
        setCurrentRace("waypoints", waypoints);
      }
      if (displayCourseMode() == displayCourseModeEnum.straight) {
        // TODO polyline
        await updatePolylineWithOsrm(currentRace);
      }

      await createOrUpdateRace();
      changeBoard("line-details");
      updatePointColor();
  }
  disableSpinningWheel();
}

function prevStep() {
  switch (currentStep()) {
    case DrawModeStep.schoolSelection:
      setCurrentRace(RaceEntity.defaultRace());
      quitModeDrawRace();

      setCurrentStep(DrawModeStep.start);
      changeBoard("line");
      MapElementUtils.deselectAllPointsAndBusCourses();

      break;
    case DrawModeStep.editCourse:
      //TODO maybe unused
      // const course = unmodifiedBusCourse();
      // if (course) {
      //   setCourses((buscourses) => {
      //     buscourses = [
      //       ...buscourses.filter((course) => course.id != currentRace.id),
      //     ];
      //     buscourses.push(course);
      //     return buscourses;
      //   });
      //   setUnmodifiedBusCourse(undefined);
      // }

      setCurrentRace(RaceEntity.defaultRace());

      if (displayCourseMode() == displayCourseModeEnum.onRoad) {
        // TODO me semble étrange
        setCurrentRace("latLngs", []);
      }

      setCurrentStep(DrawModeStep.schoolSelection);
      break;
  }
  setDisplayCourseMode((prev) =>
    prev == displayCourseModeEnum.straight
      ? prev
      : displayCourseModeEnum.straight
  );
}

async function onClick() {
  if (displayCourseMode() == displayCourseModeEnum.straight) {
    if (currentRace.points.length < 2) {
      return;
    }
    if (!currentRace.waypoints) {
      //TODO doublon
      const waypoints = WaypointEntity.createWaypointsFromRace(currentRace);
      setCurrentRace("waypoints", waypoints);
    }
    await updatePolylineWithOsrm(currentRace);

    setDisplayCourseMode(displayCourseModeEnum.onRoad);
  } else if (displayCourseMode() == displayCourseModeEnum.onRoad) {
    // TODO m'a l'aire problèmatique
    setCurrentRace("latLngs", []);

    setDisplayCourseMode(displayCourseModeEnum.straight);
  }
}

export function removePoint(point: StopType | SchoolType) {
  setCurrentRace("points", (points) => {
    return points.filter(
      (p) => p.id != point.id && p.lat != point.lat && p.lon != point.lon
    );
  });
}

export function updateWaypoints(waypoints: WaypointType[]) {
  setCurrentRace("waypoints", waypoints);

  // TODO ajouter condition si l'on est en displayCourseModeEnum.onRoad ?
  if (displayCourseMode() == displayCourseModeEnum.onRoad) {
    updatePolylineWithOsrm(currentRace);
  }
}

export function updatePoints(points: RacePointType[]) {
  setCurrentRace("points", points);
  setWaypointsFromPoints(points);
  updatePolylineWithOsrm(currentRace);
}

export async function updatePolylineWithOsrm(race: RaceType) {
  enableSpinningWheel();
  const { latlngs, projectedLatlngs, metrics } =
    await OsrmService.getRoadPolyline(race);

  setCurrentRace("latLngs", latlngs);
  setCurrentRace("metrics", metrics);
  setWaypoints(projectedLatlngs);
  disableSpinningWheel();
}

// TODO MAYBE_ERROR
function setWaypoints(projectedLatlngs: L.LatLng[]) {
  if (!currentRace.waypoints) {
    return;
  }
  let waypoints = [...currentRace.waypoints];
  waypoints = waypoints.map((waypoint, i) => {
    return {
      ...waypoint,
      onRoadLat: projectedLatlngs[i].lat,
      onRoadLon: projectedLatlngs[i].lng,
    };
  });

  setCurrentRace("waypoints", waypoints);
}
// TODO to delete initial code for setWaypoints()
// function setOnRoad(course: CourseType, projectedLatlngs: L.LatLng[]) {
//   if (projectedLatlngs.length == 0) {
//     setCourseUnderConstruction({
//       ...getCourseUnderConstruction(),
//       course: course,
//     });
//     return;
//   }
//   let waypoints = course.waypoints;
//   if (!waypoints) {
//     return;
//   }
//   waypoints = [...waypoints].map((waypoint, i) => {
//     return {
//       ...waypoint,
//       onRoadLat: projectedLatlngs[i].lat,
//       onRoadLon: projectedLatlngs[i].lng,
//     };
//   });

//   setCourseUnderConstruction({
//     ...getCourseUnderConstruction(),
//     course: {
//       ...getCourseUnderConstruction().course,
//       waypoints,
//     },
//   });
// }

function setWaypointsFromPoints(points: RacePointType[]) {
  const waypoints: WaypointType[] = [];
  for (const point of points) {
    if (point.nature == NatureEnum.school) {
      waypoints.push({
        idSchool: point.id,
        lon: point.lon,
        lat: point.lat,
      });
    } else if (point.nature == NatureEnum.stop) {
      waypoints.push({
        idStop: point.id,
        lon: point.lon,
        lat: point.lat,
      });
    }
  }
  setCurrentRace("waypoints", waypoints);
}
