import { FiArrowUpCircle } from "solid-icons/fi";

import { openGeneratorDialogBox } from "../../../../../signaux";
import {
  confirmAbortEditionNeedToBeCall,
  defineModalToOpen,
} from "../../ConfirmStopAddLineBox";

import { mergeProps } from "solid-js";
import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

export interface GenerateButtonProps {
  xOffset?: OffsetType;
}

export default function (props: GenerateButtonProps) {
  const mergedProps = mergeProps({ xOffset: "left" as OffsetType }, props);

  const xOffset = () => mergedProps.xOffset;

  const handleClick = () => {
    defineModalToOpen(openGeneratorDialogBox);
    confirmAbortEditionNeedToBeCall();
  };
  return (
    <ButtonGraphicageRightMenu
      onClick={handleClick}
      tooltip="Générer des trajets"
      icon={<FiArrowUpCircle class="h-10 w-10" />}
      xOffset={xOffset()}
    />
  );
}
