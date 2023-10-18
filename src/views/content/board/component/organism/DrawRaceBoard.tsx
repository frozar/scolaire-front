import { Show, createSignal, onCleanup, onMount } from "solid-js";

import SelectedSchool from "../atom/SelectedSchool";

import BoardFooterActions from "../molecule/BoardFooterActions";

import "../../../../../css/timeline.css";

import _ from "lodash";
import { LineType } from "../../../../../_entities/line.entity";
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
import { getLines, setLines } from "../../../map/component/organism/BusLines";
import {
  setRaces,
  setSelectedRace,
  updateRaces,
} from "../../../map/component/organism/Races";
import { quitModeDrawRace } from "../../../map/shortcut";
import { displayBusLine } from "../../../schools/component/molecule/BusLineItem";
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

export enum DrawRaceStep {
  initial,
  schoolSelection,
  editRace,
}

export const [currentStep, setCurrentStep] = createSignal<DrawRaceStep>(
  DrawRaceStep.initial
);

export enum displayRaceModeEnum {
  straight = "straight",
  onRoad = "onRoad",
}

export const [displayRaceMode, setDisplayRaceMode] =
  createSignal<displayRaceModeEnum>(displayRaceModeEnum.straight);

export const [currentDrawRace, setCurrentDrawRace] = createSignal<RaceType>(
  RaceEntity.defaultRace()
);

export const [currentRaceIndex, setCurrentRaceIndex] = createSignal(0);

export const [isInUpdate, setIsInUpdate] = createSignal(false);

export function DrawRaceBoard() {
  onMount(() => {
    if (isInUpdate()) {
      QuantityUtils.substract(currentDrawRace());
    } else {
      setCurrentDrawRace(RaceEntity.defaultRace());
    }
  });
  onCleanup(() => {
    setIsInUpdate(false);
  });

  return (
    <div class="add-line-information-board-content">
      <Show when={currentStep() == DrawRaceStep.schoolSelection}>
        <SelectedSchool schoolSelected={currentDrawRace().schools} />
      </Show>

      <Show when={currentStep() == DrawRaceStep.editRace}>
        <div class="bus-course-information-board-content-schools">
          <SchoolsEnumeration
            schoolsName={currentDrawRace().schools.map((school) => school.name)}
          />
          <Show when={currentDrawRace().points.length > 0}>
            <DrawHelperButton schools={currentDrawRace().schools} />
          </Show>
        </div>
        <CollapsibleElement title="Métriques">
          <Metrics race={currentDrawRace()} />
        </CollapsibleElement>
        <LabeledInputField
          label="Nom de la course"
          value={currentDrawRace().name}
          onInput={(e) =>
            setCurrentDrawRace((race) => {
              return { ...race, name: e.target.value };
            })
          }
          name="line-name"
          placeholder="Entrer le nom de la course"
        />

        <div class="flex mt-4 justify-between">
          <RaceColorPicker
            defaultColor={currentDrawRace().color}
            onChange={(color) =>
              setCurrentDrawRace((race) => {
                return { ...race, color: color };
              })
            }
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

      <Show when={currentStep() == DrawRaceStep.editRace}>
        <div class="bus-course-information-board-content">
          <Show
            when={currentDrawRace().points.length > 0}
            fallback={
              <div class="flex w-4/5 text-xs justify-center absolute bottom-[500px]">
                Veuillez sélectionner des points sur la carte
              </div>
            }
          >
            <RaceTimeline
              race={currentDrawRace()}
              setRace={setCurrentDrawRace}
              inDraw={true}
            />
          </Show>
        </div>
      </Show>

      <BoardFooterActions
        nextStep={{
          callback: nextStep,
          label: currentStep() == DrawRaceStep.editRace ? "Valider" : "Suivant",
        }}
        previousStep={{
          callback: prevStep,
          label:
            currentStep() === DrawRaceStep.schoolSelection || isInUpdate()
              ? "Annuler"
              : "Précédant",
        }}
      />
    </div>
  );
}

export function removeSchoolToRace(school: SchoolType) {
  setCurrentDrawRace((race) => {
    return { ...race, schools: [] };
  });
  console.log(school);
}
export function addPointToRace(point: RacePointType) {
  setCurrentDrawRace((race: RaceType) => {
    // TODO richard pourquoi cette condition ?
    const points = race.points;
    if (!_.isEqual(points.at(-1), point)) {
      points.splice(currentRaceIndex(), 0, point);
    }
    setCurrentRaceIndex(points.length);
    return { ...race, points };
  });
}

export function addSchoolToRace(school: SchoolType) {
  setCurrentDrawRace((race) => {
    return { ...race, schools: [school] };
  });
}
async function createOrUpdateRace() {
  // eslint-disable-next-line solid/reactivity
  let race: RaceType = currentDrawRace();

  if (currentDrawRace().id == undefined) {
    const dbRes: { busLines: LineType[]; newRace: RaceType } =
      await RaceService.create(currentDrawRace());
    setLines(dbRes.busLines);
    race = dbRes.newRace;
  } else {
    race = await RaceService.update(currentDrawRace());
    updateRaces(race);
  }

  QuantityUtils.add(race);
  setRaces((races) => {
    return races.map((currentRace) => {
      if (currentRace.id === race.id) {
        return { ...currentRace, selected: true };
      } else {
        return currentRace;
      }
    });
  });

  setDisplayRaceMode((prev) =>
    prev == displayRaceModeEnum.straight ? prev : displayRaceModeEnum.straight
  );

  setCurrentStep(DrawRaceStep.initial);
  quitModeDrawRace();
  const currentLine = getLines().filter((line) =>
    line.courses.map((course) => course.id).includes(race.id)
  )[0];

  displayBusLine(currentLine);
  // setOnBoard("line-details");
}

