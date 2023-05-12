import { openExportConfirmationBox } from "../signaux";
import { ControlMapMenuExport } from "./Logos";
import { CgExport } from "solid-icons/cg";

export default function () {
  return (
    <div class="menu-btn left-[140px] group">
      <span class="tooltip group-hover:scale-100">Exporter</span>
      <label
        class="custom-btn btn-circle hover:bg-[#062F3F] hover:text-[#0cc683]"
        onClick={openExportConfirmationBox}
      >
        <CgExport class="w-full h-2/3" />
      </label>
    </div>
  );
}
