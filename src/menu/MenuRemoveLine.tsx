import { FaSolidMinus } from "solid-icons/fa";

import { useStateAction } from "../StateAction";
import { displayRemoveLineMessage } from "../userInformation/utils";

const [, { setModeRemoveLine, isInRemoveLineMode, setModeRead }] =
  useStateAction();

export default function () {
  return (
    <div class="menu-btn left-[140px] group">
      <span class="tooltip group-hover:scale-100">Supprimer des lignes</span>
      <label
        tabIndex={0}
        class="custom-btn btn-circle"
        classList={{ "bg-blue-600 hover:bg-blue-600": isInRemoveLineMode() }}
        onClick={() => {
          if (isInRemoveLineMode()) {
            setModeRead();
            return;
          }
          setModeRemoveLine();
          displayRemoveLineMessage();
        }}
      >
        <FaSolidMinus class="w-full h-2/3" />
      </label>
    </div>
  );
}
