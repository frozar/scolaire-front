import { Accessor, For, Setter, Show, createEffect, onMount } from "solid-js";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../../_entities/trip-direction.entity";
import { TripPointType, TripType } from "../../../../_entities/trip.entity";
import { NatureEnum } from "../../../../type";
import { TripTimelineAddPointButton } from "../../board/component/atom/TripTimelineAddPointButton";
import { TimelineMenu } from "../molecule/TimelineMenu";
import { TripTimelinePoint } from "../molecule/TripTimelinePoint";

interface TripTimelineProps {
  tripPoints: TripPointType[];
  trip: Accessor<TripType>;
  setTrip: Setter<TripType>;
  inDraw: boolean;
}

export function TripTimeline(props: TripTimelineProps) {
  let currentPassageTime = 0;
  let accumulateQuantity = 0;

  onMount(() => {
    //TODO
    // currentPassageTime = props.trip.startTime ?? 0;
  });
  createEffect(() => {
    console.log(props.trip());
  });
  function updateWaitingTime(point: TripPointType, waitingTime: number) {
    props.setTrip((prev) => {
      const tripPoints = [...prev.tripPoints];
      for (const tripPoint of tripPoints) {
        if (tripPoint.leafletId == point.leafletId) {
          tripPoint.waitingTime = waitingTime;
        }
      }
      return { ...prev, tripPoints: tripPoints };
    });
  }

  return (
    <div class="timeline">
      <div
        class="timeline-items "
        // style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={props.tripPoints}>
          {(point, i) => {
            if (i() == 0) {
              currentPassageTime = 0;
              accumulateQuantity = 0;
            } else {
              currentPassageTime += props.tripPoints[i() - 1].waitingTime;
            }
            currentPassageTime += props.tripPoints[i()].passageTime;
            console.log(props.tripPoints[i()].waitingTime);

            const quantity = getSignedPointQuantity(point, props.trip());
            accumulateQuantity += calcAccumulateQuantity(quantity);

            return (
              <div class="timeline-block">
                <Show when={props.inDraw}>
                  <TripTimelineAddPointButton indice={i()} />
                </Show>

                <TripTimelinePoint
                  point={point}
                  tripColor={props.trip().color}
                  passageTime={currentPassageTime}
                  quantity={quantity}
                  accumulateQuantity={accumulateQuantity}
                >
                  <TimelineMenu
                    onClickDeletePoint={() => {}}
                    onClickWaitingTime={(waitingTime) =>
                      updateWaitingTime(point, waitingTime)
                    }
                    waitingTime={point.waitingTime}
                    // onClickDeletePoint={props.onClickRemovePointFromTrip}
                    // onClickWaitingTime={props.onClickWaitingTime}
                    // waitingTime={props.waitingTime}
                  />
                </TripTimelinePoint>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}

function calcAccumulateQuantity(pointQuantity: string): number {
  return parseInt(pointQuantity);
}

function getSignedPointQuantity(point: TripPointType, trip: TripType): string {
  return getQuantitySign(point, trip) + getPointQuantity(point, trip);
}
function getQuantitySign(point: TripPointType, trip: TripType) {
  if (
    (TripDirectionEntity.findEnumById(trip.tripDirectionId) ==
      TripDirectionEnum.going &&
      point.nature == NatureEnum.stop) ||
    (TripDirectionEntity.findEnumById(trip.tripDirectionId) ==
      TripDirectionEnum.coming &&
      point.nature == NatureEnum.school)
  ) {
    return "+";
  } else if (
    (TripDirectionEntity.findEnumById(trip.tripDirectionId) ==
      TripDirectionEnum.going &&
      point.nature == NatureEnum.school) ||
    (TripDirectionEntity.findEnumById(trip.tripDirectionId) ==
      TripDirectionEnum.coming &&
      point.nature == NatureEnum.stop)
  ) {
    return "-";
  }

  return "";
}

function getPointQuantity(point: TripPointType, trip: TripType) {
  if (point.nature == NatureEnum.school) {
    return getSchoolQuantity(point, trip);
  } else {
    return getStopQuantity(point);
  }
}

function getSchoolQuantity(point: TripPointType, trip: TripType) {
  let output = 0;
  // const school = SchoolStore.get(point.id) as SchoolType;
  // const schoolGradesId: number[] = school.grades.map(
  //   (grade) => grade.id as number
  // );

  // for (const tripPoint of trip.tripPoints) {
  //   for (const grade of tripPoint.grades) {
  //     if (schoolGradesId.includes(grade.gradeId)) {
  //       output += grade.quantity;
  //     }
  //   }
  // }

  return output;
}

function getStopQuantity(point: TripPointType) {
  return point.grades
    .map((grade) => grade.quantity)
    .reduce((total, quantity) => total + quantity, 0);
}
