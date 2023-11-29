import { For, Show, createSignal, onCleanup, onMount } from "solid-js";

import SelectedSchool from "../atom/SelectedSchool";

import BoardFooterActions from "../molecule/BoardFooterActions";

import "../../../../../css/timeline.css";

import { GradeEntity, GradeType } from "../../../../../_entities/grade.entity";
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
import { GradeUtils } from "../../../../../utils/grade.utils";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import {
  getLines,
  getSelectedLine,
  setLines,
} from "../../../map/component/organism/BusLines";
import { setselectedTrip } from "../../../map/component/organism/Trips";
import { COLOR_GREEN_BASE } from "../../../map/constant";
import { quitModeDrawTrip } from "../../../map/shortcut";
import TimeInput from "../../../schools/component/atom/TimeInput";
import BoardTitle from "../atom/BoardTitle";
import { DrawHelperButton } from "../atom/DrawHelperButton";
import ButtonIcon from "../molecule/ButtonIcon";
import { AssociatedItem } from "../molecule/CheckableElementList";
import LabeledInputField from "../molecule/LabeledInputField";
import SchoolsEnumeration from "../molecule/SchoolsEnumeration";
import { TripColorPicker } from "../molecule/TripColorPicker";
import { changeBoard } from "../template/ContextManager";
import { CheckableGradeListBySchool } from "./CheckableGradeListBySchool";
import CollapsibleElement from "./CollapsibleElement";
import "./DrawTripBoard.css";
import Metrics from "./Metrics";
import { TripTimeline } from "./TripTimeline";

export enum DrawTripStep {
  initial,
  schoolSelection,
  gradeSelection,
  editTrip,
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
    startTime: {
      hour: 7,
      minutes: 0,
    },
  }
);

export const [currentTripIndex, setCurrentTripIndex] = createSignal(0);

export const [isInUpdate, setIsInUpdate] = createSignal(false);

export function DrawTripBoard() {
  onMount(() => {
    setCurrentDrawTrip(TripEntity.defaultTrip());
    if (isInUpdate()) {
    } else {
      setCurrentDrawTrip(TripEntity.defaultTrip());
    }
  });
  onCleanup(() => {
    setIsInUpdate(false);
  });

  function onInputStart(value: string) {
    const formatedSchedule = GradeEntity.getHourFormatFromString(value);
    if (!formatedSchedule) return;
    setCurrentDrawTrip((prev) => {
      if (!prev) return prev;
      return { ...prev, startTime: formatedSchedule };
    });
  }

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
      </Show>

      <Show when={currentStep() == DrawTripStep.editTrip}>
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
        <div class="start-bus grid my-3">
          <label>Horraire de départ:</label>
          <TimeInput
            onInput={onInputStart}
            value={GradeEntity.getStringFromHourFormat(
              currentDrawTrip()?.startTime
            )}
          />
        </div>
        <div class="flex mt-4 justify-between">
          <TripColorPicker
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
      </Show>

      <Show when={currentStep() == DrawTripStep.editTrip}>
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
              trip={currentDrawTrip() as TripType}
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
  let updatedTrip: TripType = currentDrawTrip() as TripType;
  if (currentDrawTrip()?.id == undefined) {
    updatedTrip = await TripService.create(currentDrawTrip() as TripType);
    const selectedLineId = getSelectedLine()?.id as number;

    setLines((lines) =>
      lines.map((line) =>
        line.id != selectedLineId
          ? line
          : { ...line, trips: [...line.trips, updatedTrip] }
      )
    );
  } else {
    updatedTrip = await TripService.update(currentDrawTrip() as TripType);

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
  setselectedTrip(updatedTrip);

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
      if ((currentDrawTrip()?.schools.length ?? 0) < 1) {
        break;
      }
      const isValidable = (grade: GradeType) => {
        if (GradeUtils.getRemainingQuantity(grade.id as number) == 0)
          return false;

        const selectedGradeId = currentDrawTrip()
          ?.schools.map((school) =>
            school.grades.map((gradeMap) => gradeMap.id)
          )
          .flat();

        return selectedGradeId?.includes(grade.id);
      };

      setDrawTripCheckableGrade(
        getSelectedLine()?.grades.map((grade) => {
          return {
            item: grade,
            done: isValidable(grade),
          };
        }) as AssociatedItem[]
      );

      setCurrentStep(DrawTripStep.gradeSelection);
      break;

    case DrawTripStep.gradeSelection:
      const grades = drawTripCheckableGrade()
        .filter((grade) => grade.done)
        .map((grade) => grade.item) as GradeType[];

      setCurrentDrawTrip((trip) => {
        if (!trip) return trip;
        return { ...trip, grades };
      });

      setCurrentStep(DrawTripStep.editTrip);
      break;

    case DrawTripStep.editTrip:
      if ((currentDrawTrip()?.tripPoints.length ?? 0) < 2) {
        break;
      }
      if (!currentDrawTrip()?.waypoints) {
        const waypoints = WaypointEntity.createWaypointsFromTrip(
          currentDrawTrip() as TripType
        );
        setCurrentDrawTrip((trip) => {
          if (!trip) return trip;
          return { ...trip, waypoints };
        });
      }
      if (displayTripMode() == displayTripModeEnum.straight) {
        await CurrentDrawTripUtils.updatePolylineWithOsrm(
          currentDrawTrip() as TripType
        );
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

    case DrawTripStep.gradeSelection:
      setCurrentStep(DrawTripStep.schoolSelection);
      break;

    case DrawTripStep.editTrip:
      if (isInUpdate()) {
        quitModeDrawTrip();
        // eslint-disable-next-line solid/reactivity
        setselectedTrip(() => {
          return getLines()
            .map((line) => line.trips)
            .flat()
            .filter((trip) => trip.id == currentDrawTrip()?.id)[0];
        });
        setIsInUpdate(false);

        setCurrentStep(DrawTripStep.initial);
        changeBoard("line-details");
      } else {
        if (displayTripMode() == displayTripModeEnum.onRoad) {
          setCurrentDrawTrip((trip) => {
            if (!trip) return trip;
            return { ...trip, latLngs: [] };
          });
        }
        setCurrentStep(DrawTripStep.gradeSelection);
      }
      break;
  }
  setDisplayTripMode((prev) =>
    prev == displayTripModeEnum.straight ? prev : displayTripModeEnum.straight
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
    // TODO me semble étrange
    setCurrentDrawTrip((trip) => {
      if (!trip) return trip;
      return { ...trip, latLngs: [] };
    });

    setDisplayTripMode(displayTripModeEnum.straight);
  }
}
