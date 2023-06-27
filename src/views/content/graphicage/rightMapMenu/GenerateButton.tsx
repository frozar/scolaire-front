import { openGeneratorDialogBox } from "../../../../signaux";
import { FiArrowUpCircle } from "solid-icons/fi";
import {
  confirmAbortEditionNeedToBeCall,
  defineModalToOpen,
} from "../ConfirmStopAddLineBox";
import ButtonGraphicageRightMenu from "./atom/ButtonGraphicageRightMenu";

export default function () {
  const handleClick = () => {
    defineModalToOpen(openGeneratorDialogBox);
    confirmAbortEditionNeedToBeCall();
  };
  return (
    <ButtonGraphicageRightMenu
      onClick={handleClick}
      tooltip="Générer des trajets"
      icon={<FiArrowUpCircle class="h-10 w-10" />}
    />
  );
}
