import { useStateAction } from "../../../StateAction";
import { displayAddLineMessage } from "../../../userInformation/utils";
import { FaSolidPlus } from "solid-icons/fa";

const [, { setModeAddLine, isInAddLineMode, setModeRead }] = useStateAction();

let refLabelMenu: HTMLLabelElement;

export default function () {
  return (
    <div class="menu-btn group">
      <span class="tooltip group-hover:scale-100">Ajouter une ligne</span>
      <label
        ref={refLabelMenu}
        tabIndex={0}
        class="custom-btn btn-circle hover:bg-[#062F3F] hover:text-[#0cc683]"
        classList={{
          "bg-[#062F3F] text-[#0cc683]": isInAddLineMode(),
        }}
        onClick={() => {
          if (isInAddLineMode()) {
            setModeRead();
          } else {
            setModeAddLine();
            displayAddLineMessage();
          }
        }}
      >
        <FaSolidPlus class="w-full p-0 h-2/3" />
      </label>
    </div>
  );
}
