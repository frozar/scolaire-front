import { LineType } from "../../../../../_entities/line.entity";
import TrashIcon from "../../../../../icons/TrashIcon";
import ButtonIcon from "../molecule/ButtonIcon";

export interface RemoveLineButtonProps {
  line: LineType;
}

export default function (props: RemoveLineButtonProps) {
  const onclick = () => {
    console.log(" delete line :", props);
    // deselectAllPoints();
    // if (props.line.id) {
    //   setRemoveConfirmation({
    //     displayed: true,
    //     course: props.line,
    //   });
    // }
  };

  return (
    <ButtonIcon
      icon={<TrashIcon />}
      onClick={onclick}
      class="graphicage-draw-update-button"
    />
  );
}
