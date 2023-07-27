import { For } from "solid-js";

export type TimelineItemType = {
  name: string;
  quantity: number;
};

function TimelineItem(props: TimelineItemType) {
  return (
    <div class="v-timeline-item">
      <div class="v-timeline-item__body">
        <div class="d-flex">
          <div class="me-4">{props.quantity}</div>
          <div>
            <strong>{props.name}</strong>
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
// TODO: Rename
// export default function (props: TimelineItemType[]) {
export default function (props: {
  point: { name: string; quantity: number }[];
}) {
  // TODO: Delete
  // const [local] = splitProps(props, ["stopNames"]);
  console.log("props=> ", props);

  return (
    <div class="timeline">
      <div
        class="v-timeline v-timeline--align-start v-timeline--justify-auto v-timeline--side-end v-timeline--vertical"
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={props.point}>
          {(point) => (
            <TimelineItem name={point.name} quantity={point.quantity} />
          )}
        </For>
      </div>
    </div>
  );
}
