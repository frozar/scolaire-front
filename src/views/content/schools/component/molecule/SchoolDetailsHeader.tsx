import { Show } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import CheckIcon from "../../../../../icons/CheckIcon";
import PencilIcon from "../../../../../icons/PencilIcon";
import { SchoolDetailUtils } from "../../../../../utils/school-details.utils";
import { SchoolUtils } from "../../../../../utils/school.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import {
  schoolDetailEditing,
  setSchoolDetailsItem,
} from "../organism/SchoolDetails";
import InputSearch from "./InputSearch";
import "./SchoolDetailsHeader.css";

export default function (props: { school: SchoolType }) {
  function onInput(value: string) {
    setSchoolDetailsItem((prev) => {
      if (!prev) return prev;
      return { ...prev, name: value };
    });
  }

  return (
    <header class="school-detail-header">
      <div class="school-detail-header-title">
        <input
          class="input-title"
          classList={{
            editing: !schoolDetailEditing(),
          }}
          type="text"
          value={props.school?.name}
          onInput={(event) => onInput(event.target.value)}
          disabled={!schoolDetailEditing()}
        />

        <Show
          when={!schoolDetailEditing()}
          fallback={
            <ButtonIcon
              icon={<CheckIcon />}
              onClick={SchoolDetailUtils.editSchoolDetail}
            />
          }
        >
          <ButtonIcon
            icon={<PencilIcon />}
            onClick={SchoolDetailUtils.editSchoolDetail}
          />
        </Show>
      </div>

      <p>
        {SchoolUtils.getRemainingQuantity(props.school.id)} élèves restants sur{" "}
        {SchoolUtils.getTotalQuantity(props.school.id)}
      </p>

      <InputSearch
        onInput={() => {
          console.log("search for school grades / lines");
        }}
      />
    </header>
  );
}
