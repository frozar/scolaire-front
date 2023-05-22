import { openGeneratorDialogueBox } from "../../../signaux";
import { FiArrowUpCircle } from "solid-icons/fi";

export default function () {
  return (
    <div class="menu-btn left-[140px] group">
      <span class="tooltip group-hover:scale-100">Générer des trajets</span>
      <label
        class="custom-btn btn-circle hover:bg-[#062F3F] hover:text-[#0cc683]"
        onClick={openGeneratorDialogueBox}
      >
        <FiArrowUpCircle class="h-10 w-10" />
      </label>
    </div>
  );
}
