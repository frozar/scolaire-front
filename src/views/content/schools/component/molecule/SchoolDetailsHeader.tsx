import { createSignal } from "solid-js";
import {
  SchoolEntity,
  SchoolType,
} from "../../../../../_entities/school.entity";
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

      <p>{SchoolEntity.studentQuantity(props.school)} élèves</p>

      <InputSearch
        onInput={() => {
          console.log("search for school classes / lines");
        }}
      />
    </header>
  );
}
