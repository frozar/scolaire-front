import { createEffect, createSignal, onMount } from "solid-js";
import { RulesType } from "../../../../_entities/calendar.entity";
import { GradeType } from "../../../../_entities/grade.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../../_entities/trip-direction.entity";
import { TripType } from "../../../../_entities/trip.entity";
import { TripDirectionsButton } from "../../board/component/molecule/TripDirectionsButton";

type tripDaysAndDirectionType = {
  keep: boolean;
} & RulesType;

const [tripDaysAndDirection, setTripDaysAndDirection] = createSignal<
  tripDaysAndDirectionType[]
>([]);

const [onTripDirection, setOnTripDirection] = createSignal<TripDirectionEnum>(
  TripDirectionEnum.coming
);

// TODO review this entire file for facto and simplification
export function AssignDaysAndDirectionStep(props: {
  grades: GradeType[];
  trip: TripType;
  onUpdateDirection: (direction: TripDirectionEnum) => void;
}) {
  const checked: GradeType[] = [];
  const rulesList: RulesType[][] = [];

  onMount(() => {
    setOnTripDirection(
      TripDirectionEntity.findEnumById(props.trip.tripDirectionId)
    );
  });

  createEffect(() => {
    props.onUpdateDirection(onTripDirection());
  });

  // createEffect(() => { console.log(trip)
  //   setCommonDay([]);
  //   checked = [];
  //   rulesList = [];

  //   getCommonDay();
  //   processTripDirection();
  // });

  return (
    <div class="mt-5">
      <p class="font-bold mb-3">Jours assignées à la course</p>

      <TripDirectionsButton
        onClickComing={() => setOnTripDirection(TripDirectionEnum.coming)}
        onClickGoing={() => setOnTripDirection(TripDirectionEnum.going)}
        onDirection={onTripDirection()}
      />

      {/* <For each={tripDaysAndDirection()}>
        {(day) => (
          <LabeledCheckbox
            checked={day.keep}
            label={CalendarUtils.dayToFrench(day.day)}
            for={day.day}
            onChange={() => {
              setTripDaysAndDirection((prev) => {
                const datas = [...prev];
                datas.map((item) => {
                  if (item.day == day.day) {
                    item.keep = !item.keep;
                  }
                });
                return datas;
              });
            }}
          />
        )}
      </For> */}
    </div>
  );
}

// function getCommonDay() {
//   const calendars = checked.flatMap((item) => item.calendar);
//   for (const calendar of calendars)
//     rulesList.push(calendar?.rules.map((item) => item) ?? []);

//   const everyDayRule = rulesList.flatMap((item) => item.map((item) => item));
//   const weekDays = Object.values(CalendarDayEnum);

//   weekDays.forEach((day) => {
//     const occurance = everyDayRule.filter((item) => item.day == day);
//     if (occurance.length == calendars.length)
//       setCommonDay((prev) => [...prev, { ...occurance[0], keep: true }]);
//   });
// }

// function processTripDirection() {
//   const datas = commonDay()
//     .filter((item) => {
//       const direction = TripDirectionEntity.FindDirectionById(item.tripTypeId);
//       if (!item.tripDirection) item.tripDirection = direction;
//       if (
//         item.tripDirection.type == onTripDirection() ||
//         item.tripDirection.type == TripDirectionEnum.roundTrip
//       )
//         return item;
//     })
//     .map((item) => {
//       if (item.tripDirection.type == TripDirectionEnum.roundTrip)
//         item.tripDirection = TripDirectionEntity.findDirectionByDirectionName(
//           onTripDirection()
//         );
//       return { ...item };
//     });
//   setTripDaysAndDirection(datas);
// }
