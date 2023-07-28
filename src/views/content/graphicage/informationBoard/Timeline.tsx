import { For } from "solid-js";
import { NatureEnum } from "../../../../type";

export type TimelineItemType = {
  nature: NatureEnum;
  name: string;
  quantity: number;
};

function TimelineItem(props: TimelineItemType) {
  // TODO: use color in tailwind theme ?
  // TODO: diff color depending on props.nature
  // const classBeginning = "v-timeline-divider__inner-dot";
  const classBeginning =
    "v-timeline-divider__dot v-timeline-divider__dot--size-small";

  // props.nature == NatureEnum.ramassage
  //   ? "+ " + props.quantity
  //   : "- " + props.quantity;
  return (
    <div class="v-timeline-item">
      <div class="v-timeline-item__body">
        <div class="d-flex">
          {/* <div class="me-4">{props.quantity}</div> */}
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
        {/* <div class="v-timeline-divider__dot v-timeline-divider__dot--size-small !bg-green-base"> */}
        <div
          class={
            props.nature == NatureEnum.ramassage
              ? classBeginning + " !bg-red-500"
              : classBeginning + " !bg-green-base"
          }
        >
          <div class="v-timeline-divider__inner-dot !bg-white">
            {/* <div
            class={
              props.nature == NatureEnum.ramassage
                ? classBeginning + " !bg-green-base"
                : classBeginning + " !bg-red-600"
            }
          > */}
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
          {(point) => (
            <TimelineItem
              nature={point.nature}
              name={point.name}
              quantity={point.quantity}
            />
          )}
        </For>
      </div>
    </div>
  );
}
