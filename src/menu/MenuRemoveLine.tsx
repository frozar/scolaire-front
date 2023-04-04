import { FaRegularTrashCan } from "solid-icons/fa";
import InfoBox from "../userInformation/InfoBox";

export default function MenuDraw() {
  return (
    <div class="absolute top-[20px] left-[140px] z-[999] outline-none cursor-pointer">
      <label
        tabIndex={0}
        class="btn btn-circle"
        onClick={() => console.log("Click trash")}
      >
        <FaRegularTrashCan class="w-6 h-6" stroke="none" fill="#ffffffca" />
      </label>
      <InfoBox>
        <span>
          <kbd class="kbd">Echap</kbd> pour sortir du mode Suppression
        </span>
      </InfoBox>
    </div>
  );
}
