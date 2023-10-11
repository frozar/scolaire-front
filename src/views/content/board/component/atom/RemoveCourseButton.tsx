import { RaceType } from "../../../../../_entities/race.entity";
import { BusRaceService } from "../../../../../_services/course.service";
import TrashIcon from "../../../../../icons/TrashIcon";
import { addNewUserInformation } from "../../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../../type";
import { setRemoveConfirmation } from "../../../../../userInformation/RemoveConfirmation";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import { getRaces, setRaces } from "../../../map/component/organism/Races";
import ButtonIcon from "../molecule/ButtonIcon";
import { changeBoard } from "../template/ContextManager";

export interface RemoveRaceButtonProps {
  course: RaceType;
}

export default function (props: RemoveRaceButtonProps) {
  async function deleteRace() {
    const idToCheck = props.course.id;
    if (!idToCheck) {
      return;
    }

    const idToRemove: number = idToCheck;
    const isDeleted: boolean = await BusRaceService.delete(idToRemove);

    if (isDeleted) {
      setRaces(getRaces.filter((line) => line.id != idToRemove));

      // TODO: Refactor ?
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.success,
        type: MessageTypeEnum.global,
        content: "La course a bien été supprimée.",
      });
    } else {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.removeRace,
        content: "Impossible de supprimer la ligne de bus.",
      });
    }
    changeBoard("line");
    MapElementUtils.deselectAllPointsAndBusRaces();
  }
  const onclick = () => {
    deselectAllPoints();
    if (props.course.id) {
      setRemoveConfirmation({
        textToDisplay: "Êtes-vous sûr de vouloir supprimer la course",
        itemName: props.course.name as string,
        validate: deleteRace,
      });
    }
  };

  return (
    <ButtonIcon
      icon={<TrashIcon />}
      onClick={onclick}
      class="graphicage-draw-update-button"
    />
  );
}
