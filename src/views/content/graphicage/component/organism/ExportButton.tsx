import { CgExport } from "solid-icons/cg";

import { openExportConfirmationBox } from "../../../../../signaux";
import {
  confirmAbortEditionNeedToBeCall,
  defineModalToOpen,
} from "../../ConfirmStopAddLineBox";

import ButtonGraphicageRightMenu from "../molecule/ButtonGraphicageRightMenu";

export default function () {
  const handleClick = () => {
    defineModalToOpen(openExportConfirmationBox);
    confirmAbortEditionNeedToBeCall();
  };

  return (
    <ButtonGraphicageRightMenu
      onClick={handleClick}
      icon={<CgExport class="h-10 w-10 pb-[5px]" />}
      tooltip="Exporter"
      xOffset="left"
    />
  );
}
