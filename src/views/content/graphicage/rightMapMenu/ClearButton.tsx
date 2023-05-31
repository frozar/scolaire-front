import { FaRegularTrashCan } from "solid-icons/fa";
import { openClearConfirmationBox } from "../../../../signaux";
import {
  confirmAbortEditionNeedToBeCall,
  defineModalToOpen,
} from "../ConfirmStopAddLineBox";
import ButtonMap from "../../../../component/atom/ButtonMap";

export default function () {
  const handleClick = () => {
    defineModalToOpen(openClearConfirmationBox);
    confirmAbortEditionNeedToBeCall();
  };

  return (
    <ButtonMap
      onClick={handleClick}
      tooltip="Vider la carte"
      icon={<FaRegularTrashCan class="w-full p-0 h-2/3" />}
    />
  );
}
