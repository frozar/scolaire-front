import { createSignal, onMount } from "solid-js";
import { ClasseType, SchoolType } from "../../../../../_entities/school.entity";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import CheckIcon from "../../../../../icons/CheckIcon";
import { addNewUserInformation } from "../../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../../type";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { getSchools } from "../../../map/component/organism/SchoolPoints";
import ClasseSelection from "../atom/ClasseSelection";
import SchoolSelect from "../atom/SchoolSelect";
import "./EditStop.css";

interface EditStopProps {
  close: () => void;
  stopID: number;
}

export default function (props: EditStopProps) {
  const [selectedSchool, setSelectedSchool] = createSignal<SchoolType>();
  const [schoolSelectRef, setSchoolSelectRef] = createSignal<HTMLSelectElement>(
    document.createElement("select")
  );
  const [classeSelectRef, setClasseSelectRef] = createSignal<HTMLSelectElement>(
    document.createElement("select")
  );
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

  async function validate() {
    // TODO make request to add student quantity from class of school to the stop
    console.log(
      "TODO make request to add student quantity from class of school to the stop"
    );

    console.log("selected school", schoolSelectRef().value);
    console.log(
      "selected class",
      classeSelectRef().value == ""
        ? "no classe selected"
        : classeSelectRef().value
    );
    console.log("choosen student quantity", quantityInputRef().value);

    if (
      schoolSelectRef().value == "" ||
      quantityInputRef().value == "" ||
      classeSelectRef().value == "default" ||
      classeSelectRef().value == ""
    ) {
      return addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content: "Veuillez compléter tous les champs !",
      });
    } else {
      // TODO make request here
      props.close();
    }
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
      <div class="flex justify-between my-2">
        <SchoolSelect
          onChange={onChangeSchoolSelect}
          refSelectSetter={setSchoolSelectRef}
          schools={getSchools()}
        />

        <ButtonIcon icon={<CheckIcon />} onClick={validate} />
      </div>

      <div class="flex gap-1 w-[100%]">
        <ClasseSelection
          refSelectSetter={setClasseSelectRef}
          classes={selectedSchool()?.classes as ClasseType[]}
          onChange={onChangeSelectClasse}
        />
        <input
          ref={setQuantityInputRef}
          class="input-form w-full"
          min={0}
          value={0}
          type="number"
          placeholder="Quantité"
        />
      </div>
    </CardWrapper>
  );
}
