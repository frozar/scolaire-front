import { For } from "solid-js";
import { LineType, PointResourceType } from "../../../../type";
import { mapIdentityToResourceType } from "../line/busLinesUtils";

type TimelineItemType = {
  pointsResource: PointResourceType;
};

function TimelineItem(props: TimelineItemType) {
  return (
    <div class="v-timeline-item">
      <div class="v-timeline-item__body">
        <div class="d-flex">
          <div>
            <strong>{props.pointsResource.name}</strong>
          </div>
        </div>
      </div>
      <div class="v-timeline-divider">
        <div class="v-timeline-divider__before" />
        <div class="v-timeline-divider__dot v-timeline-divider__dot--size-small">
          <div class="v-timeline-divider__inner-dot bg-pink">
            <i class="" aria-hidden="true" />
          </div>
        </div>
        <div class="v-timeline-divider__after" />
      </div>
    </div>
  );
}

export default function (props: { line: LineType | undefined }) {
  return (
    <div class="timeline">
      <div
        class="v-timeline v-timeline--align-start v-timeline--justify-auto v-timeline--side-end v-timeline--vertical"
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={mapIdentityToResourceType(props.line?.stops)}>
          {/* TODO refactor de replace mapIdentityToResourceType */}
          {(stop) => <TimelineItem pointsResource={stop} />}
        </For>
      </div>
    </div>
  );
}
