import { For, createEffect, createSignal, onMount } from "solid-js";
import { CalendarDayEnum } from "../../../../_entities/calendar.entity";
import { GradeType } from "../../../../_entities/grade.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../../_entities/trip-direction.entity";
import { LabeledCheckbox } from "../../../../component/molecule/LabeledCheckbox";
import { TripDirectionsButton } from "../../board/component/molecule/TripDirectionsButton";
import { CalendarUtils } from "../../calendar/calendar.utils";

// TODO review this entire file for facto and simplification
export function AssignDaysAndDirectionStep(props: {
  grades: GradeType[];
  days: CalendarDayEnum[];
  directionId: number;
  onUpdateDirection: (direction: TripDirectionEnum) => void;
  onUpdateDays: (days: CalendarDayEnum[]) => void;
}) {
  const [commonDays, setCommonDays] = createSignal<CalendarDayEnum[]>([]);

  const [selectedDays, setSelectedDays] = createSignal<CalendarDayEnum[]>([]);

  const [onTripDirection, setOnTripDirection] = createSignal<TripDirectionEnum>(
    TripDirectionEnum.coming
  );
  onMount(() => {
    setOnTripDirection(TripDirectionEntity.findEnumById(props.directionId));
    setSelectedDays(props.days);
  });

  createEffect(() => {
    props.onUpdateDirection(onTripDirection());
  });

  createEffect(() => {
    console.log("setCommonDays(");
    setCommonDays(
      CalendarUtils.commonDaysBetweenGrades(props.grades, onTripDirection())
    );
  });

  createEffect(() => {
    setSelectedDays((prevDays) => {
      const selectedDays: CalendarDayEnum[] = [];
      for (const prevDay of prevDays) {
        if (
          CalendarUtils.commonDaysBetweenGrades(
            props.grades,
            onTripDirection()
          ).includes(prevDay)
        ) {
          selectedDays.push(prevDay);
        }
      }
      //TODO retravailler le composant global
      // props.onUpdateDays(selectedDays);
      return selectedDays;
    });
  });

  return (
    <div class="mt-5">
      <p class="font-bold mb-3">Jours assignées à la course</p>

      <TripDirectionsButton
        onClickComing={() => setOnTripDirection(TripDirectionEnum.coming)}
        onClickGoing={() => setOnTripDirection(TripDirectionEnum.going)}
        onDirection={onTripDirection()}
      />

      <For each={commonDays()}>
        {(day) => (
          <LabeledCheckbox
            checked={selectedDays().includes(day)}
            label={CalendarUtils.dayToFrench(day)}
            for={day}
            onChange={() => {
              setSelectedDays((prev) => {
                let datas = [...prev];
                if (datas.includes(day)) {
                  datas = datas.filter((_day) => _day != day);
                } else {
                  datas.push(day);
                }
                return CalendarUtils.orderedDays(datas);
              });
              props.onUpdateDays(selectedDays());
            }}
          />
        )}
      </For>
    </div>
  );
}
