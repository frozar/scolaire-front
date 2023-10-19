import L from "leaflet";
import { For, createEffect, createSignal } from "solid-js";
import { AssociatedSchoolType } from "../../../../../_entities/_utils.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import {
  AddLineStep,
  addLineCurrentStep,
  addLineSelectedSchool,
  stopSelected,
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
import { getSchools } from "./SchoolPoints";

// const [, { nextLeafletPointId }] = useStateGui();

export interface StopPointsProps {
  leafletMap: L.Map;
  stops: StopType[];
}

export const [getStops, setStops] = createSignal<StopType[]>([]);

export function appendToStop(classItem: AssociatedSchoolType, stopId: number) {
  setStops((prev) => {
    if (prev != undefined) {
      const stops = [...prev];
      const indexOf = stops.findIndex((prev) => prev.id == stopId);
      stops[indexOf].associated.push(classItem);
      return stops;
    }
    return prev;
  });
  updateStopDetailsItem(stopId);
}

export function removeFromStop(classStudentToSchoolID: number, stopId: number) {
  setStops((prev) => {
    if (prev != undefined) {
      const stops = [...prev];
      const indexOfStop = stops.findIndex((prev) => prev.id == stopId);

      stops[indexOfStop].associated = stops[indexOfStop].associated.filter(
        (prev) => prev.idClassToSchool != classStudentToSchoolID
      );
      return stops;
    }
    return prev;
  });
  updateStopDetailsItem(stopId);
}
// TODO lucas à placer dans Stop component
export function updateFromStop(
  classStudentToSchool: AssociatedSchoolType,
  stopId: number
) {
  setStops((prev) => {
    if (prev != undefined) {
      const stops = [...prev];
      const indexOfStop = stops.findIndex((prev) => prev.id == stopId);
      const indexOfClass = stops[indexOfStop].associated.findIndex(
        (prev) => prev.schoolId == classStudentToSchool.schoolId
      );
      stops[indexOfStop].associated[indexOfClass] = classStudentToSchool;
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
    case "course":
      return stops.filter((stop) =>
        getSelectedLine()
          ?.stops.map((stopOfSelected) => stopOfSelected.id)
          .includes(stop.id)
      );
    case "line-add":
      switch (addLineCurrentStep()) {
        case AddLineStep.schoolSelection:
          return [];
        case AddLineStep.stopSelection:
          schools = addLineSelectedSchool();
          stops = stopSelected().map((associated) => {
            return associated.stopItem;
          });
          const associatedIdSelected = schools
            .map((school) => school.classes.map((value) => value.schoolId))
            .flat();
          return getStops().filter((stoptofilter) =>
            associatedIdSelected.includes(stoptofilter.id)
          );
      }

      break;
    case "trip-draw":
      schools = currentDrawTrip().schools;

      stops = getStops().filter((stop) =>
        getSelectedLine()
          ? getSelectedLine()
              ?.stops.map((stop) => stop.id)
              .includes(stop.id)
          : true
      );
      switch (currentStep()) {
        case DrawTripStep.schoolSelection:
          return [];
        case DrawTripStep.editTrip:
        case DrawTripStep.initial:
          return stops;
      }

    case "schools":
      return [];
    default:
      return stops;
  }

  return stops.filter((stop) =>
    stop.associated.some(
      (ClassToSchool) => schools.find((e) => e.id === ClassToSchool.schoolId)
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
