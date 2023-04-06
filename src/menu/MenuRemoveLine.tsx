import { FaRegularTrashCan } from "solid-icons/fa";

import { useStateAction } from "../StateAction";
import { MessageLevelEnum } from "../type";
import { addNewUserInformation } from "../signaux";

const [, { setModeRemoveLine, isInRemoveLineMode, setModeRead }] =
  useStateAction();

export default function MenuDraw() {
  return (
    <div class="absolute top-[20px] left-[140px] z-[999] outline-none cursor-pointer">
      <label
        tabIndex={0}
        class="btn btn-circle"
        classList={{ "bg-blue-600 hover:bg-blue-600": isInRemoveLineMode() }}
        onClick={() => {
          if (isInRemoveLineMode()) {
            setModeRead();
            return;
          }
          const content = () => (
            <span>
              <kbd class="kbd">Echap</kbd> pour sortir du mode Suppression
            </span>
          );
          setModeRemoveLine();
          addNewUserInformation({
            displayed: true,
            level: MessageLevelEnum.info,
            content: content(),
          });
        }}
      >
        <FaRegularTrashCan class="w-6 h-6" stroke="none" fill="#ffffffca" />
      </label>
    </div>
  );
}
