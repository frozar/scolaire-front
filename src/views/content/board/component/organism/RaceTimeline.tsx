import { Accessor, For, Setter, Show } from "solid-js";
import { RaceType } from "../../../../../_entities/race.entity";
import { RaceTimelineAddPointButton } from "../atom/RaceTimelineAddPointButton";
import { RaceTimelineItem } from "../atom/RaceTimelineItem";
import { onBoard } from "../template/ContextManager";

export function RaceTimeline(props: {
  race: Accessor<RaceType>;
  setRace?: Setter<RaceType>;
  inDraw: boolean;
}) {
  return (
    <div class="timeline">
      <div
        class="timeline-items "
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={props.race().points}>
          {(point, i) => (
            <div class="timeline-block">
              <Show when={onBoard() == "race-draw"}>
                <RaceTimelineAddPointButton indice={i()} />
              </Show>

              <RaceTimelineItem
                point={point}
                indice={i()}
                race={props.race}
                setRace={props.setRace}
              />
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
