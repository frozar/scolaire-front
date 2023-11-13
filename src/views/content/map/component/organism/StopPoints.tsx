import L from "leaflet";
import { For, createEffect, createSignal } from "solid-js";
import { AssociatedSchoolType } from "../../../../../_entities/_utils.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { FilterUtils } from "../../../../../utils/filter.utils";
import { StopUtils } from "../../../../../utils/stop.utils";
import { TripUtils } from "../../../../../utils/trip.utils";
import {
  AddLineStep,
  addLineCheckableStop,
  addLineCurrentStep,
} from "../../../board/component/organism/AddLineBoardContent";
import {
  DrawTripStep,
  currentDrawTrip,
  currentStep,
} from "../../../board/component/organism/DrawTripBoard";
import { onBoard } from "../../../board/component/template/ContextManager";
import { updateStopDetailsItem } from "../../../stops/component/organism/StopDetails";
import { PointInterface } from "../atom/Point";
import { StopPoint } from "../molecule/StopPoint";
import { getSelectedLine } from "./BusLines";
import { filterEmptyStops } from "./Filters";
import { getSchools } from "./SchoolPoints";

// const [, { nextLeafletPointId }] = useStateGui();

export interface StopPointsProps {
  leafletMap: L.Map;
  stops: StopType[];
}

export const [getStops, setStops] = createSignal<StopType[]>([]);

export function appendToStop(gradeItem: AssociatedSchoolType, stopId: number) {
  setStops((prev) => {
    if (prev != undefined) {
      const stops = [...prev];
      const indexOf = stops.findIndex((prev) => prev.id == stopId);
      stops[indexOf].associated.push(gradeItem);
      return stops;
    }
    return prev;
  });
  updateStopDetailsItem(stopId);
}

export function removeFromStop(gradeStudentToGradeID: number, stopId: number) {
  setStops((prev) => {
    if (prev != undefined) {
      const stops = [...prev];
      const indexOfStop = stops.findIndex((prev) => prev.id == stopId);

      stops[indexOfStop].associated = stops[indexOfStop].associated.filter(
        (prev) => prev.idClassToSchool != gradeStudentToGradeID
      );
      return stops;
    }
    return prev;
  });
  updateStopDetailsItem(stopId);
}
// TODO lucas à placer dans Stop component
export function updateFromStop(
  gradeStudentToGrade: AssociatedSchoolType,
  stopId: number
) {
  setStops((prev) => {
    if (prev != undefined) {
      const stops = [...prev];
      const indexOfStop = stops.findIndex((prev) => prev.id == stopId);
      const indexOfClass = stops[indexOfStop].associated.findIndex(
        (prev) => prev.schoolId == gradeStudentToGrade.schoolId
      );
      stops[indexOfStop].associated[indexOfClass] = gradeStudentToGrade;
      return stops;
    }
    return prev;
  });
  updateStopDetailsItem(stopId);
}

// TODO to delete and all reference
export const [ramassages, setRamassages] = createSignal<PointInterface[]>([]);

export function StopPoints(props: StopPointsProps) {
  // eslint-disable-next-line solid/reactivity
  createEffect(() => setStops(props.stops));

  const quantities = () => {
    return getStops().map((stop) => {
      return stop.associated.reduce((acc, stop) => acc + stop.quantity, 0);
    }) as number[];
  };

  const minQuantity = () => {
    const minCandidat = Math.min(...quantities());
    return Number.isFinite(minCandidat) ? minCandidat : 0;
  };

  const maxQuantity = () => {
    const maxCandidat = Math.max(...quantities());
    return Number.isFinite(maxCandidat) ? maxCandidat : 0;
  };

  return (
    <For each={leafletStopsFilter()}>
      {(point) => {
        return (
          <StopPoint
            point={point}
            map={props.leafletMap}
            minQuantity={minQuantity()}
            maxQuantity={maxQuantity()}
          />
        );
      }}
    </For>
  );
}

