import { useStateAction } from "../../../../StateAction";
import { displayAddLineMessage } from "../../../../userInformation/utils";
import { FaSolidPlus } from "solid-icons/fa";

import ButtonMap from "../../../../component/atom/ButtonMap";

const [, { setModeAddLine, isInAddLineMode, setModeRead }] = useStateAction();
const Icon = <FaSolidPlus class="w-full p-0 h-2/3" />;

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
    <ButtonMap
      click={handleClick}
      tooltip="Ajouter une ligne"
      _class={isInAddLineMode()}
      icon={Icon}
    />
  );
}
