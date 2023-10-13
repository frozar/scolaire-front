import { RaceType } from "../../../../../_entities/race.entity";
import { RaceService } from "../../../../../_services/race.service";
import TrashIcon from "../../../../../icons/TrashIcon";
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
    if (!idToCheck) return false;

    const idToRemove: number = idToCheck;
    const isDeleted: boolean = await RaceService.delete(idToRemove);

    if (isDeleted) {
      setRaces(getRaces.filter((line) => line.id != idToRemove));
    }

    changeBoard("line");
    MapElementUtils.deselectAllPointsAndBusRaces();
    return isDeleted;
  }
  const onclick = () => {
    deselectAllPoints();
    if (props.course.id) {
      setRemoveConfirmation({
        textToDisplay: "Êtes-vous sûr de vouloir supprimer la course : ",
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
