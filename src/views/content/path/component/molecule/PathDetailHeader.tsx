import { useStateAction } from "../../../../../StateAction";
import { PathType } from "../../../../../_entities/path.entity";
import TrashIcon from "../../../../../icons/TrashIcon";
import UpdatePen from "../../../../../icons/UpdatePen";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import {
  changeBoard,
  toggleDrawMod,
} from "../../../board/component/template/ContextManager";
import {
  DrawPathStep,
  setCurrentDrawPath,
  setOnDrawPathStep,
} from "../drawPath.utils";

const [, { setModeDrawTrip }] = useStateAction();

export function PathDetailHeader(props: { path: PathType }) {
  function editPath() {
    toggleDrawMod();
    setModeDrawTrip();
    changeBoard("path-draw");
    setCurrentDrawPath(props.path);
    setOnDrawPathStep(DrawPathStep.editPath);

    MapElementUtils.deselectAllPointsAndBusTrips();
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
