import { createSignal } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import PencilIcon from "../../../../../icons/PencilIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import InputSearch from "./InputSearch";
import "./SchoolDetailsHeader.css";

export default function (props: { school: SchoolType }) {
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>();

  const [editSchoolName, setEditSchoolName] = createSignal<boolean>(true);

  const editName = () => {
    setEditSchoolName((bool) => !bool);
    inputRef()?.focus();
  };

  function studentQuantity() {
    let quantity = 0;
    for (const stop of props.school.associated) {
      quantity += stop.quantity;
    }
    return quantity;
  }

  return (
    <header class="school-detail-header">
      <div class="school-detail-header-title">
        <input
          class="input-title"
          ref={setInputRef}
          type="text"
          value={props.school?.name}
          disabled={editSchoolName()}
        />

        <ButtonIcon icon={<PencilIcon />} onClick={editName} />
      </div>

      <p>élèves: {studentQuantity()}</p>

      <InputSearch
        onInput={() => {
          console.log("search for school classes / lines");
        }}
      />
    </header>
  );
}
