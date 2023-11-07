import { Show, createSignal, onCleanup, onMount } from "solid-js";

import SelectedSchool from "../atom/SelectedSchool";

import BoardFooterActions from "../molecule/BoardFooterActions";

import "../../../../../css/timeline.css";

import { TripEntity, TripType } from "../../../../../_entities/trip.entity";
import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import { TripService } from "../../../../../_services/trip.service";
import CurvedLine from "../../../../../icons/CurvedLine";
import SimpleTrip from "../../../../../icons/SimpleLine";
import { updatePointColor } from "../../../../../leafletUtils";
import {
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import { CurrentDrawTripUtils } from "../../../../../utils/currentDrawTrip.utils";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
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
    } else {
      setCurrentDrawTrip(TripEntity.defaultTrip());
    }
  });
  onCleanup(() => {
    setIsInUpdate(false);
  });

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

export async function createOrUpdateTrip() {
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
        await CurrentDrawTripUtils.updatePolylineWithOsrm(currentDrawTrip());
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
    await CurrentDrawTripUtils.updatePolylineWithOsrm(currentDrawTrip());

    setDisplayTripMode(displayTripModeEnum.onRoad);
  } else if (displayTripMode() == displayTripModeEnum.onRoad) {
    // TODO me semble étrange
    setCurrentDrawTrip((trip) => {
      return { ...trip, latLngs: [] };
    });

    setDisplayTripMode(displayTripModeEnum.straight);
  }
}
