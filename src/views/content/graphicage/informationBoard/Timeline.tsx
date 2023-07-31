import { FaRegularTrashCan, FaSolidPlus } from "solid-icons/fa";
import { For, Show } from "solid-js";
import { useStateAction } from "../../../../StateAction";
import { LineType, PointResourceType } from "../../../../type";
import { mapIdentityToResourceType } from "../line/busLinesUtils";
const [, { isInAddLineMode }] = useStateAction();
const [, { setLineUnderConstruction, getLineUnderConstruction }] =
  useStateAction();
type TimelineItemType = {
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
              <button
                class="button-delete"
                onClick={() => {
                  const a = [...getLineUnderConstruction().stops];
                  a.splice(props.indice, 1);
                  setLineUnderConstruction({
                    ...getLineUnderConstruction(),
                    stops: a,
                  });
                }}
              >
                <FaRegularTrashCan />
              </button>
            </Show>
          </div>
        </div>
        <div class="v-timeline-divider__after" />
        <Show when={isInAddLineMode()}>
          <button
            class="w-full h-1/3"
            onClick={() => {
              console.log("test2");
              setLineUnderConstruction({
                ...getLineUnderConstruction(),
                currentIndex: props.indice,
              });
              // props.line.stops.splice(props.indice, 0, i);
            }}
          >
            <FaSolidPlus />
          </button>
        </Show>
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
