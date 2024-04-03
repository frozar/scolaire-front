import { TripType } from "../../../../../_entities/trip.entity";
import { TripUtils } from "../../../../../utils/trip.utils";
import CollapsibleElement from "../../../line/atom/CollapsibleElement";
import "./DisplayAllotmentAndVehicle.css";

export function DisplayAllotmentAndVehicle(props: { trip?: TripType }) {
  return (
    <CollapsibleElement title="Lot et type de véhicule">
      <div>
        <div class="text-container">
          <p class="text-bold">Allotissement:</p>
          <p class="text-standard">
            {TripUtils.tripAllotmentIdToString(props?.trip?.allotmentId)}
          </p>
        </div>
        <div class="text-container">
          <p class="text-bold">Type de véhicule:</p>
          <p class="text-standard">
            {TripUtils.tripBusIdToString(props?.trip?.busCategoriesId)}
          </p>
        </div>
      </div>
    </CollapsibleElement>
  );
}
