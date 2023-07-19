import { mergeProps } from "solid-js";

import { useStateAction } from "../../../../../StateAction";
import { displayRemoveLineMessage } from "../../../../../userInformation/utils";
import { fetchBusLines } from "../../line/busLinesUtils";
import { deselectAllPoints } from "../../pointUtils";

import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

import { FaSolidMinus } from "solid-icons/fa";

const [, { setModeRemoveLine, isInRemoveLineMode, setModeRead }] =
  useStateAction();

export interface RemoveLineButtonProps {
  handleClick?: () => void;
  isInRemoveLineMode?: () => boolean;
  xOffset: OffsetType;
}

export default function (props: RemoveLineButtonProps) {
  const handleClick = () => {
    deselectAllPoints();
    if (isInRemoveLineMode()) {
      setModeRead();
      fetchBusLines();
      return;
    }
    setModeRemoveLine();
    fetchBusLines();
    displayRemoveLineMessage();
  };

  const mergedProps = mergeProps({ handleClick, isInRemoveLineMode }, props);

  return (
    <ButtonGraphicageRightMenu
      onClick={mergedProps.handleClick}
      tooltip="Supprimer une ligne"
      icon={<FaSolidMinus class="w-full h-2/3" />}
      isActive={mergedProps.isInRemoveLineMode()}
      xOffset={mergedProps.xOffset}
    />
  );
}
