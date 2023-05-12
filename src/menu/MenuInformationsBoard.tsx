import { IoInformation } from "solid-icons/io";

import { useStateGui } from "../StateGui";
const [, { toggleDisplayedInformationBoard }] = useStateGui();

export default function () {
  return (
    <div class="menu-btn left-[140px] group">
      <span class="tooltip group-hover:scale-100">
        Montré le panneau d'information des arrêts
      </span>
      <label class="btn btn-circle" onClick={toggleDisplayedInformationBoard}>
        <IoInformation class="w-full p-0 h-2/3" />
      </label>
    </div>
  );
}
