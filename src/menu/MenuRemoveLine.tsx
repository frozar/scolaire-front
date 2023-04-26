import { FaRegularTrashCan } from "solid-icons/fa";

import { useStateAction } from "../StateAction";
import { displayRemoveLineMessage } from "../userInformation/utils";
import { getLeafletMap } from "../global/leafletMap";

const [, { setModeRemoveLine, isInRemoveLineMode, setModeRead }] =
  useStateAction();

export default function () {
  return (
    <div class="menu-btn left-[140px]">
      <label
        tabIndex={0}
        class="btn btn-circle"
        classList={{ "bg-blue-600 hover:bg-blue-600": isInRemoveLineMode() }}
        onClick={() => {
        const busLine = getLeafletMap().getPane("overlayPane");
        if (busLine) {
          console.log(busLine);
        }
          
          if (isInRemoveLineMode()) {
            setModeRead();
            return;
          }
          setModeRemoveLine();
          displayRemoveLineMessage();
        }}
      >
        <FaRegularTrashCan class="w-6 h-6" stroke="none" fill="#ffffffca" />
      </label>
    </div>
  );
}
