import { For, Show, createSignal, onCleanup, onMount } from "solid-js";

import SelectedSchool from "../atom/SelectedSchool";

import BoardFooterActions from "../molecule/BoardFooterActions";

import "../../../../../css/timeline.css";

import { TripEntity, TripType } from "../../../../../_entities/trip.entity";
import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import { step } from "../../../../../_services/osrm.service";
import CurvedLine from "../../../../../icons/CurvedLine";
import SimpleTrip from "../../../../../icons/SimpleLine";
import { ContextUtils } from "../../../../../utils/contextManager.utils";
import { CurrentDrawTripUtils } from "../../../../../utils/currentDrawTrip.utils";
import { COLOR_GREEN_BASE } from "../../../map/constant";
import BoardTitle from "../atom/BoardTitle";
import { DrawHelperButton } from "../atom/DrawHelperButton";
import { AllotmentSelectionList } from "../molecule/AllotmentSelectionList";
import ButtonIcon from "../molecule/ButtonIcon";
import { AssociatedItem } from "../molecule/CheckableElementList";
import { LabeledColorPicker } from "../molecule/LabeledColorPicker";
import LabeledInputField from "../molecule/LabeledInputField";
import { PathSelection } from "../molecule/PathSelection";
import SchoolsEnumeration from "../molecule/SchoolsEnumeration";
import { AssignDaysAndDirectionToTrip } from "./AssignDaysAndDirectionToTrip";
import { CheckableGradeListBySchool } from "./CheckableGradeListBySchool";
import CollapsibleElement from "./CollapsibleElement";
import "./DrawTripBoard.css";
import Metrics from "./Metrics";
import { TripTimeline } from "./TripTimeline";
import { VehicleSelect } from "./VehicleSelect";
import { DisplayTripDaysAndDirection } from "./displayTripDaysAndDirection";

export enum DrawTripStep {
  initial,
  schoolSelection,
  gradeSelection,
  editTrip,
  buildReverse,
}

export const [currentStep, setCurrentStep] = createSignal<DrawTripStep>(
  DrawTripStep.initial
);

export const [drawTripCheckableGrade, setDrawTripCheckableGrade] = createSignal<
  AssociatedItem[]
>([]);

export enum displayTripModeEnum {
  straight = "straight",
  onRoad = "onRoad",
}

export const [displayTripMode, setDisplayTripMode] =
  createSignal<displayTripModeEnum>(displayTripModeEnum.straight);

// TODO review this, when use TripEntity.defaultTrip in certain case it broke the app
// * in grade.entity.ts when function build is called, CalendarEntity is called,
// ** the error is generated afet call of file CalendarEntity in grade.entity
// * reproduction:  uncomment the TripEntity.defaultTrip() just under to reproduct the error
export const [currentDrawTrip, setCurrentDrawTrip] = createSignal<TripType>(
  // TripEntity.defaultTrip()
  {
    schools: [],
    name: "My Default Name",
    color: COLOR_GREEN_BASE,
    tripPoints: [],
    waypoints: [],
    grades: [],
    latLngs: [],
    selected: false,
    metrics: {},
    startTime: undefined,
    days: [],
    tripDirectionId: 0,
    path: {
      color: COLOR_GREEN_BASE,
      name: "Nom par defaut",
      points: [],
      grades: [],
      schools: [],
    },
    busCategoriesId: -1,
    allotmentId: -1,
  }
);

export const [currentTripIndex, setCurrentTripIndex] = createSignal(0);
export const [isInUpdate, setIsInUpdate] = createSignal(false);
export const [stepsWeight, setStepsWeight] = createSignal<step[]>([]);

