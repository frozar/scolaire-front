import { JSXElement, Setter } from "solid-js";

import { TripPointType } from "../../../../_entities/trip.entity";
import { LabeledInputNumber } from "../../../../component/molecule/LabeledInputNumber";
import LeftChevronIcon from "../../../../icons/LeftChevronIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./TimelineWaitingTimeSetting.css";

export function TimelineWaitingTimeSetting(props: {
  closeSettings: () => void;
  point: TripPointType;
  setPoint: Setter<TripPointType>;
}): JSXElement {
  function updateWaitingTime(value: number) {
    props.setPoint((prev) => {
      prev.waitingTime = value;
      return { ...prev };
    });
    props.closeSettings();
  }

  return (
    <div class="settings-menu">
      <div class="header-menu">
        <ButtonIcon
          icon={<LeftChevronIcon />}
          onClick={() => props.closeSettings()}
          class="back-icon"
        />
      </div>
      <div class="content">
        <LabeledInputNumber
          label="Temps d'attente"
          onChange={(element) => updateWaitingTime(Number(element.value))}
          selector={{
            value: props.point.waitingTime,
            disabled: false,
          }}
        />
      </div>
    </div>
  );
}
