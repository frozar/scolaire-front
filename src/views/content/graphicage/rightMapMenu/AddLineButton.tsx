import { useStateAction } from "../../../../StateAction";
import { displayAddLineMessage } from "../../../../userInformation/utils";
import { FaSolidPlus } from "solid-icons/fa";

import ButtonGraphicageRightMenu from "../../../../component/atom/ButtonGraphicageRightMenu";
import { fetchBusLines } from "../line/busLinesUtils";
import { deselectAllPoints } from "../Point";

const [, { setModeAddLine, isInAddLineMode, setModeRead }] = useStateAction();

export default function () {
  const handleClick = () => {
    if (isInAddLineMode()) {
      setModeRead();
      fetchBusLines();
    } else {
      deselectAllPoints();
      setModeAddLine();
      fetchBusLines();
      displayAddLineMessage();
    }
  };

  return (
    <ButtonGraphicageRightMenu
      onClick={handleClick}
      tooltip="Ajouter une ligne"
      isActive={isInAddLineMode()}
      icon={<FaSolidPlus class="w-full p-0 h-2/3" />}
    />
  );
}
