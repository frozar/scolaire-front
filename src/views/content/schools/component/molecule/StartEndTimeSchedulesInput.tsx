import { Accessor, Setter } from "solid-js";
import { GradeEntity, HourFormat } from "../../../../../_entities/grade.entity";
import TimeInput from "../atom/TimeInput";

interface TimeSchedulesInputProps {
  startSetter: Setter<HourFormat>;
  start: Accessor<HourFormat | undefined>;

  endSetter: Setter<HourFormat>;
  end: Accessor<HourFormat | undefined>;
}

export default function (props: TimeSchedulesInputProps) {
  function onInputStart(value: string) {
    const formatedSchedule = GradeEntity.getHourFormatFromString(value);
    if (!formatedSchedule) return;
    props.startSetter(formatedSchedule);
  }

  function onInputEnd(value: string) {
    const formatedSchedule = GradeEntity.getHourFormatFromString(value);
    if (!formatedSchedule) return;
    props.endSetter(formatedSchedule);
  }

  return (
    <div class="flex justify-between w-[70%]">
      <TimeInput
        onInput={onInputStart}
        value={GradeEntity.getStringFromHourFormat(props.start() as HourFormat)}
      />

      <p>à</p>
      <TimeInput
        onInput={onInputEnd}
        value={GradeEntity.getStringFromHourFormat(props.end() as HourFormat)}
      />
    </div>
  );
}
