import { mergeProps } from "solid-js";

import { useStateAction } from "../../../../../StateAction";
import { displayAddLineMessage } from "../../../../../userInformation/utils";
import { deselectAllPoints } from "../../Point";
import { fetchBusLines } from "../../line/busLinesUtils";
import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

import { FaSolidPlus } from "solid-icons/fa";

const [, { setModeAddLine, isInAddLineMode, setModeRead }] = useStateAction();

export interface AddLineButtonProps {
  handleClick?: () => void;
  isInAddLineMode?: () => boolean;
  xOffset: OffsetType;
}

export default function (props: AddLineButtonProps) {
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

  const mergedProps = mergeProps({ handleClick, isInAddLineMode }, props);

  return (
    <ButtonGraphicageRightMenu
      onClick={mergedProps.handleClick}
      tooltip="Ajouter une ligne"
      isActive={mergedProps.isInAddLineMode()}
      icon={<FaSolidPlus class="w-full p-0 h-2/3" />}
      xOffset={mergedProps.xOffset}
    />
  );
}