async function nextStep() {
  enableSpinningWheel();
  switch (currentStep()) {
    case DrawRaceStep.schoolSelection:
      if (currentDrawRace().schools.length < 1) {
        break;
      }
      setCurrentStep(DrawRaceStep.editRace);
    case DrawRaceStep.editRace:
      if (currentDrawRace().points.length < 2) {
        break;
      }
      if (!currentDrawRace().waypoints) {
        const waypoints = WaypointEntity.createWaypointsFromRace(
          currentDrawRace()
        );
        setCurrentDrawRace((race) => {
          return { ...race, waypoints: waypoints };
        });
      }
      if (displayRaceMode() == displayRaceModeEnum.straight) {
        await updatePolylineWithOsrm(currentDrawRace());
      }

      await createOrUpdateRace();

      setCurrentDrawRace(RaceEntity.defaultRace());
      setCurrentRaceIndex(0);
      setIsInUpdate(false);
      setCurrentDrawRace(RaceEntity.defaultRace());

      setCurrentStep(DrawRaceStep.initial);
      updatePointColor();
  }
  disableSpinningWheel();
}

function prevStep() {
  switch (currentStep()) {
    case DrawRaceStep.schoolSelection:
      setCurrentDrawRace(RaceEntity.defaultRace());
      quitModeDrawRace();

      setCurrentStep(DrawRaceStep.initial);
      changeBoard("line");
      MapElementUtils.deselectAllPointsAndBusRaces();

      break;
    case DrawRaceStep.editRace:
      if (isInUpdate()) {
        QuantityUtils.add(currentDrawRace());
        quitModeDrawRace();
        // eslint-disable-next-line solid/reactivity
        setSelectedRace(() => {
          return getLines()
            .map((line) => line.courses)
            .flat()
            .filter((race) => race.id == currentDrawRace().id)[0];
        });
        setIsInUpdate(false);

        setCurrentStep(DrawRaceStep.initial);
        changeBoard("line-details");
      } else {
        setCurrentDrawRace(RaceEntity.defaultRace());
        if (displayRaceMode() == displayRaceModeEnum.onRoad) {
          setCurrentDrawRace((race) => {
            return { ...race, latLngs: [] };
          });
        }
        setCurrentStep(DrawRaceStep.schoolSelection);
      }
      break;
  }
  setDisplayRaceMode((prev) =>
    prev == displayRaceModeEnum.straight ? prev : displayRaceModeEnum.straight
  );
}

async function onClick() {
  if (displayRaceMode() == displayRaceModeEnum.straight) {
    if (currentDrawRace().points.length < 2) {
      return;
    }
    if (!currentDrawRace().waypoints) {
      const waypoints = WaypointEntity.createWaypointsFromRace(
        currentDrawRace()
      );
      setCurrentDrawRace((race) => {
        return { ...race, waypoints: waypoints };
      });
    }
    await updatePolylineWithOsrm(currentDrawRace());

    setDisplayRaceMode(displayRaceModeEnum.onRoad);
  } else if (displayRaceMode() == displayRaceModeEnum.onRoad) {
    // TODO me semble étrange
    setCurrentDrawRace((race) => {
      return { ...race, latLngs: [] };
    });

    setDisplayRaceMode(displayRaceModeEnum.straight);
  }
}

export function removePoint(point: StopType | SchoolType) {
  setCurrentDrawRace((race) => {
    return {
      ...race,
      points: race.points.filter(
        (p) => p.id != point.id && p.lat != point.lat && p.lon != point.lon
      ),
    };
  });
}

export function updateWaypoints(waypoints: WaypointType[]) {
  setCurrentDrawRace((race) => {
    return { ...race, waypoints: waypoints };
  });
  if (displayRaceMode() == displayRaceModeEnum.onRoad) {
    updatePolylineWithOsrm(currentDrawRace());
  }
}

export function updatePoints(points: RacePointType[]) {
  setCurrentDrawRace((race) => {
    return { ...race, points: points };
  });
  setWaypointsFromPoints(points);
  updatePolylineWithOsrm(currentDrawRace());
}

export async function updatePolylineWithOsrm(race: RaceType) {
  enableSpinningWheel();
  const { latlngs, projectedLatlngs, metrics } =
    await OsrmService.getRoadPolyline(race);

  setCurrentDrawRace((race) => {
    return { ...race, latLngs: latlngs };
  });
  setCurrentDrawRace((race) => {
    return { ...race, metrics: metrics };
  });
  setWaypoints(projectedLatlngs);
  disableSpinningWheel();
}

// TODO MAYBE_ERROR
function setWaypoints(projectedLatlngs: L.LatLng[]) {
  if (!currentDrawRace().waypoints) {
    return;
  }
  let waypoints = currentDrawRace().waypoints as WaypointType[];
  waypoints = waypoints.map((waypoint, i) => {
    return {
      ...waypoint,
      onRoadLat: projectedLatlngs[i].lat,
      onRoadLon: projectedLatlngs[i].lng,
    };
  });

  setCurrentDrawRace((race) => {
    return { ...race, waypoints: waypoints };
  });
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
  setCurrentDrawRace((race) => {
    return { ...race, waypoints: waypoints };
  });
}
