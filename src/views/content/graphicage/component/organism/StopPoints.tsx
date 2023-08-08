import L from "leaflet";
import { Accessor, For, Setter, createSignal, onMount } from "solid-js";
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
  items?: LeafletStopType[];
}

export const [getLeafletStops, setLeafletStops] = createSignal<
  LeafletStopType[]
>([]);

// TODO to delete and all reference
export const [ramassages, setRamassages] = createSignal<PointInterface[]>([]);

export function StopPoints(props: StopPointsProps) {
  onMount(async () => {
    let leafletStops: LeafletStopType[];
    if (!props.items) {
      const stops: StopType[] = await StopService.getAll();
      //TODO temporary log
      console.log(stops);
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

export type LeafletStopType = {
  leafletId: number;
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
} & StopType;

// TODO to improve
export function leafletStopsFilter(): LeafletStopType[] {
  const etablissement = getLineUnderConstruction().etablissementSelected;
  const isValidate = getLineUnderConstruction().confirmSelection;

  let stops = getLeafletStops();

  if (isInAddLineMode() && etablissement) {
    stops = stops.filter((stop) =>
      stop.associated.some((school) =>
        etablissement.find((e) => e.id === school.id && isValidate)
      )
    );
  }

  return stops;
}

function buildLeafletStops(stops: StopType[]): LeafletStopType[] {
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
