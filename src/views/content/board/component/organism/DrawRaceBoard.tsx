import { Show, createSignal, onCleanup, onMount } from "solid-js";

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
import CurvedLine from "../../../../../icons/CurvedLine";
import SimpleRace from "../../../../../icons/SimpleLine";
import { updatePointColor } from "../../../../../leafletUtils";
import {
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { NatureEnum } from "../../../../../type";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { QuantityUtils } from "../../../../../utils/quantity.utils";
import {
  setRaces,
  setSelectedRace,
  updateRaces,
} from "../../../map/component/organism/Races";
import { quitModeDrawRace } from "../../../map/shortcut";
import { DrawHelperButton } from "../atom/DrawHelperButton";
import ButtonIcon from "../molecule/ButtonIcon";
import LabeledInputField from "../molecule/LabeledInputField";
import { RaceColorPicker } from "../molecule/RaceColorPicker";
import SchoolsEnumeration from "../molecule/SchoolsEnumeration";
import { changeBoard } from "../template/ContextManager";
import CollapsibleElement from "./CollapsibleElement";
import "./DrawRaceBoard.css";
import Metrics from "./Metrics";
import { RaceTimeline } from "./RaceTimeline";

export enum DrawModeStep {
  start,
  schoolSelection,
  editRace,
}

export const [currentStep, setCurrentStep] = createSignal<DrawModeStep>(
  DrawModeStep.start
);

export enum displayRaceModeEnum {
  straight = "straight",
  onRoad = "onRoad",
}

export const [displayRaceMode, setDisplayRaceMode] =
  createSignal<displayRaceModeEnum>(displayRaceModeEnum.straight);

export const [currentRace, setCurrentRace] = createStore<RaceType>(
  RaceEntity.defaultRace()
);

export const [currentRaceIndex, setCurrentRaceIndex] = createSignal(0);

export const [isInUpdate, setIsInUpdate] = createSignal(false);

export const [initialRace, setInitialRace] = createStore<RaceType>(
  RaceEntity.defaultRace()
);

export function DrawRaceBoard() {
  onMount(() => {
    if (isInUpdate()) {
      setInitialRace(currentRace);
      QuantityUtils.substract(currentRace);
    } else {
      setInitialRace(RaceEntity.defaultRace());
    }
  });
  onCleanup(() => {
    setIsInUpdate(false);
  });

  return (
    <div class="add-line-information-board-content">
      <Show when={currentStep() == DrawModeStep.schoolSelection}>
        <SelectedSchool schoolSelected={currentRace.schools} />
      </Show>

      <Show when={currentStep() == DrawModeStep.editRace}>
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

        <div class="flex mt-4 justify-between">
          <RaceColorPicker
            defaultColor={currentRace.color}
            onChange={(color) => setCurrentRace("color", color)}
          />

          <Show
            when={displayRaceMode() == displayRaceModeEnum.straight}
            fallback={
              <ButtonIcon
                icon={<SimpleRace />}
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

      <Show when={currentStep() == DrawModeStep.editRace}>
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
          label: currentStep() == DrawModeStep.editRace ? "Valider" : "Suivant",
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

async function createOrUpdateRace() {
  let race: RaceType = currentRace;
  if (currentRace.id == undefined) {
    race = await RaceService.create(currentRace);
  } else {
    race = await RaceService.update(currentRace);
  }
  updateRaces(race);

  QuantityUtils.add(race);
  setRaces((r) => r.id === race.id, "selected", true);

  setDisplayRaceMode((prev) =>
    prev == displayRaceModeEnum.straight ? prev : displayRaceModeEnum.straight
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
      setCurrentStep(DrawModeStep.editRace);
    case DrawModeStep.editRace:
      if (currentRace.points.length < 2) {
        break;
      }
      if (!currentRace.waypoints) {
        const waypoints = WaypointEntity.createWaypointsFromRace(currentRace);
        setCurrentRace("waypoints", waypoints);
      }
      if (displayRaceMode() == displayRaceModeEnum.straight) {
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
      MapElementUtils.deselectAllPointsAndBusRaces();

      break;
    case DrawModeStep.editRace:
      if (isInUpdate()) {
        QuantityUtils.add(initialRace);
        setSelectedRace(initialRace);
        updateRaces(initialRace);
        changeBoard("line-details");
      } else {
        setCurrentRace(RaceEntity.defaultRace());
        if (displayRaceMode() == displayRaceModeEnum.onRoad) {
          setCurrentRace("latLngs", []);
        }
        setCurrentStep(DrawModeStep.schoolSelection);
      }
      break;
  }
  setDisplayRaceMode((prev) =>
    prev == displayRaceModeEnum.straight ? prev : displayRaceModeEnum.straight
  );
}

async function onClick() {
  if (displayRaceMode() == displayRaceModeEnum.straight) {
    if (currentRace.points.length < 2) {
      return;
    }
    if (!currentRace.waypoints) {
      const waypoints = WaypointEntity.createWaypointsFromRace(currentRace);
      setCurrentRace("waypoints", waypoints);
    }
    await updatePolylineWithOsrm(currentRace);

    setDisplayRaceMode(displayRaceModeEnum.onRoad);
  } else if (displayRaceMode() == displayRaceModeEnum.onRoad) {
    // TODO me semble étrange
    setCurrentRace("latLngs", []);

    setDisplayRaceMode(displayRaceModeEnum.straight);
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
  if (displayRaceMode() == displayRaceModeEnum.onRoad) {
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
