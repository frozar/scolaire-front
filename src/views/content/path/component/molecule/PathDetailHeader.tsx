import { PathType } from "../../../../../_entities/path.entity";
import TrashIcon from "../../../../../icons/TrashIcon";
import UpdatePen from "../../../../../icons/UpdatePen";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import {
  DrawPathStep,
  setCurrentDrawPath,
  setOnDrawPathStep,
} from "../drawPath.utils";

export function PathDetailHeader(props: { path: PathType }) {
  function editPath() {
    setCurrentDrawPath(props.path);
    changeBoard("path-draw");
    setOnDrawPathStep(DrawPathStep.editPath);

    console.log("TODO: update");
  }

  function deletePath() {
    console.log("TODO: delete");
  }

  return (
    <header class="flex justify-between">
      <p class="text-2xl mb-4 mt-4 text-dark-teal;">{props.path.name}</p>
      <ButtonIcon icon={<UpdatePen />} onClick={editPath} />
      <ButtonIcon icon={<TrashIcon />} onClick={deletePath} />
    </header>
  );
}
