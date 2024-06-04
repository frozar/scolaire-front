import { JSXElement } from "solid-js";

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
  updateQuantity: (value: GradeTripType[]) => void;
  point: TripPointType;
  trip: TripType;
}): JSXElement {
  const previousTripGrades = [...props.point.grades];

  function updateGradesTrip(askQuantity: number) {
    const gradesAvalaibleOnTrip = GradeUtils.gradesOfSchools(
      props.trip.schools
    );
    const stopGrades = gradesAvalaibleOnTrip.filter((grade) => {
      return grade.associatedStops.some(
        (stop) => stop.stopId == props.point.id
      );
    });
    const associatedGradeStopOfPoint = stopGrades
      .map((grade) => grade.associatedStops)
      .flat()
      .filter(
        (associatedStopGrade) => associatedStopGrade.stopId == props.point.id
      );

    //TODO continuer - recupération des GradeTripType[] disponible (sup^à 0) en fonction de la direction et des jours

    // je prend la quantité
    // je prend les grade + quantité dispo
    // je filtre pour avoir que des GradeTripType[] correspondant à la quantité
  }

  return (
    <div class="settings-menu">
      <div class="header-menu">
        <ButtonIcon
          icon={<LeftChevronIcon />}
          onClick={() => props.updateQuantity(previousTripGrades)}
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
          // max quantity - quantity allowable max ??
        />
      </div>
    </div>
  );
}
