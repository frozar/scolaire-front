import { For, Setter, Show } from "solid-js";
import { TripType } from "../../../../../_entities/trip.entity";
import { TripTimelineAddPointButton } from "../atom/TripTimelineAddPointButton";
import { TripTimelineItem } from "../atom/TripTimelineItem";
import { onBoard } from "../template/ContextManager";

export function TripTimeline(props: {
  trip: TripType;
  setTrip?: Setter<TripType>;
  inDraw: boolean;
}) {
  return (
    <div class="timeline">
      <div
        class="timeline-items "
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={props.trip.tripPoints}>
          {(point, i) => (
            <div class="timeline-block">
              <Show when={onBoard() == "trip-draw"}>
                <TripTimelineAddPointButton indice={i()} />
              </Show>

              <TripTimelineItem
                point={point}
                indice={i()}
                trip={props.trip}
                setTrip={props.setTrip}
              />
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
