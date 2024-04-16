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
