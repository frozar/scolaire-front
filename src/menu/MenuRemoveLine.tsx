import { FaSolidMinus } from "solid-icons/fa";

import { useStateAction } from "../StateAction";
import { displayRemoveLineMessage } from "../userInformation/utils";

const [, { setModeRemoveLine, isInRemoveLineMode, setModeRead }] =
  useStateAction();

export default function () {
  return (
    <div class="menu-btn left-[140px] group">
      <span class="tooltip group-hover:scale-100">Supprimer une ligne</span>
      <label
        tabIndex={0}
        class="custom-btn btn-circle hover:bg-[#062F3F] hover:text-[#0cc683]"
        classList={{ "bg-[#062F3F] text-[#0cc683]": isInRemoveLineMode() }}
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
