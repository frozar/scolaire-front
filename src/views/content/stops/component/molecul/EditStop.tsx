import { For, createSignal } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { ServiceUtils } from "../../../../../_services/_utils.service";
import CheckIcon from "../../../../../icons/CheckIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { getSchools } from "../../../map/component/organism/SchoolPoints";
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
    <div class="edit-stop">
      <div class="flex justify-between my-2">
        <select
          name="school-select"
          onChange={onChange}
          ref={setSchoolSelectRef}
        >
          <option value="default">Choisir une école</option>
          <For each={getSchools()}>
            {(school) => <option value={school.id}>{school.name}</option>}
          </For>
        </select>

        <ButtonIcon icon={<CheckIcon />} onClick={validate} />
      </div>

      <div class="flex gap-1">
        {/* TODO Review to add loop on school classe */}
        <select disabled={disabled()}>
          <option value="default">Selectionner une classe</option>
        </select>

        <input
          ref={setQuantityInputRef}
          class="input-form"
          type="number"
          placeholder="Elève à ramasser"
          disabled={disabled()}
        />
      </div>
    </div>
  );
}
