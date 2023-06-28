import { FaSolidPlus } from "solid-icons/fa";
import { useStateAction } from "../../../../../StateAction";
import { displayAddLineMessage } from "../../../../../userInformation/utils";
import { deselectAllPoints } from "../../Point";
import { fetchBusLines } from "../../line/busLinesUtils";
import ButtonGraphicageRightMenu from "../molecule/ButtonGraphicageRightMenu";
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
      xOffset="left"
    />
  );
}
