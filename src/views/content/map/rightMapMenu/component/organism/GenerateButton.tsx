import { FaSolidGears } from "solid-icons/fa";
import { mergeProps } from "solid-js";
import { openGeneratorDialogBox } from "../../../../../../signaux";
import {
  confirmAbortEditionNeedToBeCall,
  defineModalToOpen,
} from "../../../ConfirmStopAddTripBox";
import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

export interface GenerateButtonProps {
  handleClick?: () => void;
  xOffset: OffsetType;
}

export default function (props: GenerateButtonProps) {
  const handleClick = () => {
    defineModalToOpen(openGeneratorDialogBox);
    confirmAbortEditionNeedToBeCall();
  };

  const mergedProps = mergeProps({ handleClick }, props);

  return (
    <ButtonGraphicageRightMenu
      onClick={mergedProps.handleClick}
      tooltip="Générer des trajets"
      icon={<FaSolidGears class="h-10 w-10" />}
      xOffset={mergedProps.xOffset}
    />
  );
}
