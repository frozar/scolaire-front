import { createSignal, onMount } from "solid-js";
import { AssociatedPointType } from "../../../../../_entities/_utils.entity";
import { ClasseType } from "../../../../../_entities/classe.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { ClassStudentToSchoolDBType } from "../../../../../_entities/student-to-school.entity";
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
import "./EditStudentSchoolClassItem.css";

interface EditStopProps {
  appendClassToList: (classItem: AssociatedPointType) => void;
  close: () => void;
  stopID: number;
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

  onMount(() => {
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

    if (!school) return resetClasseAndQuantity();

    if (!selectedSchool()) {
      classeSelectRef().disabled = false;
      setSelectedSchool(school);
    }

    if (school.id != selectedSchool()?.id) {
      resetClasseAndQuantity();
      setSelectedSchool();
      setSelectedSchool(school);
      return;
    }

    classeSelectRef().disabled = false;
  };

  function getClassStudentToSchool(): Omit<ClassStudentToSchoolDBType, "id"> {
    return {
      school_id: Number(schoolSelectRef().value),
      stop_id: Number(props.stopID),
      quantity: Number(quantityInputRef().value),
      class_id: Number(classeSelectRef().value),
    };
  }

  async function validate() {
    if (
      schoolSelectRef().value == "default" ||
      quantityInputRef().value == "0" ||
      classeSelectRef().value == "default"
    ) {
      return addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.warning,
        type: MessageTypeEnum.global,
        content: "Veuillez compléter tous les champs !",
      });
    }

    const response = await StudentToSchoolService.create(
      getClassStudentToSchool()
    );

    function getAssociatedPoint(): AssociatedPointType {
      return {
        class: {
          id: Number(classeSelectRef().value),
          name: classeSelectRef().selectedOptions[0].text,
        },
        id: Number(schoolSelectRef().value),
        name: schoolSelectRef().selectedOptions[0].text,
        quantity: Number(quantityInputRef().value),
        studentSchoolId: response.id,
        usedQuantity: 0,
      };
    }

    props.appendClassToList(getAssociatedPoint());
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
