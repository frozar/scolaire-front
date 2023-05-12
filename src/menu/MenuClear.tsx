import { FaRegularTrashCan } from "solid-icons/fa";

import { openClearConfirmationBox } from "../signaux";

export default function () {
  return (
    <div class="menu-btn left-[140px]">
      <label
        tabIndex={0}
        class="btn btn-circle"
        onClick={() => {
          openClearConfirmationBox();
        }}
      >
        <FaRegularTrashCan class="w-6 h-6" stroke="none" fill="#ffffffca" />
      </label>
    </div>
  );
}
