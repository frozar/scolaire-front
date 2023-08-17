import L from "leaflet";
import { For, createSignal, onMount } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { useStateGui } from "../../../../../StateGui";
import { StopType } from "../../../../../_entities/stop.entity";
import { StopService } from "../../../../../_services/stop.service";
import { PointInterface } from "../atom/Point";
import { StopPoint } from "../molecule/StopPoint";
import { currentStep, drawModeStep } from "./AddLineInformationBoardContent";

const [, { getLineUnderConstruction }] = useStateAction();
const [, { nextLeafletPointId }] = useStateGui();

export interface StopPointsProps {
  leafletMap: L.Map;
}

export const [getStops, setStops] = createSignal<StopType[]>([]);

// TODO to delete and all reference
export const [ramassages, setRamassages] = createSignal<PointInterface[]>([]);

export function StopPoints(props: StopPointsProps) {
  onMount(async () => {
    const stops: StopType[] = buildStops(await StopService.getAll());
    setStops(stops);
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

// TODO to improve
export function leafletStopsFilter(): StopType[] {
  const schools = getLineUnderConstruction().busLine.schools;

  const stops = getStops();
  console.log(currentStep());
  if (currentStep() === drawModeStep.start) {
    return stops;
  }
  if (currentStep() === drawModeStep.schoolSelection) {
    return [];
  }
  return stops.filter((stop) =>
    stop.associated.some((school) => schools.find((e) => e.id === school.id))
  );
}

function buildStops(stops: StopType[]): StopType[] {
  // TODO ununderstood lint error
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
