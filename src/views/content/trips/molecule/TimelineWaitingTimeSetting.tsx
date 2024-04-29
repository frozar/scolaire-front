import { JSXElement, createSignal } from "solid-js";

import { LabeledInputNumber } from "../../../../component/molecule/LabeledInputNumber";
import CheckIcon from "../../../../icons/CheckIcon";
import LeftChevronIcon from "../../../../icons/LeftChevronIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./TimelineWaitingTimeSetting.css";

export function TimelineWaitingTimeSetting(props: {
  closeSettings: () => void;
  onClickWaitingTime: (value: number) => void;
  waitingTime: number;
}): JSXElement {
  // eslint-disable-next-line solid/reactivity
  const [waitingTime, setWaitingTime] = createSignal(props.waitingTime);

  function onChangeWaitingTime(value: number) {
    setWaitingTime(value);
  }

  return (
    <div class="settings-menu">
      <div class="header-menu">
        <ButtonIcon
          icon={<LeftChevronIcon />}
          onClick={() => props.closeSettings()}
          class="back-icon"
        />
        <ButtonIcon
          icon={<CheckIcon />}
          onClick={() => {
            props.onClickWaitingTime(waitingTime());
            props.closeSettings();
          }}
          class="save-icon"
        />
      </div>

      <div class="content">
        <LabeledInputNumber
          label="Temps d'attente"
          onChange={(element) => onChangeWaitingTime(Number(element.value))}
          selector={{
            value: waitingTime(),
            disabled: false,
          }}
        />
      </div>
    </div>
  );
}
