import { JSXElement } from "solid-js";

import { LabeledInputNumber } from "../../../../component/molecule/LabeledInputNumber";
import CheckIcon from "../../../../icons/CheckIcon";
import LeftChevronIcon from "../../../../icons/LeftChevronIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./TimelineQuantitySetting.css";

export function TimelineQuantitySetting(props: {
  closeSettings: () => void;
  updateQuantity: (value: number) => void;
  quantity: number;
}): JSXElement {
  const previousQuantity = props.quantity;

  return (
    <div class="settings-menu">
      <div class="header-menu">
        <ButtonIcon
          icon={<LeftChevronIcon />}
          onClick={() => props.updateQuantity(previousQuantity)}
          class="back-icon"
        />
        <ButtonIcon
          icon={<CheckIcon />}
          onClick={() => {
            props.closeSettings();
          }}
          class="save-icon"
        />
      </div>

      <div class="content">
        <LabeledInputNumber
          label="Quantité"
          onChange={(element) => props.updateQuantity(Number(element.value))}
          selector={{
            value: props.quantity,
            disabled: false,
          }}
        />
      </div>
    </div>
  );
}
