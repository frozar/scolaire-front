import { FaSolidMinus } from "solid-icons/fa";
import { mergeProps } from "solid-js";
import { useStateAction } from "../../../../../../StateAction";
import { displayRemoveLineMessage } from "../../../../../../userInformation/utils";
import { deselectAllPoints } from "../../../component/organism/Points";
import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

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
      //TODO voir l'impact de la suppression
      // fetchBusLines();
      return;
    }
    setModeRemoveLine();
    //TODO voir l'impact de la suppression
    // fetchBusLines();
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
