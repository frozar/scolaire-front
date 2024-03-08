import { Show } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import PencilIcon from "../../../../../icons/PencilIcon";
import { SchoolDetailUtils } from "../../../../../utils/school-details.utils";
import { SchoolUtils } from "../../../../../utils/school.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import {
  schoolDetailEditing,
  setSchoolDetails,
} from "../template/SchoolDetails";
import "./SchoolDetailsHeader.css";

export default function (props: { school: SchoolType }) {
  function onInput(value: string) {
    setSchoolDetails((prev) => {
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

        <Show when={!schoolDetailEditing()}>
          <ButtonIcon icon={<PencilIcon />} onClick={SchoolDetailUtils.edit} />
        </Show>
      </div>

      <p>
        {"L'école compte " +
          SchoolUtils.getTotalQuantity(props.school.id) +
          " élèves"}
      </p>
    </header>
  );
}
