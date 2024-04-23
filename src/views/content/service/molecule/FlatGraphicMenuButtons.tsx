import { FaSolidCircleCheck, FaSolidCircleXmark } from "solid-icons/fa";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./FlatGraphicMenuButtons.css";

interface FlatGraphicMenuButtonsProps {
  cancel: () => void;
  submit: () => void;
}

export function FlatGraphicMenuButtons(props: FlatGraphicMenuButtonsProps) {
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
