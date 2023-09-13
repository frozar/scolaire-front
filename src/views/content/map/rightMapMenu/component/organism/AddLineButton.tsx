import { FaSolidPlus } from "solid-icons/fa";
import { mergeProps } from "solid-js";
import { useStateAction } from "../../../../../../StateAction";
import { displayAddLineMessage } from "../../../../../../userInformation/utils";
import {
  drawModeStep,
  setCurrentStep,
} from "../../../../board/component/organism/DrawModeBoardContent";
import {
  onBoard,
  toggleDrawMod,
} from "../../../../board/component/template/ContextManager";
import { deselectAllBusLines } from "../../../component/organism/BusLines";
import { deselectAllPoints } from "../../../component/organism/Points";
import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

const [, { isInAddLineMode }] = useStateAction();

export interface AddLineButtonProps {
  handleClick?: () => void;
  isInAddLineMode?: () => boolean;
  xOffset: OffsetType;
}

export default function (props: AddLineButtonProps) {
  const handleClick = () => {
    if (onBoard() == "line-draw") {
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
      isActive={onBoard() == "line-draw"}
      icon={<FaSolidPlus class="w-full p-0 h-2/3" />}
      xOffset={mergedProps.xOffset}
    />
  );
}
