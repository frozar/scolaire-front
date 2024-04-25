import {
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  Setter,
  Show,
} from "solid-js";
import {
  BusStopDirectionEnum,
  BusStopType,
} from "../../../../_entities/busStops.entity";
import { ArrowLeftRightIcon } from "../../../../icons/ArrowLeftRightIcon";
import { CircleCheckIcon } from "../../../../icons/CircleCheckIcon";
import { CircleXMarkIcon } from "../../../../icons/CircleXMarkIcon";
import { LocationDotIcon } from "../../../../icons/LocationDotIcon";
import { RoadIcon } from "../../../../icons/RoadIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import {
  reversedArrows,
  setReversedArrows,
} from "../../map/component/atom/Line";
import Tooltip from "../../map/rightMapMenu/component/atom/Tooltip";
import "./BusStopsMenuButtons.css";

interface BusStopsMenuMapButtonsProps {
  busStop: BusStopType;
  choosingLocal: boolean;
  choosingWay: boolean;
  toggleChoosingLocal: () => void;
  toggleChoosingWay: () => void;
  setter: Setter<BusStopType>;
  cancelFunction: () => void;
  submitFunction: () => void;
}

export function BusStopsMenuMapButtons(props: BusStopsMenuMapButtonsProps) {
  const [locationTooltip, setLocationTooltip] = createSignal(false);
  const [locationColor, setLocationColor] = createSignal("green");
  const [wayTooltip, setWayTooltip] = createSignal(false);
  const [wayColor, setWayColor] = createSignal("green");
  const [directionTooltip, setDirectionTooltip] = createSignal(false);
  const [selectedDirection, setSelectedDirection] = createSignal(
    BusStopDirectionEnum.scan
  );
  const [canChangeLocation, setCanChangeLocation] = createSignal(false);
  const [canChangeWay, setCanChangeWay] = createSignal(false);
  const [canSubmit, setcanSubmit] = createSignal(false);

  onMount(() => {
    // eslint-disable-next-line solid/reactivity
    props.setter((prev) => {
      return { ...prev, direction: selectedDirection() };
    });
  });

  onCleanup(() => {
    setCanChangeLocation(false);
    setCanChangeWay(false);
    setLocationColor("yellow");
    setWayColor("yellow");
  });

  function onChangeDirection() {
    if (selectedDirection() == BusStopDirectionEnum.scan)
      setSelectedDirection(BusStopDirectionEnum.antiscan);
    else setSelectedDirection(BusStopDirectionEnum.scan);
    // eslint-disable-next-line solid/reactivity
    props.setter((prev) => {
      return { ...prev, direction: selectedDirection() };
    });
    if (reversedArrows()) setReversedArrows(false);
    else setReversedArrows(true);
  }

  createEffect(() => {
    if (!props.busStop.way || props.busStop.way == 0) {
      setWayColor("yellow");
      setCanChangeLocation(false);
    } else {
      setCanChangeLocation(true);
      setWayColor("green");
    }
    if (!props.busStop.lat && !props.busStop.lon) {
      setLocationColor("yellow");
      setCanChangeWay(false);
    } else {
      setLocationColor("green");
      setCanChangeWay(true);
    }

    if (!props.busStop.lat || !props.busStop.way || !props.busStop.name)
      setcanSubmit(false);
    else setcanSubmit(true);
  });

  return (
    <div class="bus-stop-menu-map-buttons">
      <div
        onMouseOver={() => setWayTooltip(true)}
        onMouseLeave={() => setWayTooltip(false)}
      >
        <ButtonIcon
          icon={<RoadIcon color={wayColor()} />}
          disable={props.choosingWay}
          onClick={props.toggleChoosingWay}
        />
        <Show when={wayTooltip()}>
          <div class="bus-stop-menu-tootip">
            <Tooltip tooltip="Choisir un chemin" />
          </div>
        </Show>
      </div>

      <div
        onMouseOver={() => setLocationTooltip(true)}
        onMouseLeave={() => setLocationTooltip(false)}
      >
        <ButtonIcon
          icon={<LocationDotIcon color={locationColor()} />}
          onClick={props.toggleChoosingLocal}
          disable={!canChangeLocation()}
        />
        <Show when={locationTooltip()}>
          <div class="bus-stop-menu-tootip">
            <Tooltip tooltip="Choisir un emplacement" />
          </div>
        </Show>
      </div>

      <div
        onMouseOver={() => setDirectionTooltip(true)}
        onMouseLeave={() => setDirectionTooltip(false)}
        class="bus-stop-menu-button-offset"
      >
        <ButtonIcon
          icon={<ArrowLeftRightIcon />}
          disable={!canChangeWay()}
          onClick={onChangeDirection}
        />
        <Show when={directionTooltip()}>
          <div class="bus-stop-menu-tootip">
            <Tooltip tooltip="Choisir le sens" />
          </div>
        </Show>
      </div>

      <ButtonIcon icon={<CircleXMarkIcon />} onClick={props.cancelFunction} />
      <ButtonIcon
        icon={<CircleCheckIcon />}
        disable={!canSubmit()}
        onClick={props.submitFunction}
      />
    </div>
  );
}
