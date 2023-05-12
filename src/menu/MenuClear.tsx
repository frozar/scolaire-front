import { FaRegularTrashCan } from "solid-icons/fa";

import { openClearConfirmationBox } from "../signaux";

export default function () {
  return (
    <div class="menu-btn left-[140px] group">
      <span class="tooltip group-hover:scale-100">Nettoyer la map</span>
      <label
        tabIndex={0}
        class="custom-btn btn-circle"
        onClick={() => {
          openClearConfirmationBox();
        }}
      >
        <FaRegularTrashCan class="w-full h-2/3" />
      </label>
    </div>
  );
}
