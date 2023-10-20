import { TripType } from "../../../../../_entities/trip.entity";
import { TripService } from "../../../../../_services/trip.service";
import TrashIcon from "../../../../../icons/TrashIcon";
import { setRemoveConfirmation } from "../../../../../userInformation/RemoveConfirmation";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { setLines } from "../../../map/component/organism/BusLines";
import { deselectAllPoints } from "../../../map/component/organism/Points";
import ButtonIcon from "../molecule/ButtonIcon";
import { changeBoard } from "../template/ContextManager";

export interface RemoveTripButtonProps {
  trip: TripType;
}

export default function (props: RemoveTripButtonProps) {
  async function deleteTrip() {
    const idToCheck = props.trip.id;
    if (!idToCheck) return false;

    const idToRemove: number = idToCheck;
    const deletedTripId: number = await TripService.delete(idToRemove);

    if (deletedTripId) {
      changeBoard("trip");
      MapElementUtils.deselectAllPointsAndBusTrips();

      setLines((prev) =>
        prev.map((line) => {
          return {
            ...line,
            trips: line.trips.filter((trip) => trip.id != deletedTripId),
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
    if (props.trip.id) {
      setRemoveConfirmation({
        textToDisplay: "Êtes-vous sûr de vouloir supprimer la course : ",
        itemName: props.trip.name as string,
        validate: deleteTrip,
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
