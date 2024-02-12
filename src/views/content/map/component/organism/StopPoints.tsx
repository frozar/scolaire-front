import L from "leaflet";
import { For, createEffect, createSignal } from "solid-js";
import { CalendarDayEnum } from "../../../../../_entities/calendar.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../../../_entities/trip-direction.entity";
import { NatureEnum } from "../../../../../type";
import { FilterUtils } from "../../../../../utils/filter.utils";
import { QuantityUtils } from "../../../../../utils/quantity.utils";
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
  drawTripCheckableGrade,
} from "../../../board/component/organism/DrawTripBoard";
import { onBoard } from "../../../board/component/template/ContextManager";
import {
  DrawPathStep,
  currentDrawPath,
  onDrawPathStep,
} from "../../../path/component/drawPath.utils";
import { stopDetailsItem } from "../../../stops/component/organism/StopDetails";
import { StopPoint } from "../molecule/StopPoint";
import { getLines, getSelectedLine } from "./BusLines";
import { filterEmptyStops } from "./Filters";

// const [, { nextLeafletPointId }] = useStateGui();

export interface StopPointsProps {
  leafletMap: L.Map;
  stops: StopType[];
}

export const [getStops, setStops] = createSignal<StopType[]>([]);

export function StopPoints(props: StopPointsProps) {
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

function filterByDaysQuantitiesAndDirection(
  stops: StopType[],
  gradeIds: number[],
  direction: TripDirectionEnum,
  days: CalendarDayEnum[]
) {
  function isInModifyingTripMode() {
    return currentDrawTrip().id ? true : false;
  }

  switch (isInModifyingTripMode()) {
    case true:
      const trip = TripUtils.get(currentDrawTrip().id as number);
      return stops.filter(
        (stop) =>
          trip.tripPoints.some((tripPoint) => tripPoint.id == stop.id) ||
          QuantityUtils.stopHasRemainingStudentToGet(stop.id)
      );

    case false:
      return stops.filter((stop) => {
        return (
          StopUtils.getRemainingQuantityFromMatrixOfGrades(
            stop.id,
            gradeIds,
            direction,
            days
          ) > 0
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

      // * If current drawTrip have path return only stop of the path
      if (currentDrawTrip().path?.id) {
        const pathPointStopIds = currentDrawTrip()
          .path?.points.filter((point) => point.nature == NatureEnum.stop)
          .map((stop) => stop.id);
        return getStops().filter((stop) => pathPointStopIds?.includes(stop.id));
      }

      stops = filterBySelectedLine(stops);
      stops = filterByGradesOfTrip(stops, gradeIds);
      stops = filterByDaysQuantitiesAndDirection(
        stops,
        gradeIds,
        TripDirectionEntity.FindDirectionById(currentDrawTrip().tripDirectionId)
          .type,
        currentDrawTrip().days
      );

      switch (currentStep()) {
        case DrawTripStep.schoolSelection:
          return [];
        case DrawTripStep.buildReverse:
          const stopsId = currentDrawTrip()
            .path?.points.filter((stop) => stop.nature == NatureEnum.stop)
            .map((stop) => stop.id);
          return getStops().filter((stop) => stopsId?.includes(stop.id));
        case DrawTripStep.editTrip:
        case DrawTripStep.initial:
          return stops;
      }
    case "path-draw":
      return pathEditionFilterByStep();
    default:
      return stops;
  }
}

function pathEditionFilterByStep(): StopType[] {
  const grades = drawTripCheckableGrade()
    .filter((grade) => grade.done)
    .map((item) => item.item.id);

  const linePoints =
    getLines().find(
      (line) =>
        line.paths.find((path) => path.id == currentDrawPath()?.id)?.id ==
        currentDrawPath()?.id
    )?.stops ?? [];

  if (onDrawPathStep() == DrawPathStep.editPath) {
    return linePoints.filter((stop) =>
      stop.associated.some((item) => grades.includes(item.gradeId))
    );
  } else return [];
}
