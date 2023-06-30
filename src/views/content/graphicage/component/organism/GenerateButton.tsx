import { FaSolidGears } from "solid-icons/fa";

import { mergeProps, splitProps } from "solid-js";

import { openGeneratorDialogBox } from "../../../../../signaux";
import {
  confirmAbortEditionNeedToBeCall,
  defineModalToOpen,
} from "../../ConfirmStopAddLineBox";
import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

export interface GenerateButtonProps {
  handleClick?: () => void;
  xOffset: OffsetType;
}

export default function (props: GenerateButtonProps) {
  // const xOffset = () => mergedProps.xOffset;

  const handleClick = () => {
    defineModalToOpen(openGeneratorDialogBox);
    confirmAbortEditionNeedToBeCall();
  };
  const mergedProps = mergeProps(
    { handleClick }, // , xOffset: "left" as OffsetType
    props
  );
  const [local] = splitProps(mergedProps, ["handleClick", "xOffset"]);

  return (
    <ButtonGraphicageRightMenu
      onClick={local.handleClick}
      tooltip="Générer des trajets"
      icon={<FaSolidGears class="h-10 w-10" />}
      xOffset={local.xOffset}
    />
  );
}
