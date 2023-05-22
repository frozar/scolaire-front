import { createSignal, Show } from "solid-js";

import { useStateAction } from "../../../StateAction";
import { assertIsNode } from "../../../utils";
import { Transition } from "solid-transition-group";
import ClickOutside from "../../../ClickOutside";
import { displayAddLineMessage } from "../../../userInformation/utils";
import { FaSolidPlus } from "solid-icons/fa";

const [, { setModeAddLine, isInAddLineMode, isInReadMode, setModeRead }] =
  useStateAction();

declare module "solid-js" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface Directives {
      ClickOutside: (e: MouseEvent) => void;
    }
  }
}

export default function () {
  const [show, setShow] = createSignal(false);

  function toggleShow() {
    setShow((show) => !show);
  }

  let refDrawnMenu: HTMLUListElement | undefined;
  let refLabelMenu: HTMLLabelElement | undefined;

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
          if (!isInReadMode()) {
            setModeRead();
          } else {
            toggleShow();
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
