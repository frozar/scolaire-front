import { createEffect, createSignal, onMount } from "solid-js";
import { AssociatedSchoolType } from "../../../../../_entities/_utils.entity";
import { CalendarDayEnum } from "../../../../../_entities/calendar.entity";
import {
  GradeTripType,
  GradeType,
} from "../../../../../_entities/grade.entity";
import { LineType } from "../../../../../_entities/line.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import CheckIcon from "../../../../../icons/CheckIcon";
import { addNewUserInformation } from "../../../../../signaux";
import {
  MessageLevelEnum,
  MessageTypeEnum,
  NatureEnum,
} from "../../../../../type";
import { AssociatedUtils } from "../../../../../utils/associated.utils";
import { QuantityMatrixType } from "../../../../../utils/quantity.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { setLines } from "../../../map/component/organism/BusLines";
import { getSchools } from "../../../map/component/organism/SchoolPoints";
import { getStops } from "../../../map/component/organism/StopPoints";
import GradeSelection from "../atom/GradeSelection";
import InputNumber from "../atom/InputNumber";
import SchoolSelect from "../atom/SchoolSelection";
import "./EditStudentSchoolGradeItem.css";

interface EditStopProps {
  gradeStudentToGrade?: AssociatedSchoolType;
  close: () => void;
}

export type SelectorType = {
  value: string;
  disabled: boolean;
};

export type QuantitySelectorType = {
  value: number;
  disabled: boolean;
};

export default function (props: EditStopProps) {
  const [selectedSchool, setSelectedSchool] = createSignal<SchoolType>();

  const [schoolSelector, setSchoolSelector] = createSignal<SelectorType>({
    value: "default",
    disabled: false,
  });

  const [gradeSelector, setGradeSelector] = createSignal<SelectorType>({
    value: "default",
    disabled: true,
  });

  const [quantitySelector, setQuantitySelector] =
    createSignal<QuantitySelectorType>({ value: 0, disabled: true });

  createEffect(() => {
    if (props.gradeStudentToGrade != undefined) {
      const school = getSchools().filter(
        (school) => school.id == props.gradeStudentToGrade?.schoolId
      )[0];
      setSelectedSchool(school);
    }
  });

  onMount(() => {
    // Modifying case
    const studentToGrade = props.gradeStudentToGrade;
    if (studentToGrade != undefined) {
      setGradeSelector({
        disabled: true,
        value: String(props.gradeStudentToGrade?.gradeId),
      });

      setSchoolSelector({
        disabled: true,
        value: String(studentToGrade.schoolId),
      });

      setQuantitySelector({
        disabled: false,
        value: props.gradeStudentToGrade?.quantity as number,
      });

      return;
    }
  });

  function resetGradeAndQuantity() {
    setGradeSelector({ value: "default", disabled: false });
    setQuantitySelector({ value: 0, disabled: false });
  }

  function onChangeSchoolSelect(element: HTMLSelectElement) {
    const value = element.value;
    if (value != "default") {
      const school = getSchools().filter(
        (school) => school.id == parseInt(element.value)
      )[0];
      setSelectedSchool(school);
    }
    resetGradeAndQuantity();
    setSchoolSelector((prev) => {
      return { ...prev, value };
    });
  }

  function onChangeSelectGrade(element: HTMLSelectElement) {
    const value: string = element.value;
    setGradeSelector((prev) => {
      return { ...prev, value: value };
    });
    setQuantitySelector({ value: 0, disabled: false });
  }

  function onChangeQuantity(element: HTMLInputElement) {
    setQuantitySelector((prev) => {
      return { ...prev, value: parseInt(element.value) };
    });
  }

  function checkAllInputsValue() {
    const validInputs =
      schoolSelector().value == "default" ||
      quantitySelector().value == 0 ||
      gradeSelector().value == "default";

    if (validInputs) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.warning,
        type: MessageTypeEnum.global,
        content: "Veuillez compléter tous les champs",
      });
    }
    return validInputs;
  }

  async function validate(qty: number) {
    if (checkAllInputsValue()) return;
    if (props.gradeStudentToGrade) {
      await AssociatedUtils.update(
        props.gradeStudentToGrade.idClassToSchool,
        parseInt(gradeSelector().value),
        parseInt(schoolSelector().value),
        quantitySelector().value
      );

      const gradeId = props.gradeStudentToGrade.gradeId;
      const stopId = getStops().filter((stop) =>
        stop.associated.some(
          (assoc) =>
            assoc.idClassToSchool == props.gradeStudentToGrade?.idClassToSchool
        )
      )[0].id;

      setLines((prev) => {
        const lines: LineType[] = [...prev];

        enum GoingComingQtyEnum {
          goingQty = "goingQty",
          comingQty = "comingQty",
        }

        function updateMatrixQuantityWithNewQty(
          matrix: QuantityMatrixType,
          qty: number
        ) {
          for (const day of Object.keys(CalendarDayEnum) as CalendarDayEnum[]) {
            for (const direction of Object.keys(
              GoingComingQtyEnum
            ) as GoingComingQtyEnum[]) {
              matrix[day][direction] = matrix[day][direction] == 0 ? 0 : qty;
            }
          }

          return matrix;
        }

        const linesBis: LineType[] = lines.flatMap((line) => {
          return {
            ...line,
            trips: line.trips.flatMap((trip) => {
              return {
                ...trip,
                tripPoints: trip.tripPoints.flatMap((tripPoint) => {
                  return {
                    ...tripPoint,
                    grades: tripPoint.grades.map((gradeTrip): GradeTripType => {
                      if (
                        gradeTrip.gradeId == gradeId &&
                        tripPoint.nature == NatureEnum.stop &&
                        tripPoint.id == stopId
                      ) {
                        return {
                          ...gradeTrip,
                          quantity: qty,
                          matrix: updateMatrixQuantityWithNewQty(
                            gradeTrip.matrix,
                            qty
                          ),
                        };
                      } else return gradeTrip;
                    }),
                  };
                }),
              };
            }),
          };
        });
        return linesBis;
      });
    } else {
      AssociatedUtils.create(
        qty,
        Number(gradeSelector().value),
        Number(schoolSelector().value)
      );
    }
    props.close();
  }

  return (
    <CardWrapper class="edit-stop">
      <div class="edit-stop-top-line">
        <SchoolSelect
          onChange={onChangeSchoolSelect}
          isModifying={props.gradeStudentToGrade ? true : false}
          selector={schoolSelector()}
          schools={getSchools()}
        />
        <ButtonIcon
          icon={<CheckIcon />}
          onClick={() => validate(quantitySelector().value)}
        />
      </div>

      <div class="edit-stop-bottom-line">
        <GradeSelection
          isModifying={props.gradeStudentToGrade ? true : false}
          selector={gradeSelector()}
          grades={selectedSchool()?.grades as GradeType[]}
          onChange={onChangeSelectGrade}
        />
        <InputNumber
          class="input-form w-full"
          min={0}
          selector={quantitySelector()}
          onChange={onChangeQuantity}
          placeholder="Quantité"
        />
      </div>
    </CardWrapper>
  );
}
