import { createSignal, onMount, Setter, Show } from "solid-js";
import {
  BusStopDirectionEnum,
  BusStopType,
} from "../../../../_entities/busStops.entity";
import { ArrowLeftRightIcon } from "../../../../icons/ArrowLeftRightIcon";
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
  choosingLocal: boolean;
  choosingWay: boolean;
  toggleChoosingLocal: () => void;
  toggleChoosingWay: () => void;
  setter: Setter<BusStopType>;
}

export function BusStopsMenuMapButtons(props: BusStopsMenuMapButtonsProps) {
  const [locationTooltip, setLocationTooltip] = createSignal(false);
  const [wayTooltip, setWayTooltip] = createSignal(false);
  const [directionTooltip, setDirectionTooltip] = createSignal(false);
  const [selectedDirection, setSelectedDirection] = createSignal(
    BusStopDirectionEnum.scan
  );

  onMount(() => {
    // eslint-disable-next-line solid/reactivity
    props.setter((prev) => {
      return { ...prev, direction: selectedDirection() };
    });
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

  return (
    <div class="bus-stop-menu-map-buttons">
      <div
        onMouseOver={() => setDirectionTooltip(true)}
        onMouseLeave={() => setDirectionTooltip(false)}
      >
        <ButtonIcon icon={<ArrowLeftRightIcon />} onClick={onChangeDirection} />
        <Show when={directionTooltip()}>
          <div class="bus-stop-menu-tootip">
            <Tooltip tooltip="Choisir le sens" />
          </div>
        </Show>
      </div>

      <div
        onMouseOver={() => setLocationTooltip(true)}
        onMouseLeave={() => setLocationTooltip(false)}
      >
        <ButtonIcon
          icon={<LocationDotIcon />}
          onClick={props.toggleChoosingLocal}
          disable={props.choosingLocal}
        />
        <Show when={locationTooltip()}>
          <div class="bus-stop-menu-tootip">
            <Tooltip tooltip="Choisir un emplacement" />
          </div>
        </Show>
      </div>

      <div
        onMouseOver={() => setWayTooltip(true)}
        onMouseLeave={() => setWayTooltip(false)}
      >
        <ButtonIcon
          icon={<RoadIcon />}
          disable={props.choosingWay}
          onClick={props.toggleChoosingWay}
        />
        <Show when={wayTooltip()}>
          <div class="bus-stop-menu-tootip">
            <Tooltip tooltip="Choisir un chemin" />
          </div>
        </Show>
      </div>
    </div>
  );
}
