import { For, JSXElement } from "solid-js";
import { TripDirectionEntity } from "../../../../../_entities/trip-direction.entity";
import { TripType } from "../../../../../_entities/trip.entity";
import { TripUtils } from "../../../../../utils/trip.utils";
import { CalendarUtils } from "../../../calendar/calendar.utils";
import CollapsibleElement from "./CollapsibleElement";

interface DisplayTripDaysAndDirectionProps {
  trip?: TripType;
}

export function DisplayTripDaysAndDirection(
  props: DisplayTripDaysAndDirectionProps
): JSXElement {
  return (
    <CollapsibleElement title="Jours et direction assignés à la course">
      <div class="flex items-center gap-1">
        <p class="font-bold text-sm">Direction:</p>
        <p class="text-sm">
          {TripUtils.tripDirectionTypeTofrench(
            TripDirectionEntity.FindDirectionById(props?.trip?.tripDirectionId)
              .type
          )}
        </p>
      </div>
      <p class="font-bold text-sm">Jours:</p>
      <div class="flex gap-3">
        <For each={props?.trip?.days}>
          {(day) => <p class="text-sm">{CalendarUtils.dayToFrench(day)}</p>}
        </For>
      </div>
    </CollapsibleElement>
  );
}
