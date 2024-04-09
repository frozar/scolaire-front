import {
  For,
  Setter,
  Show,
  createEffect,
  createSignal,
  onMount,
} from "solid-js";
import {
  BusStopDirectionEnum,
  BusStopType,
} from "../../../../_entities/busStops.entity";
import { SchoolType } from "../../../../_entities/school.entity";
import { BusStopService } from "../../../../_services/busStop.service";
import { getBusStops } from "../../../../_stores/busStop.store";
import { getWays } from "../../../../_stores/way.store";
import Button from "../../../../component/atom/Button";
import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
import {
  addNewGlobalSuccessInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { setDisplayBusStops } from "../../_component/organisme/BusStopPoints";
import { setDisplayWays } from "../../_component/organisme/Ways";
import { setMapOnClick } from "../../_component/template/MapContainer";
import LabeledInputField from "../../board/component/molecule/LabeledInputField";
import CollapsibleElement from "../../line/atom/CollapsibleElement";
import "./BusStopsMenu.css";

export const [selectedWayId, setSelectedWayId] = createSignal(0);

interface BusStopsMenuProps {
  school: SchoolType;
  schoolSetter: Setter<SchoolType>;
}

export function BusStopsMenu(props: BusStopsMenuProps) {
  const [schoolBusStops, setSchoolBusStops] = createSignal<BusStopType[]>([]);
  const [isChoosingLocal, setIsChoosingLocal] = createSignal(false);
  const [isChoosingWay, setIsChoosingWay] = createSignal(false);
  const [isAdding, setIsAdding] = createSignal(false);
  const [newBusStop, setNewBusStop] = createSignal<BusStopType>(
    {} as BusStopType
  );

  onMount(() => {
    const busStops = getBusStops().filter((item) => {
      if (props.school.busStops.includes(item.id as number)) return item;
    });
    setSchoolBusStops(busStops);
  });

  createEffect((prev) => {
    const ids: number[] = [];
    const updatedWayId = selectedWayId();

    if (prev != updatedWayId) {
      setNewBusStop((prev) => {
        return { ...prev, way: updatedWayId };
      });
      ids[0] = updatedWayId;
      schoolBusStops().forEach((item) => ids.push(item.way));
      setDisplayWays(getWays().filter((item) => ids.includes(item.id)));
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

  function onInputName(value: string) {
    setNewBusStop((prev) => {
      return { ...prev, name: value };
    });
  }

  function onChangeDirection(value: string) {
    let dir = BusStopDirectionEnum.scan;
    if (value == "antiscan") dir = BusStopDirectionEnum.antiscan;
    setNewBusStop((prev) => {
      return { ...prev, direction: dir };
    });
  }

  function cancel() {
    setIsChoosingLocal(false);
    setMapOnClick(undefined);
    setNewBusStop({} as BusStopType);
    toggleEdit();
  }

  async function submit() {
    if (!newBusStop().name || !newBusStop().lat) return;
    setNewBusStop((prev) => {
      return { ...prev, schoolId: props.school.id };
    });

    enableSpinningWheel();
    const createdBusStop = await BusStopService.create(newBusStop());
    setSchoolBusStops((prev) => {
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
            <LabeledInputField
              label="Nom"
              name="name"
              value={""}
              placeholder="Entrer un nom"
              onInput={(e) => onInputName(e.target.value)}
            />
            <LabeledInputSelect
              variant="borderless"
              defaultValue={0}
              label="Direction"
              onChange={(e) => onChangeDirection(e as string)}
              options={[
                { value: "scan", text: "scan" },
                { value: "antiscan", text: "antiscan" },
              ]}
            />
            <div class="bus-stop-menu-map-buttons">
              <Button
                onClick={toggleChoosingLocal}
                isDisabled={isChoosingLocal()}
                label="Modfier l'emplacement"
              />
              <Button
                onClick={toggleChoosingWay}
                isDisabled={isChoosingWay()}
                label="Choisir un chemin"
              />
            </div>
            <div class="bus-stop-menu-nav-buttons">
              <Button label="Annuler" variant="danger" onClick={cancel} />
              <Button label="Valider" onClick={submit} />
            </div>
          </div>
        }
        when={!isAdding()}
      >
        <For each={schoolBusStops()}>
          {(stopItem) => <div>{stopItem.name}</div>}
        </For>
        <Button label="Ajouter" onClick={toggleEdit} />
      </Show>
    </CollapsibleElement>
  );
}
