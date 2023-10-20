import { createEffect, createSignal, onMount } from "solid-js";
import { AssociatedSchoolType } from "../../../../../_entities/_utils.entity";
import { GradeType } from "../../../../../_entities/grade.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { StudentToSchoolService } from "../../../../../_services/student-to-school.service";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import CheckIcon from "../../../../../icons/CheckIcon";
import { addNewUserInformation } from "../../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../../type";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { getSchools } from "../../../map/component/organism/SchoolPoints";
import { appendToStop } from "../../../map/component/organism/StopPoints";
import GradeSelection from "../atom/GradeSelection";
import InputNumber from "../atom/InputNumber";
import SchoolSelect from "../atom/SchoolSelection";
import { stopDetailsItem } from "../organism/StopDetails";
import "./EditStudentSchoolClassItem.css";

interface EditStopProps {
  classStudentToSchool?: AssociatedSchoolType;
  close: () => void;
}

export default function (props: EditStopProps) {
  const seletElement = document.createElement("select");
  const [selectedSchool, setSelectedSchool] = createSignal<SchoolType>();

  const [schoolSelectRef, setSchoolSelectRef] =
    createSignal<HTMLSelectElement>(seletElement);
  const [classeSelectRef, setGradeSelectRef] =
    createSignal<HTMLSelectElement>(seletElement);
  const [quantityInputRef, setQuantityInputRef] =
    createSignal<HTMLInputElement>(document.createElement("input"));

  createEffect(() => {
    if (props.classStudentToSchool != undefined) {
      const school = getSchools().filter(
        (school) => school.id == props.classStudentToSchool?.schoolId
      )[0];
      setSelectedSchool(school);
    }
  });

  onMount(() => {
    if (props.classStudentToSchool != undefined) {
      schoolSelectRef().value =
        props.classStudentToSchool.schoolId?.toString() ?? "default";
      classeSelectRef().value =
        props.classStudentToSchool.classId?.toString() ?? "default";
      quantityInputRef().value =
        props.classStudentToSchool.quantity.toString() ?? 0;
      return;
    }
    classeSelectRef().disabled = true;
    quantityInputRef().disabled = true;
  });

  function resetGradeAndQuantity() {
    classeSelectRef().disabled = true;
    classeSelectRef().value = "default";
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
    classeSelectRef().disabled = false;
    setSelectedSchool(school);
  };

  function onChangeSelectGrade() {
    if (classeSelectRef().value != "default") {
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
      classeSelectRef().value == "default";
    if (validInputs) {
      return addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.warning,
        type: MessageTypeEnum.global,
        content: "Veuillez compléter tous les champs",
      });
    }
    return validInputs;
  }

  async function create() {
    // TODO to fix
    if (checkAllInputsValue()) return;
    const associatedStopT = {
      stopId: Number(stopDetailsItem()?.id),
      quantity: Number(quantityInputRef().value),
      classId: Number(classeSelectRef().value),
    };

    const classToSchool = await StudentToSchoolService.create(
      associatedStopT,
      Number(schoolSelectRef().value)
    );
    appendToStop(classToSchool, stopDetailsItem()?.id as number);
  }

  async function update() {
    if (!props.classStudentToSchool) return;
    // const classToSchool = await StudentToSchoolService.update({
    //   idClassToSchool: props.classStudentToSchool?.idClassToSchool as number,
    //   schoolId: Number(schoolSelectRef().value),
    //   stopId: Number(stopDetailsItem()?.id),
    //   quantity: Number(quantityInputRef().value),
    //   classId: Number(classeSelectRef().value),
    // });

    // updateFromStop(classToSchool, stopDetailsItem()?.id as number);

    // TODO lucas même update mais pour school
    console.log("update student to class");
  }

  async function validate() {
    if (props.classStudentToSchool) await update();
    else await create();
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
          classes={selectedSchool()?.classes as GradeType[]}
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
