import {
  For,
  Setter,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { BusStopType } from "../../../../_entities/busStops.entity";
import { SchoolType } from "../../../../_entities/school.entity";
import { StopType } from "../../../../_entities/stop.entity";
import { getWays } from "../../../../_stores/way.store";
import { CirclePlusIcon } from "../../../../icons/CirclePlusIcon";
import { setWayLineArrows } from "../../_component/molecule/WayLine";
import { setDisplayBusStops } from "../../_component/organisme/BusStopPoints";
import { setDisplayWays } from "../../_component/organisme/Ways";
import { setMapOnClick } from "../../_component/template/MapContainer";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { loadWays } from "../../paths/template/Paths";
import { BusStopCard } from "../molecule/BusStopCard";
import { BusStopsMenuInput } from "../molecule/BusStopsMenuInput";
import { BusStopsMenuMapButtons } from "../molecule/BusStopsMenuMapButtons";
import "./BusStopsMenu.css";

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
    setWayLineArrows(true);
  });

  onCleanup(() => {
    setWayLineArrows(false);
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

  async function toggleChoosingWay() {
    if (isChoosingWay()) return;
    await loadWays();
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
    <div>
      <div class="bus-stop-menu-header">
        <p>Arrêts de bus</p>
        <ButtonIcon icon={<CirclePlusIcon />} onClick={toggleEdit} />
      </div>
      <Show
        fallback={
          <div class="bus-stop-menu">
            <BusStopsMenuInput setter={setNewBusStop} />
            <BusStopsMenuMapButtons
              busStop={newBusStop()}
              choosingLocal={isChoosingLocal()}
              choosingWay={isChoosingWay()}
              toggleChoosingLocal={toggleChoosingLocal}
              toggleChoosingWay={toggleChoosingWay}
              setter={setNewBusStop}
              cancelFunction={cancel}
              submitFunction={submit}
            />
          </div>
        }
        when={!isAdding()}
      >
        <For each={currentBusStops()}>
          {(stopItem) => <BusStopCard busStop={stopItem} />}
        </For>
      </Show>
    </div>
  );
}
