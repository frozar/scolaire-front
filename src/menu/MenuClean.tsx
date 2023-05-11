import { FaRegularTrashCan } from "solid-icons/fa";

import { useStateAction } from "../StateAction";
import { displayRemoveLineMessage } from "../userInformation/utils";
import {
  openCleanConfirmationBox,
  openExportConfirmationBox,
} from "../signaux";

const [, { setModeRemoveLine, isInRemoveLineMode, setModeRead }] =
  useStateAction();

export default function () {
  return (
    <div class="menu-btn left-[140px]">
      <label
        tabIndex={0}
        class="btn btn-circle"
        onClick={() => {
          console.log("Je click");
          openCleanConfirmationBox();
        }}
      >
        <FaRegularTrashCan class="w-6 h-6" stroke="none" fill="#ffffffca" />
      </label>
    </div>
  );
}
