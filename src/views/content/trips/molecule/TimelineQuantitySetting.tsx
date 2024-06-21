import { JSXElement, Setter } from "solid-js";

import { GradeTripType } from "../../../../_entities/grade.entity";
import { TripPointType, TripType } from "../../../../_entities/trip.entity";
import { GradeUtils } from "../../../../_utils/grade.utils";
import { LabeledInputNumber } from "../../../../component/molecule/LabeledInputNumber";
import LeftChevronIcon from "../../../../icons/LeftChevronIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./TimelineQuantitySetting.css";

export function TimelineQuantitySetting(props: {
  closeSettings: () => void;
  point: TripPointType;
  setPoint: Setter<TripPointType>;
  trip: TripType;
}): JSXElement {
  function updateGradesTrip(askQuantity: number) {
    const gradesTrip: GradeTripType[] = [];
    const associatedStopGradeAvalaibleForStop =
      GradeUtils.associatedStopGradeAvalaibleForStop(
        props.trip.grades,
        props.point
      );

    for (const associatedStopGradeAvailable of associatedStopGradeAvalaibleForStop) {
      if (askQuantity > associatedStopGradeAvailable.quantity) {
        gradesTrip.push({
          gradeId: associatedStopGradeAvailable.gradeId,
          quantity: associatedStopGradeAvailable.quantity,
        });
        askQuantity -= associatedStopGradeAvailable.quantity;
      } else {
        gradesTrip.push({
          gradeId: associatedStopGradeAvailable.gradeId,
          quantity: askQuantity,
        });
        break;
      }
    }
    props.setPoint((prev) => {
      prev.grades = gradesTrip;
      return { ...prev };
    });
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
        <p> quantité min : 1</p>
        <p> quantité max : -</p>
        <LabeledInputNumber
          label="Quantité"
          onChange={(element) => updateGradesTrip(Number(element.value))}
          selector={{
            value: GradeUtils.getQuantityFromGradesTrip(props.point.grades),
            disabled: false,
          }}
          min={1}
          // max quantity : quantity allowable max ??
        />
      </div>
    </div>
  );
}
