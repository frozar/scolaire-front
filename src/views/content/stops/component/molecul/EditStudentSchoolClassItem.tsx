import { createSignal, onMount } from "solid-js";
import { AssociatedPointType } from "../../../../../_entities/_utils.entity";
import { ClasseType } from "../../../../../_entities/classe.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import {
  ClassStudentToSchool,
  ClassStudentToSchoolDBType,
  ClassStudentToSchoolTypeFormated,
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
  classStudentToSchool?: AssociatedPointType;
  updateClassStudentToSchoolOfStop?: (item: AssociatedPointType) => void;
  appendClassToList?: (classItem: AssociatedPointType) => void;
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
      (school) => school.id == props.classStudentToSchool?.id
    )[0];
    setSelectedSchool(school);
  }

  onMount(() => {
    if (props.classStudentToSchool != undefined) {
      schoolSelectRef().value = selectedSchool()?.id.toString() ?? "";
      classeSelectRef().value =
        props.classStudentToSchool.class.id?.toString() ?? "default";
      quantityInputRef().value = props.classStudentToSchool.quantity.toString();
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
    setSelectedSchool(school);

    if (!school) return resetClasseAndQuantity();
    if (!selectedSchool()) {
      classeSelectRef().disabled = false;
    }
    if (school.id != selectedSchool()?.id) {
      resetClasseAndQuantity();
      return;
    }

    classeSelectRef().disabled = false;
  };

  function FormatSelectorsInputToClassStudentToSchoolDBType(): Omit<
    ClassStudentToSchoolDBType,
    "id"
  > {
    return ClassStudentToSchool.dbFormat({
      schoolId: Number(schoolSelectRef().value),
      stopId: Number(stopDetailsItem()?.id),
      quantity: Number(quantityInputRef().value),
      classId: Number(classeSelectRef().value),
    });
  }

  function FormatToAssociatedPoint(
    id: number,
    classTopSchool?: ClassStudentToSchoolTypeFormated
  ): AssociatedPointType {
    return {
      class: {
        id: classTopSchool
          ? (classTopSchool.class.id as number)
          : Number(classeSelectRef().value),
        name: classTopSchool
          ? classTopSchool.class.name
          : classeSelectRef().selectedOptions[0].text,
      },
      id: classTopSchool
        ? (classTopSchool.school.id as number)
        : Number(schoolSelectRef().value),
      name: classTopSchool
        ? classTopSchool.school.name
        : schoolSelectRef().selectedOptions[0].text,
      quantity: classTopSchool
        ? classTopSchool.quantity
        : Number(quantityInputRef().value),
      studentSchoolId: classTopSchool ? classTopSchool.id : id,
      usedQuantity: 0,
    };
  }

  function checkAllSelectorHaveSelectedValue() {
    return (
      schoolSelectRef().value == "default" ||
      quantityInputRef().value == "0" ||
      classeSelectRef().value == "default"
    );
  }

  async function validate() {
    if (checkAllSelectorHaveSelectedValue()) {
      return addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.warning,
        type: MessageTypeEnum.global,
        content: "Veuillez compléter tous les champs !",
      });
    }
    const response = await StudentToSchoolService.create(
      FormatSelectorsInputToClassStudentToSchoolDBType()
    );
    if (props.appendClassToList) {
      props.appendClassToList(FormatToAssociatedPoint(response.id));
    }
    props.close();
  }

  async function update() {
    if (!props.classStudentToSchool) return;
    const classToSchool = await StudentToSchoolService.update({
      id: props.classStudentToSchool.studentSchoolId,
      ...FormatSelectorsInputToClassStudentToSchoolDBType(),
    });

    if (props.updateClassStudentToSchoolOfStop) {
      const classStudentToSchoolResponse = FormatToAssociatedPoint(
        classToSchool.id as number,
        classToSchool
      );
      props.updateClassStudentToSchoolOfStop(classStudentToSchoolResponse);
    }
    props.close();
  }

  function onChangeSelectClasse() {
    if (classeSelectRef().value != "default") {
      quantityInputRef().disabled = false;
    } else {
      quantityInputRef().disabled = true;
      quantityInputRef().value = "0";
    }
  }

  return (
    <CardWrapper class="edit-stop">
      <div class="edit-stop-top-line">
        <SchoolSelect
          onChange={onChangeSchoolSelect}
          refSelectSetter={setSchoolSelectRef}
          schools={getSchools()}
        />

        <ButtonIcon
          icon={<CheckIcon />}
          onClick={() => {
            if (props.updateClassStudentToSchoolOfStop) {
              update();
            } else validate();
          }}
        />
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
