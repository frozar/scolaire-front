import { TripType } from "../../../../_entities/trip.entity";
import TrashIcon from "../../../../icons/TrashIcon";
import UpdatePen from "../../../../icons/UpdatePen";
import { ViewManager } from "../../ViewManager";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import SchoolsEnumeration from "../../board/component/molecule/SchoolsEnumeration";

export function TripDetailsHeader(props: { trip: TripType }) {
  function onUpdate() {
    ViewManager.tripEdit(props.trip);
  }

  function onDelete() {
    console.log("go to delete");
  }
  return (
    <header>
      <div class="bus-trip-information-board-content-title">
        <div class="bus-trip-information-board-content-name">
          {props.trip.name}
        </div>
        <ButtonIcon icon={<UpdatePen />} onClick={onUpdate} />
        <ButtonIcon icon={<TrashIcon />} onClick={onDelete} />
      </div>
      <div class="bus-trip-information-board-content-schools">
        <SchoolsEnumeration
          schoolsName={props.trip.schools.map((school) => school.name) ?? []}
        />
      </div>
    </header>
  );
}

//TODO ancien btn delete
// function displayRemoveConfirmation() {
//     async function deleteTrip() {
//       const idToCheck = (selectedTrip() as TripType).id;
//       if (!idToCheck) return false;

//       const idToRemove: number = idToCheck;
//       const deletedTripId: number = await TripService.delete(idToRemove);

//       if (deletedTripId) {
//         changeBoard("trip");
//         MapElementUtils.deselectAllPointsAndBusTrips();

//         //TODO voir l'utilisation
//         LineStore.set((prev) =>
//           prev.map((line) => {
//             return {
//               ...line,
//               trips: line.trips.filter((trip) => trip.id != deletedTripId),
//             };
//           })
//         );
//         return true;
//       } else {
//         return false;
//       }
//     }
//     deselectAllPoints();
//     if ((selectedTrip() as TripType).id) {
//       setRemoveConfirmation({
//         textToDisplay: "Êtes-vous sûr de vouloir supprimer la course : ",
//         itemName: (selectedTrip() as TripType).name as string,
//         validate: deleteTrip,
//       });
//     }
//   }
