import { createEffect, createSignal, onMount } from "solid-js";
import { AssociatedSchoolType } from "../../../../../_entities/_utils.entity";
import { GradeType } from "../../../../../_entities/grade.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import CheckIcon from "../../../../../icons/CheckIcon";
import { addNewUserInformation } from "../../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../../type";
import { AssociatedUtils } from "../../../../../utils/associated.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { getSchools } from "../../../map/component/organism/SchoolPoints";
import GradeSelection from "../atom/GradeSelection";
import InputNumber from "../atom/InputNumber";
import SchoolSelect from "../atom/SchoolSelection";
import "./EditStudentSchoolGradeItem.css";

interface EditStopProps {
  gradeStudentToGrade?: AssociatedSchoolType;
  close: () => void;
}

export default function (props: EditStopProps) {
  const seletElement = document.createElement("select");
  const [selectedSchool, setSelectedSchool] = createSignal<SchoolType>();

  const [schoolSelectRef, setSchoolSelectRef] =
    createSignal<HTMLSelectElement>(seletElement);
  const [gradeSelectRef, setGradeSelectRef] =
    createSignal<HTMLSelectElement>(seletElement);
  const [quantityInputRef, setQuantityInputRef] =
    createSignal<HTMLInputElement>(document.createElement("input"));

  createEffect(() => {
    if (props.gradeStudentToGrade != undefined) {
      const school = getSchools().filter(
        (school) => school.id == props.gradeStudentToGrade?.schoolId
      )[0];
      setSelectedSchool(school);
    }
  });

  onMount(() => {
    if (props.gradeStudentToGrade != undefined) {
      schoolSelectRef().value =
        props.gradeStudentToGrade.schoolId?.toString() ?? "default";
      gradeSelectRef().value =
        props.gradeStudentToGrade.gradeId?.toString() ?? "default";
      quantityInputRef().value =
        props.gradeStudentToGrade.quantity.toString() ?? 0;
      return;
    }
    gradeSelectRef().disabled = true;
    quantityInputRef().disabled = true;
  });

  function resetGradeAndQuantity() {
    gradeSelectRef().disabled = true;
    gradeSelectRef().value = "default";
    quantityInputRef().disabled = true;
    quantityInputRef().value = "0";
  }

  const onChangeSchoolSelect = () => {
    const school = getSchools().filter(
      (school) => school.id == parseInt(schoolSelectRef().value)
    )[0];

    if (!school) {
      return resetGradeAndQuantity();
    } else if (school.id != selectedSchool()?.id) {
      resetGradeAndQuantity();
    }
    gradeSelectRef().disabled = false;
    setSelectedSchool(school);
  };

  function onChangeSelectGrade() {
    if (gradeSelectRef().value != "default") {
      quantityInputRef().disabled = false;
    } else {
      quantityInputRef().disabled = true;
      quantityInputRef().value = "0";
    }
  }

  function checkAllInputsValue() {
    const validInputs =
      schoolSelectRef().value == "default" ||
      quantityInputRef().value == "0" ||
      gradeSelectRef().value == "default";

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
    if (props.gradeStudentToGrade)
      await AssociatedUtils.update(
        props.gradeStudentToGrade.idClassToSchool,
        Number(gradeSelectRef().value),
        Number(schoolSelectRef().value),
        Number(quantityInputRef().value)
      );
    else if (!checkAllInputsValue())
      AssociatedUtils.create(
        Number(quantityInputRef().value),
        Number(gradeSelectRef().value),
        Number(schoolSelectRef().value)
      );
    props.close();
  }

  return (
    <CardWrapper class="edit-stop">
      <div class="edit-stop-top-line">
        <SchoolSelect
          onChange={onChangeSchoolSelect}
          refSelectSetter={setSchoolSelectRef}
          schools={getSchools()}
        />

        <ButtonIcon icon={<CheckIcon />} onClick={validate} />
      </div>

      <div class="edit-stop-bottom-line">
        <GradeSelection
          refSelectSetter={setGradeSelectRef}
          grades={selectedSchool()?.grades as GradeType[]}
          onChange={onChangeSelectGrade}
        />
        <InputNumber
          ref={setQuantityInputRef}
          class="input-form w-full"
          min={0}
          defaultValue={0}
          placeholder="Quantité"
        />
      </div>
    </CardWrapper>
  );
}