export function DrawTripBoard() {
  onMount(() => {
    if (!isInUpdate() && currentStep() != DrawTripStep.buildReverse)
      setCurrentDrawTrip(TripEntity.defaultTrip());
  });

  onCleanup(() => setIsInUpdate(false));

  return (
    <div class="add-line-information-board-content">
      <Show when={currentStep() == DrawTripStep.schoolSelection}>
        <SelectedSchool schoolSelected={currentDrawTrip()?.schools ?? []} />
      </Show>

      <Show when={currentStep() == DrawTripStep.gradeSelection}>
        <BoardTitle title={"Sélection des niveaux"} />

        <For each={currentDrawTrip()?.schools}>
          {(school_elem) => {
            return (
              <CheckableGradeListBySchool
                school={school_elem}
                displayQuantity={true}
                checkableGrade={drawTripCheckableGrade}
                setCheckableGrade={setDrawTripCheckableGrade}
              />
            );
          }}
        </For>

        <Show
          when={drawTripCheckableGrade().filter((item) => item.done).length > 0}
        >
          <AssignDaysAndDirectionToTrip />
          <PathSelection />
          <AllotmentSelectionList />
        </Show>
      </Show>

      <Show
        when={
          currentStep() == DrawTripStep.editTrip ||
          currentStep() == DrawTripStep.buildReverse
        }
      >
        <div class="bus-trip-information-board-content-schools">
          <SchoolsEnumeration
            schoolsName={
              currentDrawTrip()?.schools.map((school) => school.name) ?? []
            }
          />
          <Show when={(currentDrawTrip()?.tripPoints.length ?? 0) > 0}>
            <DrawHelperButton schools={currentDrawTrip()?.schools} />
          </Show>
        </div>
        <CollapsibleElement title="Métriques">
          <Metrics trip={currentDrawTrip()} />
        </CollapsibleElement>
        <DisplayTripDaysAndDirection trip={currentDrawTrip()} />
        <LabeledInputField
          label="Nom de la course"
          value={currentDrawTrip()?.name ?? ""}
          onInput={(e) =>
            setCurrentDrawTrip((trip) => {
              if (!trip) return trip;
              return { ...trip, name: e.target.value };
            })
          }
          name="line-name"
          placeholder="Entrer le nom de la course"
        />
        <VehicleSelect
          allotment_id={Number(currentDrawTrip().allotmentId)}
          direction_id={currentDrawTrip().tripDirectionId}
        />

        <div class="flex mt-4 justify-between">
          <LabeledColorPicker
            text="Couleur de la course"
            defaultColor={currentDrawTrip()?.color}
            onChange={(color) =>
              setCurrentDrawTrip((trip) => {
                if (!trip) return trip;
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
        <div class="bus-trip-information-board-content">
          <Show
            when={(currentDrawTrip()?.tripPoints.length ?? 0) > 0}
            fallback={
              <div class="flex w-4/5 text-xs justify-center">
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
          callback: ContextUtils.nextStep,
          label:
            currentStep() == DrawTripStep.editTrip ||
            currentStep() == DrawTripStep.buildReverse
              ? "Valider"
              : "Suivant",
        }}
        previousStep={{
          callback: ContextUtils.prevStep,
          label:
            currentStep() === DrawTripStep.schoolSelection
              ? "Annuler"
              : "Précédent",
        }}
      />
    </div>
  );
}

async function onClick() {
  if (displayTripMode() == displayTripModeEnum.straight) {
    if ((currentDrawTrip()?.tripPoints.length ?? 0) < 2) {
      return;
    }
    if (!currentDrawTrip()?.waypoints) {
      const waypoints = WaypointEntity.createWaypointsFromTrip(
        currentDrawTrip() as TripType
      );
      setCurrentDrawTrip((trip) => {
        if (!trip) return trip;
        return { ...trip, waypoints: waypoints };
      });
    }
    await CurrentDrawTripUtils.updatePolylineWithOsrm(
      currentDrawTrip() as TripType
    );

    setDisplayTripMode(displayTripModeEnum.onRoad);
  } else if (displayTripMode() == displayTripModeEnum.onRoad) {
    setCurrentDrawTrip((trip) => {
      if (!trip) return trip;
      return { ...trip, latLngs: [] };
    });

    setDisplayTripMode(displayTripModeEnum.straight);
  }
}
