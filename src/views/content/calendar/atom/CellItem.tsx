import { Match, Show, Switch, mergeProps } from "solid-js";
import { TripDirectionEnum } from "../../../../_entities/trip-direction.entity";
import { BusComingIcon } from "../../../../icons/BusComingIcon";
import { BusGoingIcon } from "../../../../icons/BusGoingIcon";
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
  displayIcon?: boolean;
}

export default function (props: CellItemProps) {
  const mergedProps = mergeProps({ displayIcon: false }, props);
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
        <Show when={activeCell() && mergedProps.displayIcon}>
          <Switch>
            <Match when={props.direction == TripDirectionEnum.coming}>
              <BusComingIcon />
            </Match>

            <Match when={props.direction == TripDirectionEnum.going}>
              <BusGoingIcon />
            </Match>
          </Switch>
        </Show>
      </div>
    </div>
  );
}
