import { For, createSignal } from "solid-js";
import CheckIcon from "../../../../../icons/CheckIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { getSchools } from "../../../map/component/organism/SchoolPoints";
import "./EditStop.css";

interface EditStopProps {
  close: () => void;
}

export default function (props: EditStopProps) {
  let selectedSchool;
  const [schoolSelectRef, setSchoolSelectRef] = createSignal<HTMLSelectElement>(
    document.createElement("select")
  );

  const [disabled, setDisabled] = createSignal<boolean>(true);

  const onChange = () => {
    selectedSchool = getSchools().filter(
      (school) => school.id == parseInt(schoolSelectRef().value)
    )[0];

    if (selectedSchool) setDisabled((bool) => !bool);
  };

  function validate() {
    console.log("Ajout d'une école", schoolSelectRef().value);
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
        <select disabled={disabled()}>
          <option value="default">Selectionner une classe</option>
        </select>
        <input
          class="input-form"
          type="number"
          placeholder="Elève à ramasser"
          disabled={disabled()}
        />
      </div>
    </div>
  );
}
