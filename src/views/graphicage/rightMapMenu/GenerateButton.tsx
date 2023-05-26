import { openGeneratorDialogueBox } from "../../../signaux";
import { FiArrowUpCircle } from "solid-icons/fi";
import {
  confirmAbortEditionNeedToBeCall,
  defineModalToOpen,
} from "../ConfirmStopAddLine";

export default function () {
  const handleClick = () => {
    defineModalToOpen(openGeneratorDialogueBox);
    confirmAbortEditionNeedToBeCall();
  };
  return (
    <div class="menu-btn left-[140px] group">
      <span class="tooltip group-hover:scale-100">Générer des trajets</span>
      <label
        class="custom-btn btn-circle hover:bg-[#062F3F] hover:text-[#0cc683]"
        onClick={handleClick}
      >
        <FiArrowUpCircle class="h-10 w-10" />
      </label>
    </div>
  );
}
