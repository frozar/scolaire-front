import { FaSolidPen } from "solid-icons/fa";
import { createSignal } from "solid-js";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { schoolDetailsItem } from "../organism/SchoolDetails";
import InputSearch from "./InputSearch";

export default function () {
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>();

  const [editSchoolName, setEditSchoolName] = createSignal<boolean>(true);

  const editName = () => {
    setEditSchoolName((bool) => !bool);
    inputRef()?.focus();
  };

  return (
    <header>
      <div class="flex justify-between my-4">
        <input
          ref={setInputRef}
          type="text"
          value={schoolDetailsItem()?.name}
          disabled={editSchoolName()}
        />

        <ButtonIcon icon={<FaSolidPen />} onClick={editName} />
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
