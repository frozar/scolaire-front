import {
  For,
  Setter,
  Show,
  createEffect,
  createSignal,
  onMount,
} from "solid-js";
import { BusStopType } from "../../../../_entities/busStops.entity";
import { SchoolType } from "../../../../_entities/school.entity";
import { StopType } from "../../../../_entities/stop.entity";
import { getWays } from "../../../../_stores/way.store";
import Button from "../../../../component/atom/Button";
import { setDisplayBusStops } from "../../_component/organisme/BusStopPoints";
import { setDisplayWays } from "../../_component/organisme/Ways";
import { setMapOnClick } from "../../_component/template/MapContainer";
import CollapsibleElement from "../../line/atom/CollapsibleElement";
import { BusStopsMenuButtons } from "../molecule/BusStopsMenuButtons";
import { BusStopsMenuInput } from "../molecule/BusStopsMenuInput";
import { BusStopsMenuMapButtons } from "../molecule/BusStopsMenuMapButtons";

export const [selectedWayId, setSelectedWayId] = createSignal(0);

interface BusStopsMenuProps {
  item: SchoolType | StopType;
  schoolSetter?: Setter<SchoolType>;
  stopSetter?: Setter<StopType>;
  isSchool: boolean;
}

export function BusStopsMenu(props: BusStopsMenuProps) {
  const [currentBusStops, setCurrentBusStops] = createSignal<BusStopType[]>([]);
  const [isChoosingLocal, setIsChoosingLocal] = createSignal(false);
  const [isChoosingWay, setIsChoosingWay] = createSignal(false);
  const [isAdding, setIsAdding] = createSignal(false);
  const [newBusStop, setNewBusStop] = createSignal<BusStopType>(
    {} as BusStopType
  );

  onMount(() => {
    if (props.item.busStops) {
      setCurrentBusStops(props.item.busStops);
    }
  });

  createEffect((prev) => {
    const ids: number[] = [];
    const updatedWayId = selectedWayId();

    if (prev != updatedWayId) {
      setNewBusStop((prev) => {
        return { ...prev, way: updatedWayId };
      });
      ids[0] = updatedWayId;
      currentBusStops().forEach((busStop) => ids.push(busStop.way));
      setDisplayWays(getWays().filter((way) => ids.includes(way.id)));
      setIsChoosingWay(false);
    }
  }, selectedWayId());

  function toggleChoosingLocal() {
    if (isChoosingLocal()) return;
    setIsChoosingLocal(true);
    setMapOnClick(() => pickLocation);
    setDisplayBusStops([]);
  }

  function toggleChoosingWay() {
    if (isChoosingWay()) return;
    setIsChoosingWay(true);
    setDisplayWays(getWays());
  }

  function pickLocation(e: L.LeafletMouseEvent) {
    if (!isChoosingLocal()) return;
    setMapOnClick(undefined);
    setIsChoosingLocal(false);
    setNewBusStop((prev) => {
      return { ...prev, lat: e.latlng.lat, lon: e.latlng.lng };
    });
    setDisplayBusStops([newBusStop()]);
  }

  function toggleEdit() {
    if (isAdding()) setIsAdding(false);
    else setIsAdding(true);
  }

  function cancel() {
    setIsChoosingLocal(false);
    setMapOnClick(undefined);
    setNewBusStop({} as BusStopType);
    toggleEdit();
  }

  async function submit() {
    if (!newBusStop().name || !newBusStop().lat) return;

    if (props.isSchool) {
      setNewBusStop((prev) => {
        return { ...prev, schoolId: props.item.id };
      });
    } else {
      setNewBusStop((prev) => {
        return { ...prev, stopId: props.item.id };
      });
    }

    setCurrentBusStops((prev) => {
      return [...prev, newBusStop()];
    });

    if (props.schoolSetter) {
      // eslint-disable-next-line solid/reactivity
      props.schoolSetter((prev) => {
        return { ...prev, busStops: currentBusStops() };
      });
    }

    if (props.stopSetter) {
      // eslint-disable-next-line solid/reactivity
      props.stopSetter((prev) => {
        return { ...prev, busStops: currentBusStops() };
      });
    }

    toggleEdit();
  }

  return (
    <CollapsibleElement title="Arrêts de bus">
      <Show
        fallback={
          <div>
            <BusStopsMenuInput setter={setNewBusStop} />
            <BusStopsMenuMapButtons
              choosingLocal={isChoosingLocal()}
              choosingWay={isChoosingWay()}
              toggleChoosingLocal={toggleChoosingLocal}
              toggleChoosingWay={toggleChoosingWay}
            />
            <BusStopsMenuButtons
              cancelFunction={cancel}
              submitFunction={submit}
            />
          </div>
        }
        when={!isAdding()}
      >
        <For each={currentBusStops()}>
          {(stopItem) => <div>{stopItem.name}</div>}
        </For>
        <Button label="Ajouter" onClick={toggleEdit} />
      </Show>
    </CollapsibleElement>
  );
}
