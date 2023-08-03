import { For, Show } from "solid-js";
import { useStateAction } from "../../../../StateAction";
import {
  AbstractLineType,
  LineType,
  LineUnderConstructionType,
} from "../../../../type";
import { PointInterface } from "../component/atom/Point";
import { TimelineAddPointButton } from "../component/atom/TimelineAddPointButton";
import { TimelineRemovePointButton } from "../component/atom/TimelineRemovePointButton";
import { mapIdentityToResourceType } from "../line/busLinesUtils";
const [, { isInAddLineMode }] = useStateAction();
export type TimelineItemType = {
  pointsResource?: PointInterface;
  indice: number;
  line?: AbstractLineType | undefined;
  getter: () => LineUnderConstructionType | LineType;
  setter?: (line: LineUnderConstructionType) => void;
};

const [, { setLineUnderConstruction, getLineUnderConstruction }] =
  useStateAction();
function TimelineItem(props: TimelineItemType) {
  return (
    <div class="v-timeline-item">
      <div class="v-timeline-item__body">
        <div class="d-flex">
          <strong>
            {props.pointsResource?.name
              ? props.pointsResource?.name
              : "Selectionnez un point sur la carte"}
          </strong>
        </div>
      </div>

      <div class="v-timeline-divider">
        <div class="v-timeline-divider__before" />

        <div class="v-timeline-divider__dot v-timeline-divider__dot--size-small">
          <div class="v-timeline-divider__inner-dot bg-pink">
            <i class="" aria-hidden="true" />
            <Show when={props.pointsResource && isInAddLineMode()}>
              <TimelineRemovePointButton {...props} />
            </Show>
          </div>
        </div>

        <div class="v-timeline-divider__after" />
        <Show when={props.pointsResource && isInAddLineMode()}>
          <TimelineAddPointButton {...props} />
        </Show>
      </div>
    </div>
  );
}

export default function (props: { line: () => AbstractLineType }) {
  return (
    <div class="timeline">
      <div
        class="v-timeline v-timeline--align-start v-timeline--justify-auto v-timeline--side-end v-timeline--vertical"
        style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={mapIdentityToResourceType(props.line()?.stops)}>
          {/* TODO refactor de replace mapIdentityToResourceType */}
          {(stop, i) => (
            <>
              <Show
                when={
                  isInAddLineMode() &&
                  getLineUnderConstruction().nextIndex == i()
                }
              >
                <TimelineItem
                  indice={i()}
                  setter={setLineUnderConstruction}
                  getter={getLineUnderConstruction}
                />
              </Show>
              <TimelineItem
                pointsResource={stop}
                indice={i()}
                line={props.line()}
                setter={setLineUnderConstruction}
                getter={getLineUnderConstruction}
              />
            </>
          )}
        </For>
      </div>
    </div>
  );
}
