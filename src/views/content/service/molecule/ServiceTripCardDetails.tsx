import { For } from "solid-js";
import { TripDirectionEntity } from "../../../../_entities/trip-direction.entity";
import { TripType } from "../../../../_entities/trip.entity";
import { TripUtils } from "../../../../utils/trip.utils";
import { CalendarUtils } from "../../calendar/calendar.utils";
import "./ServiceTripCardDetails.css";

export function ServiceTripCardDetails(props: { trip: TripType }) {
  return (
    <div>
      <p>
        Direction :{" "}
        {TripUtils.tripDirectionTypeTofrench(
          TripDirectionEntity.FindDirectionById(props.trip.tripDirectionId).type
        )}
      </p>
      <div class="service-trip-card-details-days-container">
        <For each={props.trip.days}>
          {(day) => (
            <p class="service-trip-card-details-days">
              {CalendarUtils.dayToFrench(day)}
            </p>
          )}
        </For>
      </div>
    </div>
  );
}
