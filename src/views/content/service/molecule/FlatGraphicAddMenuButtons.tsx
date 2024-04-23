import { FaSolidCircleCheck, FaSolidCircleXmark } from "solid-icons/fa";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./FlatGraphicAddMenuButtons.css";

interface FlatGraohicAddMenuButtonsProps {
  cancel: () => void;
  submit: () => void;
}

export function FlatGraohicAddMenuButtons(
  props: FlatGraohicAddMenuButtonsProps
) {
  return (
    <div class="flat-graphic-buttons">
      <ButtonIcon
        icon={<FaSolidCircleXmark class="flat-graphic-cancel" />}
        onClick={props.cancel}
      />
      <ButtonIcon
        icon={<FaSolidCircleCheck class="flat-graphic-submit" />}
        onClick={props.submit}
      />
    </div>
  );
}
