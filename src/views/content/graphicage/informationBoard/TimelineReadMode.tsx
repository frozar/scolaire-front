import { For } from "solid-js";
import { LineType } from "../../../../type";
import TimelineItemReadMode from "../component/atom/TimelineItemReadMode";
import { mapIdentityToResourceType } from "../line/busLinesUtils";

export default function (props: { line: () => LineType | undefined }) {
  return (
    <div class="timeline">
      <div
        class="v-timeline v-timeline--align-start v-timeline--justify-auto v-timeline--side-end v-timeline--vertical"
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={mapIdentityToResourceType(props.line()?.stops)}>
          {(stop) => (
            <>
              <TimelineItemReadMode pointsResource={stop} getter={props.line} />
            </>
          )}
        </For>
      </div>
    </div>
  );
}
