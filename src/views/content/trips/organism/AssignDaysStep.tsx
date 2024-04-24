import { For, createEffect, createSignal, onMount } from "solid-js";
import { CalendarDayEnum } from "../../../../_entities/calendar.entity";
import { GradeType } from "../../../../_entities/grade.entity";
import { TripDirectionEnum } from "../../../../_entities/trip-direction.entity";
import { LabeledCheckbox } from "../../../../component/molecule/LabeledCheckbox";
import { CalendarUtils } from "../../calendar/calendar.utils";

export function AssignDaysStep(props: {
  grades: GradeType[];
  days: CalendarDayEnum[];
  tripDirection: TripDirectionEnum;
  onUpdateDays: (days: CalendarDayEnum[]) => void;
}) {
  const [commonDays, setCommonDays] = createSignal<CalendarDayEnum[]>([]);

  const [selectedDays, setSelectedDays] = createSignal<CalendarDayEnum[]>([]);

  onMount(() => {
    setSelectedDays(props.days);
  });

  createEffect(() => {
    setCommonDays(
      CalendarUtils.commonDaysBetweenGrades(props.grades, props.tripDirection)
    );
  });
  createEffect(() => {
    console.log(commonDays());
  });

  createEffect(() => {
    setSelectedDays((prevDays) => {
      const selectedDays: CalendarDayEnum[] = [];
      for (const prevDay of prevDays) {
        if (
          //   CalendarUtils.commonDaysBetweenGrades(
          //     props.grades,
          //     props.tripDirection
          //   ).includes(prevDay)
          commonDays().includes(prevDay)
        ) {
          selectedDays.push(prevDay);
        }
      }
      //TODO potentiel pb
      props.onUpdateDays(selectedDays);
      return selectedDays;
    });
  });

  return (
    <>
      <p class="font-bold mb-3">Choix des jours</p>
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
                props.onUpdateDays(datas);
                return CalendarUtils.orderedDays(datas);
              });
            }}
          />
        )}
      </For>
    </>
  );
}
