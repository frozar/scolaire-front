import { For, Show } from "solid-js";
import { useStateAction } from "../../../../StateAction";
import {
  AbstractLineType,
  LineType,
  PointResourceType,
} from "../../../../type";
import { mapIdentityToResourceType } from "../line/busLinesUtils";
import { TimelineRemovePointButton } from "./TimelineRemovePointButton";
const [, { isInAddLineMode }] = useStateAction();

export type TimelineItemType = {
  pointsResource: PointResourceType;
  indice: number;
  line: LineType | undefined;
};

function TimelineItem(props: TimelineItemType) {
  return (
    <div class="v-timeline-item">
      <div class="v-timeline-item__body">
        <div class="d-flex">
          <strong>{props.pointsResource.name}</strong>
        </div>
      </div>
      <div class="v-timeline-divider">
        <div class="v-timeline-divider__before" />
        <div class="v-timeline-divider__dot v-timeline-divider__dot--size-small">
          <div class="v-timeline-divider__inner-dot bg-pink">
            <i class="" aria-hidden="true" />
            <Show when={isInAddLineMode()}>
              <TimelineRemovePointButton {...props} />
            </Show>
          </div>
        </div>
        <div class="v-timeline-divider__after" />
        {/* TODO Add button to add point between points */}
      </div>
    </div>
  );
}

export default function (props: { line: AbstractLineType | undefined }) {
  return (
    <div class="timeline">
      <div
        class="v-timeline v-timeline--align-start v-timeline--justify-auto v-timeline--side-end v-timeline--vertical"
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={mapIdentityToResourceType(props.line?.stops)}>
          {/* TODO refactor de replace mapIdentityToResourceType */}
          {(stop, i) => (
            <TimelineItem
              pointsResource={stop}
              indice={i()}
              line={props.line}
            />
          )}
        </For>
      </div>
    </div>
  );
}
