import L from "leaflet";
import { For, createEffect, createSignal } from "solid-js";
import { useStateGui } from "../../../../../StateGui";
import { StopType } from "../../../../../_entities/stop.entity";
import { StopService } from "../../../../../_services/stop.service";
import {
  AddLineStep,
  addLineCurrentStep,
  addLineSelectedSchool,
  stopSelected,
} from "../../../board/component/organism/AddLineBoardContent";
import {
  DrawRaceStep,
  currentRace,
  currentStep,
} from "../../../board/component/organism/DrawRaceBoard";
import { onBoard } from "../../../board/component/template/ContextManager";
import { PointInterface } from "../atom/Point";
import { StopPoint } from "../molecule/StopPoint";
import { getSelectedLine } from "./BusLines";
import { getSchools } from "./SchoolPoints";

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
  let schools = getSchools();
  let stops = getStops();

  switch (onBoard()) {
    case "line-add":
      schools = addLineSelectedSchool();
      stops = stopSelected().map((associated) => {
        return associated.associated;
      });
      if (addLineCurrentStep() == AddLineStep.stopSelection) {
        const associatedIdSelected = schools
          .map((school) => school.associated.map((value) => value.id))
          .flat();

        return stops.filter((stop) => associatedIdSelected.includes(stop.id));
      }
      break;
    case "race-draw":
      schools = currentRace().schools;

      stops = getStops().filter((stop) =>
        getSelectedLine()
          ? getSelectedLine()
              ?.stops.map((stop) => stop.id)
              .includes(stop.id)
          : true
      );

      if (currentStep() === DrawRaceStep.schoolSelection) {
        return [];
      }

      if (currentStep() === DrawRaceStep.initial) {
        return stops;
      }
      break;
  }

  return stops.filter((stop) =>
    stop.associated.some(
      (school) => schools.find((e) => e.id === school.id)
      // TODO don't display stop with no remaining quantity in new Race Creation
      // TODO creation a display error if the stop is in the updating Race
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
