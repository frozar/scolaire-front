import { For, Setter, Show, onMount } from "solid-js";
import { SchoolType } from "../../../../_entities/school.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../../_entities/trip-direction.entity";
import { TripPointType, TripType } from "../../../../_entities/trip.entity";
import { SchoolStore } from "../../../../_stores/school.store";
import { NatureEnum } from "../../../../type";
import { TripTimelineAddPointButton } from "../../board/component/atom/TripTimelineAddPointButton";
import { TripTimelinePoint } from "../molecule/TripTimelinePoint";

interface TripTimelineProps {
  trip: TripType;
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

  return (
    <div class="timeline">
      <div
        class="timeline-items "
        // style={{ "--v-timeline-line-thickness": "2px" }}
      >
        <For each={props.trip.tripPoints}>
          {(point, i) => {
            /**
             * Define the trip time
             */
            if (i() == 0) {
              currentPassageTime = 0;
              accumulateQuantity = 0;
            } else {
              currentPassageTime += props.trip.tripPoints[i() - 1].waitingTime;
            }
            currentPassageTime += props.trip.tripPoints[i()].passageTime;

            const quantity = getSignedPointQuantity(point, props.trip);
            accumulateQuantity += calcAccumulateQuantity(quantity);

            return (
              <div class="timeline-block">
                <Show when={props.inDraw}>
                  <TripTimelineAddPointButton indice={i()} />
                </Show>

                <TripTimelinePoint
                  point={point}
                  tripColor={props.trip.color}
                  passageTime={currentPassageTime}
                  quantity={quantity}
                  accumulateQuantity={accumulateQuantity}
                />
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
  const school = SchoolStore.get(point.id) as SchoolType;
  const schoolGradesId: number[] = school.grades.map(
    (grade) => grade.id as number
  );

  for (const tripPoint of trip.tripPoints) {
    for (const grade of tripPoint.grades) {
      if (schoolGradesId.includes(grade.gradeId)) {
        output += grade.quantity;
      }
    }
  }

  return output;
}

function getStopQuantity(point: TripPointType) {
  return point.grades
    .map((grade) => grade.quantity)
    .reduce((total, quantity) => total + quantity, 0);
}
