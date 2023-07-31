import { For } from "solid-js";
import { NatureEnum } from "../../../../type";

export type TimelineItemType = {
  nature: NatureEnum;
  name: string;
  quantity: number;
};

function TimelineItem(props: TimelineItemType) {
  // TODO: use color in tailwind theme ?
  const classBeginning =
    "v-timeline-divider__dot v-timeline-divider__dot--size-small";

  return (
    <div class="v-timeline-item">
      <div class="v-timeline-item__body">
        <div class="d-flex">
          <div class="me-4">
            {props.nature == NatureEnum.ramassage
              ? "+ " + props.quantity
              : "- " + props.quantity}
          </div>
          <div>
            <strong>{props.name}</strong>
          </div>
        </div>
      </div>
      <div class="v-timeline-divider">
        <div class="v-timeline-divider__before" />
        <div
          class={
            props.nature == NatureEnum.ramassage
              ? classBeginning + " !bg-red-500"
              : classBeginning + " !bg-green-base"
          }
        >
          <div class="v-timeline-divider__inner-dot !bg-white">
            <i class="" aria-hidden="true" />
          </div>
        </div>
        <div class="v-timeline-divider__after" />
      </div>
    </div>
  );
}

export default function (props: { point: TimelineItemType[] }) {
  return (
    <div class="timeline">
      <div
        class="v-timeline v-timeline--align-start v-timeline--justify-auto v-timeline--side-end v-timeline--vertical"
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={props.point}>
          {(point) => {
            // console.log("for each of timeline", point);
            return (
              <TimelineItem
                nature={point.nature}
                name={point.name}
                quantity={point.quantity}
              />
            );
          }}
        </For>
      </div>
    </div>
  );
}
