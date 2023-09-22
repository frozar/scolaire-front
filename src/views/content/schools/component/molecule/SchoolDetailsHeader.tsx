import { createSignal } from "solid-js";
import PencilIcon from "../../../../../icons/PencilIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { schoolDetailsItem } from "../organism/SchoolDetails";
import InputSearch from "./InputSearch";
import "./SchoolDetailsHeader.css";

export default function () {
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>();

  const [editSchoolName, setEditSchoolName] = createSignal<boolean>(true);

  const editName = () => {
    setEditSchoolName((bool) => !bool);
    inputRef()?.focus();
  };

  return (
    <header class="school-detail-header">
      <div class="school-detail-header-title">
        <input
          class="input-title"
          ref={setInputRef}
          type="text"
          value={schoolDetailsItem()?.name}
          disabled={editSchoolName()}
        />

        <ButtonIcon icon={<PencilIcon />} onClick={editName} />
      </div>

      <p>élèves: Todo</p>

      <InputSearch
        onInput={() => {
          console.log("search for school classes / lines");
        }}
      />
    </header>
  );
}