//TODO Delete and replace with displayedStop signal
export function leafletStopsFilter(): StopType[] {
  let schools = getSchools();
  let stops = getStops();
  switch (onBoard()) {
    case "trip":
      return stops.filter((stop) =>
        getSelectedLine()
          ?.stops.map((selectedLineStop) => selectedLineStop.id)
          .includes(stop.id)
      );
    case "line-add":
      switch (addLineCurrentStep()) {
        case AddLineStep.schoolSelection:
          return [];
        case AddLineStep.gradeSelection:
          return [];
        case AddLineStep.stopSelection:
          const selectedLineStop = addLineCheckableStop().map(
            (associated) => associated.item
          ) as StopType[];

          const associatedIdSelected = selectedLineStop.map((stop) => stop.id);

          return stops.filter((stoptofilter) =>
            associatedIdSelected.includes(stoptofilter.id)
          );
      }

      break;
    case "trip-draw":
      schools = currentDrawTrip().schools;
      /* Liste des filtres:
        - 01 stops qui sont dans la ligne
        - 02 stops dont les grades sont  assignées à la trip !
        - 03 trip modification case => afficher aussi quand qté == 0 si dans la trip OU filtrer qty =0
      */

      // 01 - Filter stops that is in selectedLine
      console.log("before 01 =>", stops.length);

      stops = getStops().filter(
        (stop) =>
          getSelectedLine()
            ? getSelectedLine()
                ?.stops.map((stop) => stop.id)
                .includes(stop.id)
            : true // TODO: Verify if getSelectedLine() is always true
      );

      console.log("after 01 =>", stops.length);

      // // ! ?
      // stops = stops.filter((stop) =>
      //   stop.associated.some((associated) =>
      //     currentDrawTrip()
      //       ?.grades.map((grade) => grade.id)
      //       .includes(associated.gradeId)
      //   )
      // );

      // TODO: Filter stops containing grades previously selected for the trip
      // ! 02
      const gradeIds = currentDrawTrip().grades.map(
        (grade) => grade.id as number
      );
      const gradeNames = currentDrawTrip().grades.map((grade) => grade.name);
      console.log("gradeNames", gradeNames);

      stops = stops.filter((stop) =>
        stop.associated.some((assoc) => gradeIds.includes(assoc.gradeId))
      );
      console.log("after 02 =>", stops.length);

      function isInModifyingTripMode() {
        return currentDrawTrip().id ? true : false;
      }
      // 03 - Filter stops with qty > 0 and stop in modifying trip
      switch (isInModifyingTripMode()) {
        case true:
          console.log("modify mode");

          const trip = TripUtils.get(currentDrawTrip().id as number);
          stops = stops.filter(
            (stop) =>
              trip.tripPoints.some((tripPoint) => tripPoint.id == stop.id) ||
              StopUtils.getRemainingQuantity(stop.id) > 0
          );
          break;

        case false:
          console.log("create mode");

          // stops = FilterUtils.filterEmptyStops(stops);
          // ! Make that filter work
          console.log("stops =>", stops);
          stops = stops.filter((stop) => {
            console.log(
              StopUtils.getRemainingQuantityFromGradeIds(stop.id, gradeIds)
            );

            return (
              StopUtils.getRemainingQuantityFromGradeIds(stop.id, gradeIds) > 0
            );
          });
          break;
      }
      console.log("after 03 =>", stops.length);

      switch (currentStep()) {
        case DrawTripStep.schoolSelection:
          return [];
        case DrawTripStep.editTrip:
        case DrawTripStep.initial:
          return stops;
      }

    case "schools":
      return [];
    case "line":
      if (filterEmptyStops()) {
        stops = FilterUtils.filterEmptyStops(stops);
      }
      return stops;

    default:
      return stops;
  }

  return stops.filter((stop) =>
    stop.associated.some(
      (GradeToSchool) => schools.find((e) => e.id === GradeToSchool.schoolId)
      // TODO don't display stop with no remaining quantity in new Trip Creation
      // TODO creation a display error if the stop is in the updating Trip
      // && QuantityUtils.remaining(school) > 0
    )
  );
}

//TODO To delete ?
// function buildStops(stops: StopType[]): StopType[] {
//   return stops.map((stop) => {
//     const [selected, setSelected] = createSignal(false);
//     return {
//       ...stop,
//       setSelected,
//       selected,
//       leafletId: nextLeafletPointId(),
//     };
//   });
// }
