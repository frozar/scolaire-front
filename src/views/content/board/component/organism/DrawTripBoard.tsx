import { Show, createSignal, onCleanup, onMount } from "solid-js";

import SelectedSchool from "../atom/SelectedSchool";

import BoardFooterActions from "../molecule/BoardFooterActions";

import "../../../../../css/timeline.css";

import _ from "lodash";
import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import {
  TripEntity,
  TripPointType,
  TripType,
} from "../../../../../_entities/trip.entity";
import {
  WaypointEntity,
  WaypointType,
} from "../../../../../_entities/waypoint.entity";
import { OsrmService } from "../../../../../_services/osrm.service";
import { TripService } from "../../../../../_services/trip.service";
import CurvedLine from "../../../../../icons/CurvedLine";
import SimpleTrip from "../../../../../icons/SimpleLine";
import { updatePointColor } from "../../../../../leafletUtils";
import {
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { NatureEnum } from "../../../../../type";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { QuantityUtils } from "../../../../../utils/quantity.utils";
import {
  getLines,
  getSelectedLine,
  setLines,
} from "../../../map/component/organism/BusLines";
import { setselectedTrip } from "../../../map/component/organism/Trips";
import { quitModeDrawTrip } from "../../../map/shortcut";
import { DrawHelperButton } from "../atom/DrawHelperButton";
import ButtonIcon from "../molecule/ButtonIcon";
import LabeledInputField from "../molecule/LabeledInputField";
import SchoolsEnumeration from "../molecule/SchoolsEnumeration";
import { TripColorPicker } from "../molecule/TripColorPicker";
import { changeBoard } from "../template/ContextManager";
import CollapsibleElement from "./CollapsibleElement";
import "./DrawTripBoard.css";
import Metrics from "./Metrics";
import { TripTimeline } from "./TripTimeline";

export enum DrawTripStep {
  initial,
  schoolSelection,
  editTrip,
}

export const [currentStep, setCurrentStep] = createSignal<DrawTripStep>(
  DrawTripStep.initial
);

export enum displayTripModeEnum {
  straight = "straight",
  onRoad = "onRoad",
}

export const [displayTripMode, setDisplayTripMode] =
  createSignal<displayTripModeEnum>(displayTripModeEnum.straight);

export const [currentDrawTrip, setCurrentDrawTrip] = createSignal<TripType>(
  TripEntity.defaultTrip()
);

export const [currentTripIndex, setCurrentTripIndex] = createSignal(0);

export const [isInUpdate, setIsInUpdate] = createSignal(false);

export function DrawTripBoard() {
  onMount(() => {
    if (isInUpdate()) {
      QuantityUtils.substract(currentDrawTrip());
    } else {
      setCurrentDrawTrip(TripEntity.defaultTrip());
    }
  });
  onCleanup(() => {
    setIsInUpdate(false);
  });
  console.log("currentDrawTrip", currentDrawTrip());

  return (
    <div class="add-line-information-board-content">
      <Show when={currentStep() == DrawTripStep.schoolSelection}>
        <SelectedSchool schoolSelected={currentDrawTrip().schools} />
      </Show>

      <Show when={currentStep() == DrawTripStep.editTrip}>
        <div class="bus-trip-information-board-content-schools">
          <SchoolsEnumeration
            schoolsName={currentDrawTrip().schools.map((school) => school.name)}
          />
          <Show when={currentDrawTrip().tripPoints.length > 0}>
            <DrawHelperButton schools={currentDrawTrip().schools} />
          </Show>
        </div>
        <CollapsibleElement title="Métriques">
          <Metrics trip={currentDrawTrip()} />
        </CollapsibleElement>
        <LabeledInputField
          label="Nom de la trip"
          value={currentDrawTrip().name}
          onInput={(e) =>
            setCurrentDrawTrip((trip) => {
              return { ...trip, name: e.target.value };
            })
          }
          name="line-name"
          placeholder="Entrer le nom de la trip"
        />

        <div class="flex mt-4 justify-between">
          <TripColorPicker
            defaultColor={currentDrawTrip().color}
            onChange={(color) =>
              setCurrentDrawTrip((trip) => {
                return { ...trip, color: color };
              })
            }
          />

          <Show
            when={displayTripMode() == displayTripModeEnum.straight}
            fallback={
              <ButtonIcon
                icon={<SimpleTrip />}
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

      <Show when={currentStep() == DrawTripStep.editTrip}>
        <div class="bus-trip-information-board-content">
          <Show
            when={currentDrawTrip().tripPoints.length > 0}
            fallback={
              <div class="flex w-4/5 text-xs justify-center absolute bottom-[500px]">
                Veuillez sélectionner des points sur la carte
              </div>
            }
          >
            <TripTimeline
              trip={currentDrawTrip()}
              setTrip={setCurrentDrawTrip}
              inDraw={true}
            />
          </Show>
        </div>
      </Show>

      <BoardFooterActions
        nextStep={{
          callback: nextStep,
          label: currentStep() == DrawTripStep.editTrip ? "Valider" : "Suivant",
        }}
        previousStep={{
          callback: prevStep,
          label:
            currentStep() === DrawTripStep.schoolSelection || isInUpdate()
              ? "Annuler"
              : "Précédant",
        }}
      />
    </div>
  );
}

export function removeSchoolToTrip(school: SchoolType) {
  setCurrentDrawTrip((trip) => {
    return { ...trip, schools: [] };
  });
  console.log(school);
}
export function addPointToTrip(point: TripPointType) {
  setCurrentDrawTrip((trip: TripType) => {
    // TODO richard pourquoi cette condition ?
    const points = trip.tripPoints;
    if (!_.isEqual(points.at(-1), point)) {
      points.splice(currentTripIndex(), 0, point);
    }
    setCurrentTripIndex(points.length);
    return { ...trip, points };
  });
}

export function addSchoolToTrip(school: SchoolType) {
  setCurrentDrawTrip((trip) => {
    return { ...trip, schools: [school] };
  });
}
async function createOrUpdateTrip() {
  // eslint-disable-next-line solid/reactivity
  let updatedTrip: TripType = currentDrawTrip();
  if (currentDrawTrip().id == undefined) {
    updatedTrip = await TripService.create(currentDrawTrip());
    const selectedLineId = getSelectedLine()?.id as number;

    setLines((lines) =>
      lines.map((line) =>
        line.id != selectedLineId
          ? line
          : { ...line, trips: [...line.trips, updatedTrip] }
      )
    );
  } else {
    updatedTrip = await TripService.update(currentDrawTrip());

    setLines((prev) =>
      prev.map((line) => {
        return {
          ...line,
          trips: line.trips.map((trip) =>
            trip.id == updatedTrip.id ? updatedTrip : trip
          ),
        };
      })
    );
  }
  setselectedTrip(
    getLines()
      .map((line) => line.trips)
      .flat()
      .filter((trip) => trip.id == updatedTrip.id)[0]
  );

  QuantityUtils.add(updatedTrip);

  setDisplayTripMode((prev) =>
    prev == displayTripModeEnum.straight ? prev : displayTripModeEnum.straight
  );

  setCurrentStep(DrawTripStep.initial);
  quitModeDrawTrip();

  changeBoard("line-details");
}

async function nextStep() {
  enableSpinningWheel();
  switch (currentStep()) {
    case DrawTripStep.schoolSelection:
      if (currentDrawTrip().schools.length < 1) {
        break;
      }
      setCurrentStep(DrawTripStep.editTrip);
    case DrawTripStep.editTrip:
      if (currentDrawTrip().tripPoints.length < 2) {
        break;
      }
      if (!currentDrawTrip().waypoints) {
        const waypoints = WaypointEntity.createWaypointsFromTrip(
          currentDrawTrip()
        );
        setCurrentDrawTrip((trip) => {
          return { ...trip, waypoints: waypoints };
        });
      }
      if (displayTripMode() == displayTripModeEnum.straight) {
        await updatePolylineWithOsrm(currentDrawTrip());
      }

      await createOrUpdateTrip();

      setCurrentDrawTrip(TripEntity.defaultTrip());
      setCurrentTripIndex(0);
      setIsInUpdate(false);
      // setCurrentDrawTrip(TripEntity.defaultTrip());

      setCurrentStep(DrawTripStep.initial);
      updatePointColor();
  }
  disableSpinningWheel();
}

function prevStep() {
  switch (currentStep()) {
    case DrawTripStep.schoolSelection:
      setCurrentDrawTrip(TripEntity.defaultTrip());
      quitModeDrawTrip();

      setCurrentStep(DrawTripStep.initial);
      changeBoard("line");
      MapElementUtils.deselectAllPointsAndBusTrips();

      break;
    case DrawTripStep.editTrip:
      if (isInUpdate()) {
        QuantityUtils.add(currentDrawTrip());
        quitModeDrawTrip();
        // eslint-disable-next-line solid/reactivity
        setselectedTrip(() => {
          return getLines()
            .map((line) => line.trips)
            .flat()
            .filter((trip) => trip.id == currentDrawTrip().id)[0];
        });
        setIsInUpdate(false);

        setCurrentStep(DrawTripStep.initial);
        changeBoard("line-details");
      } else {
        setCurrentDrawTrip(TripEntity.defaultTrip());
        if (displayTripMode() == displayTripModeEnum.onRoad) {
          setCurrentDrawTrip((trip) => {
            return { ...trip, latLngs: [] };
          });
        }
        setCurrentStep(DrawTripStep.schoolSelection);
      }
      break;
  }
  setDisplayTripMode((prev) =>
    prev == displayTripModeEnum.straight ? prev : displayTripModeEnum.straight
  );
}

async function onClick() {
  if (displayTripMode() == displayTripModeEnum.straight) {
    if (currentDrawTrip().tripPoints.length < 2) {
      return;
    }
    if (!currentDrawTrip().waypoints) {
      const waypoints = WaypointEntity.createWaypointsFromTrip(
        currentDrawTrip()
      );
      setCurrentDrawTrip((trip) => {
        return { ...trip, waypoints: waypoints };
      });
    }
    await updatePolylineWithOsrm(currentDrawTrip());

    setDisplayTripMode(displayTripModeEnum.onRoad);
  } else if (displayTripMode() == displayTripModeEnum.onRoad) {
    // TODO me semble étrange
    setCurrentDrawTrip((trip) => {
      return { ...trip, latLngs: [] };
    });

    setDisplayTripMode(displayTripModeEnum.straight);
  }
}

export function removePoint(point: StopType | SchoolType) {
  setCurrentDrawTrip((trip) => {
    return {
      ...trip,
      points: trip.tripPoints.filter(
        (p) => p.id != point.id && p.lat != point.lat && p.lon != point.lon
      ),
    };
  });
}

export function updateWaypoints(waypoints: WaypointType[]) {
  setCurrentDrawTrip((trip) => {
    return { ...trip, waypoints: waypoints };
  });
  if (displayTripMode() == displayTripModeEnum.onRoad) {
    updatePolylineWithOsrm(currentDrawTrip());
  }
}

export function updatePoints(points: TripPointType[]) {
  setCurrentDrawTrip((trip) => {
    return { ...trip, points: points };
  });
  setWaypointsFromPoints(points);
  updatePolylineWithOsrm(currentDrawTrip());
}

export async function updatePolylineWithOsrm(trip: TripType) {
  enableSpinningWheel();
  const { latlngs, projectedLatlngs, metrics } =
    await OsrmService.getRoadPolyline(trip);

  setCurrentDrawTrip((trip) => {
    return { ...trip, latLngs: latlngs };
  });
  setCurrentDrawTrip((trip) => {
    return { ...trip, metrics: metrics };
  });
  setWaypoints(projectedLatlngs);
  disableSpinningWheel();
}

// TODO MAYBE_ERROR
function setWaypoints(projectedLatlngs: L.LatLng[]) {
  if (!currentDrawTrip().waypoints) {
    return;
  }
  let waypoints = currentDrawTrip().waypoints as WaypointType[];
  waypoints = waypoints.map((waypoint, i) => {
    return {
      ...waypoint,
      onRoadLat: projectedLatlngs[i].lat,
      onRoadLon: projectedLatlngs[i].lng,
    };
  });

  setCurrentDrawTrip((trip) => {
    return { ...trip, waypoints: waypoints };
  });
}

function setWaypointsFromPoints(points: TripPointType[]) {
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
  setCurrentDrawTrip((trip) => {
    return { ...trip, waypoints: waypoints };
  });
}
