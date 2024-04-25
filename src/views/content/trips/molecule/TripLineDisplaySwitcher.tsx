import { Match, Switch } from "solid-js";
import CurvedLine from "../../../../icons/CurvedLine";
import SimpleLine from "../../../../icons/SimpleLine";
import {
  isOnRoadDisplay,
  setIsOnRoadDisplay,
} from "../../_component/organisme/Trips";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";

export function TripLineDisplaySwitcher() {
  return (
    <Switch>
      <Match when={!isOnRoadDisplay()}>
        <ButtonIcon
          icon={<SimpleLine />}
          onClick={() => setIsOnRoadDisplay(true)}
          class="line-to-road-btn-icon"
        />
      </Match>
      <Match when={isOnRoadDisplay()}>
        <ButtonIcon
          icon={<CurvedLine />}
          onClick={() => setIsOnRoadDisplay(false)}
          class="line-to-road-btn-icon"
        />
      </Match>
    </Switch>
  );
}
