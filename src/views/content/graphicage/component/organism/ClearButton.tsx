import { FaRegularTrashCan } from "solid-icons/fa";

import { openClearConfirmationBox } from "../../../../../signaux";
import {
  confirmAbortEditionNeedToBeCall,
  defineModalToOpen,
} from "../../ConfirmStopAddLineBox";

import { mergeProps } from "solid-js";
import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

export interface ClearButtonProps {
  xOffset?: OffsetType;
}

export default function (props: ClearButtonProps) {
  const mergedProps = mergeProps({ xOffset: "left" as OffsetType }, props);

  const xOffset = () => mergedProps.xOffset;

  const handleClick = () => {
    defineModalToOpen(openClearConfirmationBox);
    confirmAbortEditionNeedToBeCall();
  };

  return (
    <ButtonGraphicageRightMenu
      onClick={handleClick}
      tooltip="Vider la carte"
      icon={<FaRegularTrashCan class="w-full p-0 h-2/3" />}
      xOffset={xOffset()}
    />
  );
}
