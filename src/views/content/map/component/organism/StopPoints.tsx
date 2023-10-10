import L from "leaflet";
import { For, createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { useStateGui } from "../../../../../StateGui";
import { StopType } from "../../../../../_entities/stop.entity";
import { StopService } from "../../../../../_services/stop.service";
import {
  currentStep,
  drawModeStep,
} from "../../../board/component/organism/DrawModeBoardContent";
import { PointInterface } from "../atom/Point";
import { StopPoint } from "../molecule/StopPoint";
import { getSelectedLine } from "./BusLines";

const [, { getCourseUnderConstruction }] = useStateAction();
const [, { nextLeafletPointId }] = useStateGui();

export interface StopPointsProps {
  leafletMap: L.Map;
}

export const [getStops, setStops] = createSignal<StopType[]>([]);

// TODO to delete and all reference
export const [ramassages, setRamassages] = createSignal<PointInterface[]>([]);

export function StopPoints(props: StopPointsProps) {
  // eslint-disable-next-line solid/reactivity
  createEffect(async () => await updateStop());

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

async function updateStop() {
  const stops: StopType[] = buildStops(await StopService.getAll());
  setStops(stops);
}

//TODO Delete and replace with displayedStop signal
export function leafletStopsFilter(): StopType[] {
  const schools = getCourseUnderConstruction().course.schools;

  const stops = getStops().filter((stop) =>
    getSelectedLine()
      ? getSelectedLine()
          ?.stops.map((stop) => stop.id)
          .includes(stop.id)
      : true
  );
  if (currentStep() === drawModeStep.start) {
    return stops;
  }
  if (currentStep() === drawModeStep.schoolSelection) {
    return [];
  }
  return stops.filter((stop) =>
    stop.associated.some(
      (school) => schools.find((e) => e.id === school.id)
      // TODO don't display stop with no remaining quantity in new Course Creation
      // TODO creation a display error if the stop is in the updating Course
      // && QuantityUtils.remaining(school) > 0
    )
  );
}

function buildStops(stops: StopType[]): StopType[] {
  return stops.map((stop) => {
    const [selected, setSelected] = createSignal(false);
    return {
      ...stop,
      setSelected,
      selected,
      leafletId: nextLeafletPointId(),
    };
  });
}
