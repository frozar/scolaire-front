import { For, createSignal } from "solid-js";
import { useStateGui } from "../../../../StateGui";
import { EleveVersEtablissementType, NatureEnum } from "../../../../type";
import { fetchEleveVersEtablissement } from "../point.service";

const [, { getActiveMapId }] = useStateGui();

export const [eleveVersEtablissementData, setEleveVersEtablissementData] =
  createSignal<EleveVersEtablissementType[]>(
    await fetchEleveVersEtablissement(getActiveMapId() as number)
  );

export type TimelineItemType = {
  nature: NatureEnum;
  name: string;
  quantity: number;
};

function TimelineItem(props: TimelineItemType) {
  const timelineCircleClass =
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
              ? timelineCircleClass + " !bg-red-500"
              : timelineCircleClass + " !bg-green-base"
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

export default function (props: { item: TimelineItemType[] }) {
  return (
    <div class="timeline">
      <div
        class="v-timeline v-timeline--align-start v-timeline--justify-auto v-timeline--side-end v-timeline--vertical"
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={props.item}>
          {(point) => {
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
