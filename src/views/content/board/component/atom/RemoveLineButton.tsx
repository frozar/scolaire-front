import { BusLineType } from "../../../../../_entities/bus-line.entity";
import TrashIcon from "../../../../../icons/TrashIcon";
import { setRemoveConfirmation } from "../../../../../signaux";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import ButtonIcon from "../molecule/ButtonIcon";

export interface RemoveLineButtonProps {
  busLine: BusLineType;
}

export default function (props: RemoveLineButtonProps) {
  const onclick = () => {
    deselectAllPoints();
    if (props.busLine.id) {
      setRemoveConfirmation({
        displayed: true,
        busLine: props.busLine,
      });
    }
  };

  return (
    <ButtonIcon
      icon={<TrashIcon />}
      onClick={onclick}
      class="graphicage-draw-update-button"
    />
  );
}