import { useStateAction } from "../../../StateAction";
import { openExportConfirmationBox } from "../../../signaux";
import { CgExport } from "solid-icons/cg";
import {
  defineModalToOpen,
  ConfirmAbortEditionNeedToBeCall,
} from "../ConfirmStopAddLine";

export default function () {
  const handleClick = () => {
    defineModalToOpen(openExportConfirmationBox);
    ConfirmAbortEditionNeedToBeCall();
  };

  return (
    <div class="menu-btn left-[140px] group">
      <span class="tooltip group-hover:scale-100">Exporter</span>
      <label
        class="custom-btn btn-circle hover:bg-[#062F3F] hover:text-[#0cc683]"
        onClick={handleClick}
      >
        <CgExport class="h-10 w-10 pb-[5px]" />
      </label>
    </div>
  );
}
