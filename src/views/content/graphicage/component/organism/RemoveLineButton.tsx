import { FaSolidMinus } from "solid-icons/fa";

import { useStateAction } from "../../../../../StateAction";
import { displayRemoveLineMessage } from "../../../../../userInformation/utils";
import { deselectAllPoints } from "../../Point";
import { fetchBusLines } from "../../line/busLinesUtils";

import { mergeProps } from "solid-js";
import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

const [, { setModeRemoveLine, isInRemoveLineMode, setModeRead }] =
  useStateAction();

export interface RemoveLineButtonProps {
  xOffset?: OffsetType;
}

export default function (props: RemoveLineButtonProps) {
  const mergedProps = mergeProps({ xOffset: "left" as OffsetType }, props);

  const xOffset = () => mergedProps.xOffset;

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

  return (
    <ButtonGraphicageRightMenu
      onClick={handleClick}
      tooltip="Supprimer une ligne"
      icon={<FaSolidMinus class="w-full h-2/3" />}
      isActive={isInRemoveLineMode()}
      xOffset={xOffset()}
    />
  );
}
