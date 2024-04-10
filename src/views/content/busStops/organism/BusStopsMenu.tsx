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
import { BusStopService } from "../../../../_services/busStop.service";
import { getBusStops } from "../../../../_stores/busStop.store";
import { getWays } from "../../../../_stores/way.store";
import Button from "../../../../component/atom/Button";
import {
  addNewGlobalSuccessInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
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
  itemSetter: Setter<SchoolType> | Setter<StopType>;
  isSchool: boolean;
  setAddBusStop?: Setter<BusStopType[]>;
  isAdding?: boolean;
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
      const busStops = getBusStops().filter((busStopItem) => {
        if (props.item.busStops.includes(busStopItem.id as number))
          return busStopItem;
      });
      setCurrentBusStops(busStops);
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

    if (props.isAdding && props.setAddBusStop) {
      // eslint-disable-next-line solid/reactivity
      props.setAddBusStop((prev) => {
        return [...prev, newBusStop()];
      });
      setCurrentBusStops((prev) => {
        return [...prev, newBusStop()];
      });
      toggleEdit();
      return;
    }

    enableSpinningWheel();
    const createdBusStop = await BusStopService.add(newBusStop());

    setCurrentBusStops((prev) => {
      return [...prev, createdBusStop];
    });
    disableSpinningWheel();
    addNewGlobalSuccessInformation(
      "L'arrêt de bus : " + createdBusStop.name + " a été créé"
    );
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
