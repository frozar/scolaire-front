import { createSignal } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import CheckIcon from "../../../../../icons/CheckIcon";
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
  let selectedSchool: SchoolType;
  const [disabled, setDisabled] = createSignal<boolean>(true);
  const [schoolSelectRef, setSchoolSelectRef] = createSignal<HTMLSelectElement>(
    document.createElement("select")
  );
  const [classeSelectRef, setClasseSelectRef] = createSignal<HTMLSelectElement>(
    document.createElement("select")
  );

  const [quantityInputRef, setQuantityInputRef] =
    createSignal<HTMLInputElement>(document.createElement("input"));

  const onChange = () => {
    selectedSchool = getSchools().filter(
      (school) => school.id == parseInt(schoolSelectRef().value)
    )[0];

    if (selectedSchool) setDisabled((bool) => !bool);
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

    props.close();
  }

  function onChangeSelectClasse() {
    console.log("on change classe select");
  }
  return (
    <CardWrapper class="edit-stop">
      <div class="flex justify-between my-2">
        <SchoolSelect
          onChange={onChange}
          refSelectSetter={setSchoolSelectRef}
          schools={getSchools()}
        />

        <ButtonIcon icon={<CheckIcon />} onClick={validate} />
      </div>

      <div class="flex gap-1 w-[100%]">
        {/* TODO Review to add loop on school classe */}
        <ClasseSelection
          refSelectSetter={setClasseSelectRef}
          classes={[]}
          onChange={onChangeSelectClasse}
          disabled={disabled()}
        />
        <input
          ref={setQuantityInputRef}
          class="input-form w-full"
          min={0}
          type="number"
          placeholder="Quantité"
          disabled={disabled()}
        />
      </div>
    </CardWrapper>
  );
}
