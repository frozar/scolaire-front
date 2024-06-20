import { JSXElement, Setter } from "solid-js";

import { GradeTripType } from "../../../../_entities/grade.entity";
import { TripPointType, TripType } from "../../../../_entities/trip.entity";
import { GradeUtils } from "../../../../_utils/grade.utils";
import { LabeledInputNumber } from "../../../../component/molecule/LabeledInputNumber";
import CheckIcon from "../../../../icons/CheckIcon";
import LeftChevronIcon from "../../../../icons/LeftChevronIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./TimelineQuantitySetting.css";

export function TimelineQuantitySetting(props: {
  closeSettings: () => void;
  point: TripPointType;
  setPoint: Setter<TripPointType>;
  trip: TripType;
}): JSXElement {
  // eslint-disable-next-line solid/reactivity
  const previousTripGrades = [...props.point.grades];

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

  function retrievePreviousQuantity() {
    props.setPoint((prev) => {
      prev.grades = previousTripGrades;
      return { ...prev };
    });
    props.closeSettings();
  }

  return (
    <div class="settings-menu">
      <div class="header-menu">
        <ButtonIcon
          icon={<LeftChevronIcon />}
          onClick={() => retrievePreviousQuantity()}
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
        <p> quantité min : 1</p>
        <p> quantité max : -</p>
        <LabeledInputNumber
          label="Quantité"
          onChange={(element) => updateGradesTrip(Number(element.value))}
          selector={{
            value: GradeUtils.getQuantityFromGradesTrip(previousTripGrades),
            disabled: false,
          }}
          min={1}
          // max quantity : quantity allowable max ??
        />
      </div>
    </div>
  );
}
