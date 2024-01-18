import { JSXElement } from "solid-js";
import PencilIcon from "../../../../../icons/PencilIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import { GradeUtils } from "../../../../../utils/grade.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { setOnBoard } from "../../../board/component/template/ContextManager";
import { selectedGrade } from "./GradeBoard";

// TODO: Refactor all read board headers css (trip, stop, school, grade)
import "./GradeBoardDetailsHeader.css";

export function GradeBoardDetailsHeader(): JSXElement {
  return (
    <header class="grade-detail-header">
      <div class="grade-detail-header-title">
        <p>{selectedGrade()?.name as string}</p>
        <div>
          <ButtonIcon
            icon={<PencilIcon />}
            onClick={() => setOnBoard("school-grade-modify")}
          />
          <ButtonIcon
            icon={<TrashIcon />}
            onClick={() => console.log("TODO delete")}
          />
        </div>
      </div>

      <p>
        {GradeUtils.getTotalQuantity(selectedGrade()?.id as number) + " élèves"}
      </p>
    </header>
  );
}
