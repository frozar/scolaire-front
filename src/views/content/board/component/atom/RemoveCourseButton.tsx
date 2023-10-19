import { RaceType } from "../../../../../_entities/trip.entity";
import { RaceService } from "../../../../../_services/trip.service";
import TrashIcon from "../../../../../icons/TrashIcon";
import { setRemoveConfirmation } from "../../../../../userInformation/RemoveConfirmation";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { setLines } from "../../../map/component/organism/BusLines";
import { deselectAllPoints } from "../../../map/component/organism/Points";
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
    const deletedRaceId: number = await RaceService.delete(idToRemove);

    if (deletedRaceId) {
      changeBoard("course");
      MapElementUtils.deselectAllPointsAndBusRaces();

      setLines((prev) =>
        prev.map((line) => {
          return {
            ...line,
            courses: line.courses.filter(
              (course) => course.id != deletedRaceId
            ),
          };
        })
      );
      return true;
    } else {
      return false;
    }
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
