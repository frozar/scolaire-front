import { For, JSXElement } from "solid-js";
import { TripDirectionEntity } from "../../../../../_entities/trip-direction.entity";
import { TripUtils } from "../../../../../utils/trip.utils";
import { CalendarUtils } from "../../../calendar/calendar.utils";
import { selectedTrip } from "../../../map/component/organism/Trips";
import CollapsibleElement from "./CollapsibleElement";

export function DisplayTripDaysAndDirection(): JSXElement {
  return (
    <CollapsibleElement title="Jours et direction assigné à la course">
      <div class="flex items-center gap-1">
        <p class="font-bold text-sm">Direction:</p>
        <p class="text-sm">
          {TripUtils.tripDirectionTypeTofrench(
            TripDirectionEntity.findTripById(
              selectedTrip()?.tripDirectionId as number
            ).type
          )}
        </p>
      </div>
      <p class="font-bold text-sm">Jours:</p>
      <div class="flex gap-3">
        <For each={selectedTrip()?.days}>
          {(day) => <p class="text-sm">{CalendarUtils.dayToFrench(day)}</p>}
        </For>
      </div>
    </CollapsibleElement>
  );
}
