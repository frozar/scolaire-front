import { useStateAction } from "../../../../StateAction";
import { displayAddLineMessage } from "../../../../userInformation/utils";
import { FaSolidPlus } from "solid-icons/fa";

import ButtonGraphicageRightMenu from "../../../../component/atom/ButtonGraphicageRightMenu";

const [, { setModeAddLine, isInAddLineMode, setModeRead }] = useStateAction();

export default function () {
  const handleClick = () => {
    if (isInAddLineMode()) {
      setModeRead();
    } else {
      setModeAddLine();
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
