import { createEffect, createSignal, onMount } from "solid-js";
import { AssociatedSchoolType } from "../../../../../_entities/_utils.entity";
import { GradeType } from "../../../../../_entities/grade.entity";
import { LineType } from "../../../../../_entities/line.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../../../_entities/trip-direction.entity";
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
import { StopUtils } from "../../../../../utils/stop.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { getLines, setLines } from "../../../map/component/organism/BusLines";
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

  async function validate() {
    console.log("validate function");
    if (checkAllInputsValue()) return;

    if (props.gradeStudentToGrade) {
      // ! That triggers quantity calcul (reload the component)
      // await AssociatedUtils.update(
      //   props.gradeStudentToGrade.idClassToSchool,
      //   parseInt(gradeSelector().value),
      //   parseInt(schoolSelector().value),
      //   quantitySelector().value
      // );

      // TODO: Clean, refactor and move
      // ! Ici update les matrices des courses liées !
      const gradeId = props.gradeStudentToGrade.gradeId;
      // !!!!!!!!!! Récup le stopId
      const stopId = getStops().filter((stop) =>
        stop.associated.some(
          (assoc) =>
            assoc.idClassToSchool == props.gradeStudentToGrade?.idClassToSchool
        )
      )[0].id;
      console.log(
        "=========================",
        getStops().filter((stop) =>
          stop.associated.some(
            (assoc) =>
              assoc.idClassToSchool ==
              props.gradeStudentToGrade?.idClassToSchool
          )
        )
      );
      setLines((prev) => {
        // ! Récup la liste des trip point concerné (stop et grade correspondant)
        const lines: LineType[] = [...prev];
        // const matrix = QuantityUtils.getRemainingQuantityMatrix(
        //   stopId,
        //   props.gradeStudentToGrade?.idClassToSchool as number
        // );
        // TODO: CLean
        const stop = getStops().filter((stop) => stop.id == stopId)[0];
        const associated = stop.associated.filter(
          (associated) =>
            associated.idClassToSchool ==
            (props.gradeStudentToGrade?.idClassToSchool as number)
        )[0];
        const tripMatrix: QuantityMatrixType[] = StopUtils.getGradeTrips(stopId)
          .filter((gradeTrip) => gradeTrip.gradeId == associated.gradeId)
          .flatMap((_gradeTrip) => _gradeTrip.matrix) as QuantityMatrixType[];
        const newMatrix: QuantityMatrixType[] = [];
        for (const matrix of tripMatrix) {
          // TODO: Use builQuantityMatrix instead
          const actual_matrix: QuantityMatrixType = {
            monday: {
              goingQty:
                matrix.monday.goingQty == 0 ? 0 : quantitySelector().value,
              comingQty:
                matrix.monday.comingQty == 0 ? 0 : quantitySelector().value,
            },
            tuesday: {
              goingQty:
                matrix.tuesday.goingQty == 0 ? 0 : quantitySelector().value,
              comingQty:
                matrix.tuesday.comingQty == 0 ? 0 : quantitySelector().value,
            },
            wednesday: {
              goingQty:
                matrix.wednesday.goingQty == 0 ? 0 : quantitySelector().value,
              comingQty:
                matrix.wednesday.comingQty == 0 ? 0 : quantitySelector().value,
            },
            thursday: {
              goingQty:
                matrix.thursday.goingQty == 0 ? 0 : quantitySelector().value,
              comingQty:
                matrix.thursday.comingQty == 0 ? 0 : quantitySelector().value,
            },
            friday: {
              goingQty:
                matrix.friday.goingQty == 0 ? 0 : quantitySelector().value,
              comingQty:
                matrix.friday.comingQty == 0 ? 0 : quantitySelector().value,
            },
            saturday: {
              goingQty:
                matrix.saturday.goingQty == 0 ? 0 : quantitySelector().value,
              comingQty:
                matrix.saturday.comingQty == 0 ? 0 : quantitySelector().value,
            },
            sunday: {
              goingQty:
                matrix.sunday.goingQty == 0 ? 0 : quantitySelector().value,
              comingQty:
                matrix.sunday.comingQty == 0 ? 0 : quantitySelector().value,
            },
          };
          newMatrix.push(actual_matrix);
        }
        console.log("newMatrix", newMatrix);
        console.log("tripMatrix", tripMatrix);

        const linesBis: LineType[] = lines.flatMap((line) => {
          return {
            ...line,
            trips: line.trips.flatMap((trip) => {
              return {
                ...trip,
                tripPoints: trip.tripPoints.flatMap((tripPoint) => {
                  return {
                    ...tripPoint,
                    grades: tripPoint.grades.map((gradeTrip) => {
                      if (
                        gradeTrip.gradeId == gradeId &&
                        tripPoint.nature == NatureEnum.stop &&
                        tripPoint.id == stopId
                      ) {
                        // console.log("in");
                        return {
                          ...gradeTrip,
                          matrix:
                            TripDirectionEntity.FindDirectionById(
                              trip.tripDirectionId
                            ).type == TripDirectionEnum.coming
                              ? newMatrix[1]
                              : newMatrix[0],
                        };
                      } else return gradeTrip;
                    }),
                  };
                }),
              };
            }),
          };
        });
        console.log("lines", linesBis);
        // ! Mettre à jour
        return linesBis;
      });

      console.log("getLines avant !", getLines());

      await AssociatedUtils.update(
        props.gradeStudentToGrade.idClassToSchool,
        parseInt(gradeSelector().value),
        parseInt(schoolSelector().value),
        quantitySelector().value
      );
      // console.log("getLines avant !", getLines());
    } else {
      AssociatedUtils.create(
        quantitySelector().value,
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
        <ButtonIcon icon={<CheckIcon />} onClick={validate} />
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
