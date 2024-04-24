import { CircleCheckIcon } from "../../../../icons/CircleCheckIcon";
import { CircleXMarkIcon } from "../../../../icons/CircleXMarkIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./BusStopsMenuButtons.css";

interface BusStopsMenuButtons {
  cancelFunction: () => void;
  submitFunction: () => void;
}

export function BusStopsMenuButtons(props: BusStopsMenuButtons) {
  return (
    <div class="bus-stop-menu-map-buttons">
      <ButtonIcon icon={<CircleXMarkIcon />} onClick={props.cancelFunction} />
      <ButtonIcon icon={<CircleCheckIcon />} onClick={props.submitFunction} />
    </div>
  );
}
