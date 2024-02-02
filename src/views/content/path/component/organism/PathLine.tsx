import { For, JSXElement } from "solid-js";
import { PathPointType, PathType } from "../../../../../_entities/path.entity";
import { NatureEnum } from "../../../../../type";
import { PathUtil } from "../../../../../utils/path.utils";
import { getSelectedLine } from "../../../map/component/organism/BusLines";

interface PathLineProps {
  path: PathType;
}

export function PathTimeLine(props: PathLineProps) {
  return (
    <div>
      <For each={props.path.points}>
        {(point) => (
          <div class="timeline-block">
            {/* <Show when={onBoard() == "trip-draw"}>
              <TripTimelineAddPointButton indice={i()} />
            </Show> */}

            <PathTimeLineItem point={point} grades={props.path.grades} />
          </div>
        )}
      </For>
    </div>
  );
}

interface LineItemProps {
  point: PathPointType;
  grades: number[];
}

function PathTimeLineItem(props: LineItemProps): JSXElement {
  // eslint-disable-next-line solid/reactivity
  const point = PathUtil.getPathPoint(props.point);
  // eslint-disable-next-line solid/reactivity
  const quantity = PathUtil.getQuantityOfPoint(point, props.grades);

  console.log("point:", point);
  console.log("selected line:", getSelectedLine());

  const pointColor = () =>
    props.point.nature == NatureEnum.stop ? " !bg-dark-teal" : " !bg-red-base";

  return (
    <div class="v-timeline-item">
      <div class="v-timeline-item__body">
        <div class="d-flex">
          <div class="first-items">
            <div class="me-4">{quantity}</div>
            <p class="resource-name">{point.name}</p>
          </div>
          {/* <div class="ms-4">{props.calculatedQuantity}</div> */}
        </div>
      </div>

      <div class="v-timeline-divider">
        <div class="v-timeline-divider__before" />
        <div
          class={
            "v-timeline-divider__dot v-timeline-divider__dot--size-small" +
            pointColor()
          }
        >
          <div class={"v-timeline-divider__inner-dot " + pointColor()}>
            <i class="" aria-hidden="true" />
            {/* <Show
              when={
                currentStep() == DrawTripStep.editTrip ||
                currentStep() == DrawTripStep.buildReverse
              }
            >
              <TripTimelineRemovePointButton
                onClick={props.onClickRemovePointFromTrip}
              />
            </Show> */}
          </div>
        </div>

        <div class="v-timeline-divider__after" />
      </div>
      {/* <Show
        when={
          currentStep() == DrawTripStep.initial ||
          displayTripMode() == displayTripModeEnum.onRoad
        }
      >
        <p class="time-passage">{props.timePassage}</p>
      </Show> */}
    </div>
  );
}
