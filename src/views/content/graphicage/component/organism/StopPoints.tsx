import L from "leaflet";
import { For, createSignal, onMount } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { useStateGui } from "../../../../../StateGui";
import { StopType } from "../../../../../_entities/stop.entity";
import { StopService } from "../../../../../_services/stop.service";
import { PointInterface } from "../atom/Point";
import { StopPoint } from "../molecule/StopPoint";

const [, { getLineUnderConstruction, isInAddLineMode }] = useStateAction();
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
  const isValidate = getLineUnderConstruction().confirmSelection;

  let stops = getStops();

  if (isInAddLineMode() && schools) {
    stops = stops.filter((stop) =>
      stop.associated.some((school) =>
        schools.find((e) => e.id === school.id && isValidate)
      )
    );
  }

  return stops;
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
