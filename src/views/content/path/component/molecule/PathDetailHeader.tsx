import { useStateAction } from "../../../../../StateAction";
import { PathType } from "../../../../../_entities/path.entity";
import TrashIcon from "../../../../../icons/TrashIcon";
import UpdatePen from "../../../../../icons/UpdatePen";
import { setRemoveConfirmation } from "../../../../../userInformation/RemoveConfirmation";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { PathUtil } from "../../../../../utils/path.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { setCurrentTripIndex } from "../../../board/component/organism/DrawTripBoard";
import {
  changeBoard,
  toggleDrawMod,
} from "../../../board/component/template/ContextManager";
import {
  DrawPathStep,
  setCurrentDrawPath,
  setOnDrawPathStep,
} from "../drawPath.utils";
import { setSelectedPath } from "../organism/PathDetail";

const [, { setModeDrawTrip }] = useStateAction();

export function PathDetailHeader(props: { path: PathType }) {
  function onClickEditPath() {
    setCurrentDrawPath(props.path);
    setCurrentTripIndex(props.path.points.length);
    toggleDrawMod();
    setModeDrawTrip();
    changeBoard("path-draw");
    setOnDrawPathStep(DrawPathStep.editPath);
    MapElementUtils.deselectAllPointsAndBusTrips();
  }

  async function deletePath(): Promise<boolean> {
    const response = await PathUtil.deletePath(props.path?.id as number);
    setSelectedPath(undefined);
    changeBoard("trip");
    return response ?? false;
  }

  function onClickDelete() {
    setRemoveConfirmation({
      textToDisplay: "Êtes-vous sûr de vouloir supprimer la course : ",
      itemName: props.path.name,
      validate: deletePath,
    });
  }

  return (
    <header class="flex justify-between">
      <p class="text-2xl mb-4 mt-4 text-dark-teal;">{props.path.name}</p>
      <ButtonIcon icon={<UpdatePen />} onClick={onClickEditPath} />
      <ButtonIcon icon={<TrashIcon />} onClick={onClickDelete} />
    </header>
  );
}
