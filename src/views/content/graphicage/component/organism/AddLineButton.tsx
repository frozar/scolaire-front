import { mergeProps } from "solid-js";

import { useStateAction } from "../../../../../StateAction";
import { displayAddLineMessage } from "../../../../../userInformation/utils";

import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

import { FaSolidPlus } from "solid-icons/fa";
import { drawModeStep, setCurrentStep } from "./DrawModeBoardContent";

import {
  isInDrawMod,
  toggleDrawMod,
} from "../../../../layout/component/organism/ContextManager";
import { deselectAllBusLines } from "./BusLines";
import { deselectAllPoints } from "./Points";

const [, { setModeAddLine, isInAddLineMode, setModeRead }] = useStateAction();

export interface AddLineButtonProps {
  handleClick?: () => void;
  isInAddLineMode?: () => boolean;
  xOffset: OffsetType;
}

export default function (props: AddLineButtonProps) {
  const handleClick = () => {
    if (isInDrawMod()) {
      //if (isInAddLineMode()) {
      // setModeRead();
      toggleDrawMod();
      setCurrentStep(drawModeStep.start);

      //TODO voir l'impact de la suppression
      // fetchBusLines();
    } else {
      deselectAllPoints();
      deselectAllBusLines();
      // setModeAddLine();
      toggleDrawMod();

      setCurrentStep(drawModeStep.schoolSelection);
      //TODO voir l'impact de la suppression
      // fetchBusLines();
      displayAddLineMessage();
    }
  };

  const mergedProps = mergeProps({ handleClick, isInAddLineMode }, props);

  return (
    <ButtonGraphicageRightMenu
      onClick={mergedProps.handleClick}
      tooltip="Ajouter une ligne"
      // isActive={mergedProps.isInAddLineMode()}
      isActive={isInDrawMod()}
      icon={<FaSolidPlus class="w-full p-0 h-2/3" />}
      xOffset={mergedProps.xOffset}
    />
  );
}
