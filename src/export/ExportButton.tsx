import { openExportConfirmationBox } from "../signaux";
import { ControlMapMenuExport } from "./Logos";

export default function () {
  return (
    <>
      <button
        class="menu-btn"
        onClick={() => {
          openExportConfirmationBox();
        }}
      >
        <label class="btn btn-circle text-white">
          <ControlMapMenuExport />
        </label>
      </button>
    </>
  );
}
