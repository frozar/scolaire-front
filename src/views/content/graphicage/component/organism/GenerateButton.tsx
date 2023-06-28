import { FiArrowUpCircle } from "solid-icons/fi";

import { openGeneratorDialogBox } from "../../../../../signaux";
import {
  confirmAbortEditionNeedToBeCall,
  defineModalToOpen,
} from "../../ConfirmStopAddLineBox";

import ButtonGraphicageRightMenu from "../molecule/ButtonGraphicageRightMenu";

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
      xOffset="left"
    />
  );
}
