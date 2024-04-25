import { For, JSXElement } from "solid-js";
import { TripDirectionEntity } from "../../../../_entities/trip-direction.entity";
import { TripType } from "../../../../_entities/trip.entity";
import { TripUtils } from "../../../../utils/trip.utils";
import { CalendarUtils } from "../../calendar/calendar.utils";

import "./DisplayTripDaysAndDirection.css";

interface DisplayTripDaysAndDirectionProps {
  trip: TripType;
}

export function DisplayTripDaysAndDirection(
  props: DisplayTripDaysAndDirectionProps
): JSXElement {
  return (
    <section class="display-trip-direction-and-days">
      <section class="direction">
        <span class="title">Direction :</span>
        <span class="content">
          {TripUtils.tripDirectionTypeTofrench(
            TripDirectionEntity.FindDirectionById(props.trip.tripDirectionId)
              .type
          )}
        </span>
      </section>
      <section class="days">
        <span class="title">Jours :</span>
        <div class="content">
          <For each={props.trip.days}>
            {(day) => <span class="day">{CalendarUtils.dayToFrench(day)}</span>}
          </For>
        </div>
      </section>
    </section>
  );
}
