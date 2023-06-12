import { FaSolidMinus } from "solid-icons/fa";

import { useStateAction } from "../../../../StateAction";
import { displayRemoveLineMessage } from "../../../../userInformation/utils";
import ButtonGraphicageRightMenu from "../../../../component/atom/ButtonGraphicageRightMenu";
import { fetchBusLines } from "../line/busLinesUtils";

const [, { setModeRemoveLine, isInRemoveLineMode, setModeRead }] =
  useStateAction();

export default function () {
  const handleClick = () => {
    if (isInRemoveLineMode()) {
      setModeRead();
      fetchBusLines();
      return;
    }
    setModeRemoveLine();
    fetchBusLines();
    displayRemoveLineMessage();
  };

  return (
    <ButtonGraphicageRightMenu
      onClick={handleClick}
      tooltip="Supprimer une ligne"
      icon={<FaSolidMinus class="w-full h-2/3" />}
      isActive={isInRemoveLineMode()}
    />
  );
}
