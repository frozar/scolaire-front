import { createSignal } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { ServiceUtils } from "../../../../../_services/_utils.service";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import CheckIcon from "../../../../../icons/CheckIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { getSchools } from "../../../map/component/organism/SchoolPoints";
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

  const [quantityInputRef, setQuantityInputRef] =
    createSignal<HTMLInputElement>(document.createElement("input"));

  const onChange = () => {
    selectedSchool = getSchools().filter(
      (school) => school.id == parseInt(schoolSelectRef().value)
    )[0];

    if (selectedSchool) setDisabled((bool) => !bool);
  };

  // TODO review with classe
  async function validate() {
    const response = await ServiceUtils.post("/student-to-school", {
      school_id: selectedSchool.id,
      stop_id: props.stopID,
      quantity: quantityInputRef().value,
    });

    console.log(response);

    props.close();
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

      <div class="flex gap-1 w-[90%]">
        {/* TODO Review to add loop on school classe */}
        <select disabled={disabled()}>
          <option value="default">Selectionner une classe</option>
        </select>

        <input
          ref={setQuantityInputRef}
          class="input-form"
          type="number"
          placeholder="Quantité"
          disabled={disabled()}
        />
      </div>
    </CardWrapper>
  );
}
