import { FaRegularTrashCan } from "solid-icons/fa";

import { useStateAction } from "../StateAction";
import { MessageLevelEnum } from "../type";
import { setUserInformation } from "../signaux";

const [, { setModeRemoveLine }] = useStateAction();

export default function MenuDraw() {
  return (
    <div class="absolute top-[20px] left-[140px] z-[999] outline-none cursor-pointer">
      <label
        tabIndex={0}
        class="btn btn-circle"
        onClick={() => {
          const content = () => (
            <span>
              <kbd class="kbd">Echap</kbd> pour sortir du mode Suppression
            </span>
          );
          setModeRemoveLine();
          setUserInformation({
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
