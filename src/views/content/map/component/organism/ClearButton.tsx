import { mergeProps } from "solid-js";

import { openClearConfirmationBox } from "../../../../../signaux";

import {
  confirmAbortEditionNeedToBeCall,
  defineModalToOpen,
} from "../../ConfirmStopAddLineBox";

import { FaRegularTrashCan } from "solid-icons/fa";
import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../../rightMapMenu/component/molecule/ButtonGraphicageRightMenu";

export interface ClearButtonProps {
  handleClick?: () => void;
  xOffset: OffsetType;
}

export default function (props: ClearButtonProps) {
  const handleClick = () => {
    defineModalToOpen(openClearConfirmationBox);
    confirmAbortEditionNeedToBeCall();
  };

  const mergedProps = mergeProps({ handleClick }, props);

  return (
    <ButtonGraphicageRightMenu
      onClick={mergedProps.handleClick}
      tooltip="Vider la carte"
      icon={<FaRegularTrashCan class="w-full p-0 h-2/3" />}
      xOffset={mergedProps.xOffset}
    />
  );
}
