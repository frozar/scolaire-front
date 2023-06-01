import { openExportConfirmationBox } from "../../../../signaux";
import { CgExport } from "solid-icons/cg";
import {
  defineModalToOpen,
  confirmAbortEditionNeedToBeCall,
} from "../ConfirmStopAddLineBox";

import ButtonGraphicageRightMenu from "../../../../component/atom/ButtonGraphicageRightMenu";

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
    />
  );
}
