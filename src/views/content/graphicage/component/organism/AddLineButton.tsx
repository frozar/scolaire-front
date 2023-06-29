import { FaSolidPlus } from "solid-icons/fa";

import { useStateAction } from "../../../../../StateAction";
import { displayAddLineMessage } from "../../../../../userInformation/utils";
import { deselectAllPoints } from "../../Point";
import { fetchBusLines } from "../../line/busLinesUtils";

import { mergeProps } from "solid-js";
import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

const [, { setModeAddLine, isInAddLineMode, setModeRead }] = useStateAction();

export interface AddLineButtonProps {
  xOffset?: OffsetType;
}

export default function (props: AddLineButtonProps) {
  const mergedProps = mergeProps({ xOffset: "left" as OffsetType }, props);

  const xOffset = () => mergedProps.xOffset;

  const handleClick = () => {
    if (isInAddLineMode()) {
      setModeRead();
      fetchBusLines();
    } else {
      deselectAllPoints();
      setModeAddLine();
      fetchBusLines();
      displayAddLineMessage();
    }
  };

  return (
    <ButtonGraphicageRightMenu
      onClick={handleClick}
      tooltip="Ajouter une ligne"
      isActive={isInAddLineMode()}
      icon={<FaSolidPlus class="w-full p-0 h-2/3" />}
      xOffset={xOffset()}
    />
  );
}
