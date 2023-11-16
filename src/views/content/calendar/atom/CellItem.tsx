import { Match, Show, Switch } from "solid-js";
import { TripDirectionEnum } from "../../../../_entities/trip-direction.entity";
import { BusComingIcon } from "../../../../icons/BusComingIcon";
import { BusGoingIcon } from "../../../../icons/BusGoingIcon";
import { BusRoundTripIcon } from "../../../../icons/BusRoundTripIcon";
import "./CellItem.css";

interface CellItemProps {
  isWeekend: boolean;
  isActive: boolean;
  outPeriod?: boolean;
  isVacation?: boolean;
  isPublicHoliday?: boolean;
  onClick: () => void;
  coloredCell?: boolean;
  direction?: TripDirectionEnum;
}

export default function (props: CellItemProps) {
  const activeCell = () =>
    props.isActive &&
    !props.isVacation &&
    !props.outPeriod &&
    !props.isPublicHoliday;

  return (
    <div
      classList={{
        "weekend-cell": props.isWeekend,
        "active-cell": activeCell(),
        "outperiod-cell": props.outPeriod && props.coloredCell,
        "vacation-cell": props.isVacation && props.coloredCell,
        "public-holiday-cell": props.isPublicHoliday && props.coloredCell,
      }}
      class="cell-item"
      onClick={() => props.onClick()}
    >
      <div class="cell-icon">
        <Show when={activeCell()}>
          <Switch>
            <Match when={props.direction == TripDirectionEnum.coming}>
              <BusComingIcon />
            </Match>

            <Match when={props.direction == TripDirectionEnum.going}>
              <BusGoingIcon />
            </Match>

            <Match when={props.direction == TripDirectionEnum.roundTrip}>
              <BusRoundTripIcon />
            </Match>
          </Switch>
        </Show>
      </div>
    </div>
  );
}
