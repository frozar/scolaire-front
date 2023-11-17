import { Accessor, Setter } from "solid-js";
import {
  GradeEntity,
  HeureFormat,
} from "../../../../../_entities/grade.entity";
import TimeInput from "../atom/TimeInput";

interface TimeSchedulesInputProps {
  startSetter: Setter<HeureFormat>;
  start: Accessor<HeureFormat | undefined>;

  endSetter: Setter<HeureFormat>;
  end: Accessor<HeureFormat | undefined>;
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
        value={GradeEntity.getStringFromHeureFormat(
          props.start() as HeureFormat
        )}
      />

      <p>à</p>
      <TimeInput
        onInput={onInputEnd}
        value={GradeEntity.getStringFromHeureFormat(props.end() as HeureFormat)}
      />
    </div>
  );
}
