import { FaRegularTrashCan } from "solid-icons/fa";

import { useStateAction } from "../StateAction";
import { MessageLevelEnum, ModeEnum } from "../type";
import { addNewUserInformation, setUserInformations } from "../signaux";

const [, { setModeRemoveLine, getMode, setModeRead }] = useStateAction();

export default function MenuDraw() {
  return (
    <div class="absolute top-[20px] left-[140px] z-[999] outline-none cursor-pointer">
      <label
        tabIndex={0}
        class="btn btn-circle"
        classList={{"bg-blue-600 hover:bg-blue-600": getMode() === ModeEnum.removeLine}}
        onClick={() => {
          if (getMode() === ModeEnum.removeLine) {
            setUserInformations([]);
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
            id: -1,
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
