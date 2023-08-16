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

  // TODO Utilisé pour les test et les story, possibilité de s'en passer ? Mocker ?
  items?: StopType[];
}

export const [getLeafletStops, setLeafletStops] = createSignal<StopType[]>([]);

// TODO to delete and all reference
export const [ramassages, setRamassages] = createSignal<PointInterface[]>([]);

export function StopPoints(props: StopPointsProps) {
  onMount(async () => {
    let leafletStops: StopType[];
    if (!props.items) {
      const stops: StopType[] = await StopService.getAll();
      leafletStops = buildLeafletStops(stops);
    } else {
      leafletStops = props.items;
    }
    setLeafletStops(leafletStops);
  });

  const quantities = () => {
    return getLeafletStops().map((stop) => {
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
  const etablissements = getLineUnderConstruction().busLine.schools;
  const isValidate = getLineUnderConstruction().confirmSelection;

  let stops = getLeafletStops();

  if (isInAddLineMode() && etablissements) {
    stops = stops.filter((stop) =>
      stop.associated.some((school) =>
        etablissements.find((e) => e.id === school.id && isValidate)
      )
    );
  }

  return stops;
}

function buildLeafletStops(stops: StopType[]): StopType[] {
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
