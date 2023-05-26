import { BsInfoCircle } from "solid-icons/bs";

import { useStateGui } from "../../../StateGui";

const [, { getDisplayedInformationBoard, toggleDisplayedInformationBoard }] =
  useStateGui();

export default function () {
  return (
    <div class="menu-btn left-[140px] group">
      <span class="tooltip group-hover:scale-100">
        Montré le panneau d'information des arrêts
      </span>
      <label
        class="custom-btn btn-circle hover:bg-[#062F3F] hover:text-[#0cc683]"
        classList={{
          "bg-[#062F3F] text-[#0cc683]": getDisplayedInformationBoard(),
        }}
        onClick={toggleDisplayedInformationBoard}
      >
        <BsInfoCircle class="h-10 w-10" />
      </label>
    </div>
  );
}
