import { For, createEffect, createSignal } from "solid-js";
import {
  CalendarDayEnum,
  RulesType,
} from "../../../../../_entities/calendar.entity";
import { GradeType } from "../../../../../_entities/grade.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../../../_entities/trip-direction.entity";
import { LabeledCheckbox } from "../../../../../component/molecule/LabeledCheckbox";
import { GradeUtils } from "../../../../../utils/grade.utils";
import { CalendarUtils } from "../../../calendar/calendar.utils";
import { TripDirectionsButton } from "../molecule/TripDirectionsButton";
import { drawTripCheckableGrade } from "./DrawTripBoard";

type tripDaysAndDirectionType = {
  keep: boolean;
} & RulesType;

export const [tripDaysAndDirection, setTripDaysAndDirection] = createSignal<
  tripDaysAndDirectionType[]
>([]);

export const [onTripDirection, setOnTripDirection] =
  createSignal<TripDirectionEnum>(TripDirectionEnum.coming);

export function AssignDaysAndDirectionToTrip() {
  const [commonDay, setCommonDay] = createSignal<tripDaysAndDirectionType[]>(
    []
  );
  let checked: GradeType[] = [];
  let rulesList: RulesType[][] = [];

  function getCommonDay() {
    const calendars = checked.flatMap((item) => item.calendar);
    for (const calendar of calendars)
      rulesList.push(calendar?.rules.map((item) => item) ?? []);

    const everyDayRule = rulesList.flatMap((item) => item.map((item) => item));
    const weekDays = Object.values(CalendarDayEnum);

    weekDays.forEach((day) => {
      const occurance = everyDayRule.filter((item) => item.day == day);
      if (occurance.length == calendars.length)
        commonDay().push({ ...occurance[0], keep: true });
    });
  }

  function processTripDirection() {
    const datas = commonDay()
      .filter((item) => {
        if (
          item.tripDirection.type == onTripDirection() ||
          item.tripDirection.type == TripDirectionEnum.roundTrip
        )
          return item;
      })
      .map((item) => {
        if (item.tripDirection.type == TripDirectionEnum.roundTrip)
          item.tripDirection = TripDirectionEntity.findTripByDirection(
            onTripDirection()
          );
        return { ...item };
      });
    setTripDaysAndDirection(datas);
  }

  createEffect(() => {
    setCommonDay([]);
    checked = [];
    rulesList = [];

    drawTripCheckableGrade().filter((item) => {
      if (item.done) checked.push(GradeUtils.getGrade(item.item.id));
    });

    getCommonDay();
    processTripDirection();
  });

  return (
    <div class="mt-5">
      <p class="font-bold mb-3">Jours assignées à la course</p>

      <TripDirectionsButton
        onClickComing={() => setOnTripDirection(TripDirectionEnum.coming)}
        onClickGoing={() => setOnTripDirection(TripDirectionEnum.going)}
        onDirection={onTripDirection()}
      />

      <For each={tripDaysAndDirection()}>
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
      </For>
    </div>
  );
}
