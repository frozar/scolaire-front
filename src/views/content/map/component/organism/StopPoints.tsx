import L from "leaflet";
import { For, createEffect, createSignal } from "solid-js";
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
import { stopDetailsItem } from "../../../stops/component/organism/StopDetails";
import { PointInterface } from "../atom/Point";
import { StopPoint } from "../molecule/StopPoint";
import { getSelectedLine } from "./BusLines";
import { filterEmptyStops } from "./Filters";

// const [, { nextLeafletPointId }] = useStateGui();

export interface StopPointsProps {
  leafletMap: L.Map;
  stops: StopType[];
}

export const [getStops, setStops] = createSignal<StopType[]>([]);

// TODO to delete and all reference
export const [ramassages, setRamassages] = createSignal<PointInterface[]>([]);

export function StopPoints(props: StopPointsProps) {
  // eslint-disable-next-line solid/reactivity
  createEffect(() => setStops(props.stops));

  createEffect(() => {
    console.log("getStops()", getStops());
  });

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

function filterBySelectedLine(stops: StopType[]) {
  return stops.filter((stop) =>
    getSelectedLine()
      ?.stops.map((selectedLineStop) => selectedLineStop.id)
      .includes(stop.id)
  );
}

function filterByGradesOfTrip(stops: StopType[], gradeIds: number[]) {
  return stops.filter((stop) =>
    stop.associated.some((assoc) => gradeIds.includes(assoc.gradeId))
  );
}

function filterByQuantity(stops: StopType[], gradeIds: number[]) {
  function isInModifyingTripMode() {
    return currentDrawTrip().id ? true : false;
  }

  switch (isInModifyingTripMode()) {
    case true:
      const trip = TripUtils.get(currentDrawTrip().id as number);
      return stops.filter(
        (stop) =>
          trip.tripPoints.some((tripPoint) => tripPoint.id == stop.id) ||
          StopUtils.getRemainingQuantity(stop.id) > 0
      );

    case false:
      return stops.filter((stop) => {
        return (
          StopUtils.getRemainingQuantityFromGradeIds(stop.id, gradeIds) > 0
        );
      });
  }
}

//TODO Delete and replace with displayedStop signal
export function leafletStopsFilter(): StopType[] {
  let stops = getStops();
  switch (onBoard()) {
    case "schools":
      return [];

    case "stops":
      return stops;

    case "stop-details":
      return [stopDetailsItem() as StopType];

    case "line":
      if (filterEmptyStops()) {
        stops = FilterUtils.filterEmptyStops(stops);
      }
      return stops;

    case "trip":
      return filterBySelectedLine(stops);

    case "line-add":
      switch (addLineCurrentStep()) {
        case AddLineStep.schoolSelection:
        case AddLineStep.gradeSelection:
          return [];
        case AddLineStep.stopSelection:
          const selectedLineStop = addLineCheckableStop().map(
            (associated) => associated.item
          ) as StopType[];

          const associatedIdSelected = selectedLineStop.map((stop) => stop.id);

          return stops.filter((stopToFilter) =>
            associatedIdSelected.includes(stopToFilter.id)
          );
      }

    case "trip-draw":
      const gradeIds = currentDrawTrip().grades.map(
        (grade) => grade.id as number
      );

      stops = filterBySelectedLine(stops);
      stops = filterByGradesOfTrip(stops, gradeIds);
      stops = filterByQuantity(stops, gradeIds);

      switch (currentStep()) {
        case DrawTripStep.schoolSelection:
          return [];
        case DrawTripStep.editTrip:
        case DrawTripStep.initial:
          return stops;
      }
    default:
      return stops;
  }
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
