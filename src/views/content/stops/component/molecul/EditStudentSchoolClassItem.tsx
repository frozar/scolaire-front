import { createSignal, onMount } from "solid-js";
import { ClasseType } from "../../../../../_entities/classe.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import {
  ClassStudentToSchoolEntity,
  ClassToSchoolTypeFormatedWithUsedQuantity,
} from "../../../../../_entities/student-to-school.entity";
import { StudentToSchoolService } from "../../../../../_services/student-to-school.service";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import CheckIcon from "../../../../../icons/CheckIcon";
import { addNewUserInformation } from "../../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../../type";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { getSchools } from "../../../map/component/organism/SchoolPoints";
import ClasseSelection from "../atom/ClasseSelection";
import InputNumber from "../atom/InputNumber";
import SchoolSelect from "../atom/SchoolSelection";
import { stopDetailsItem } from "../organism/StopDetails";
import "./EditStudentSchoolClassItem.css";

interface EditStopProps {
  classStudentToSchool?: ClassToSchoolTypeFormatedWithUsedQuantity;
  close: () => void;
}

export default function (props: EditStopProps) {
  const seletElement = document.createElement("select");
  const [selectedSchool, setSelectedSchool] = createSignal<SchoolType>();

  const [schoolSelectRef, setSchoolSelectRef] =
    createSignal<HTMLSelectElement>(seletElement);
  const [classeSelectRef, setClasseSelectRef] =
    createSignal<HTMLSelectElement>(seletElement);
  const [quantityInputRef, setQuantityInputRef] =
    createSignal<HTMLInputElement>(document.createElement("input"));

  if (props.classStudentToSchool != undefined) {
    const school = getSchools().filter(
      (school) => school.id == props.classStudentToSchool?.school?.id
    )[0];
    setSelectedSchool(school);
  }

  onMount(() => {
    if (props.classStudentToSchool != undefined) {
      schoolSelectRef().value =
        props.classStudentToSchool.school.id?.toString() ?? "default";
      classeSelectRef().value =
        props.classStudentToSchool.class.id?.toString() ?? "default";
      quantityInputRef().value =
        props.classStudentToSchool.quantity.toString() ?? 0;
      return;
    }
    classeSelectRef().disabled = true;
    quantityInputRef().disabled = true;
  });

  function resetClasseAndQuantity() {
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
      return resetClasseAndQuantity();
    } else if (school.id != selectedSchool()?.id) {
      resetClasseAndQuantity();
    }
    classeSelectRef().disabled = false;
    setSelectedSchool(school);
  };

  function onChangeSelectClasse() {
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
        content: "Veuillez compléter tous les champs !",
      });
    }
    return validInputs;
  }

  async function create() {
    if (checkAllInputsValue()) return;
    const classToSchool = await StudentToSchoolService.create({
      schoolId: Number(schoolSelectRef().value),
      stopId: Number(stopDetailsItem()?.id),
      quantity: Number(quantityInputRef().value),
      classId: Number(classeSelectRef().value),
    });

    ClassStudentToSchoolEntity.appendToStop(
      classToSchool,
      stopDetailsItem()?.id as number
    );
  }

  async function update() {
    if (!props.classStudentToSchool) return;
    const classToSchool = await StudentToSchoolService.update({
      id: props.classStudentToSchool?.id as number,
      schoolId: Number(schoolSelectRef().value),
      stopId: Number(stopDetailsItem()?.id),
      quantity: Number(quantityInputRef().value),
      classId: Number(classeSelectRef().value),
    });

    ClassStudentToSchoolEntity.updateFromStop(
      classToSchool,
      stopDetailsItem()?.id as number
    );

    // TODO lucas même update mais pour school
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
        <ClasseSelection
          refSelectSetter={setClasseSelectRef}
          classes={selectedSchool()?.classes as ClasseType[]}
          onChange={onChangeSelectClasse}
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
