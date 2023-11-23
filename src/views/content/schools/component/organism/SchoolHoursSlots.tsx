import { GradeEntity, HourFormat } from "../../../../../_entities/grade.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import TimeInput from "../atom/TimeInput";
import { schoolDetailEditing, setSchoolDetailsItem } from "./SchoolDetails";

interface SchoolHoursSlotsProps {
  school: SchoolType;
}

export function SchoolHoursSlots(props: SchoolHoursSlotsProps) {
  const { startHourComing, endHourComing, endHourGoing, startHourGoing } =
    // eslint-disable-next-line solid/reactivity
    props.school.hours;

  function updateSchoolDetailHours(
    field: "startComing" | "endComing" | "startGoing" | "endGoing",
    hour: HourFormat
  ) {
    setSchoolDetailsItem((prev) => {
      if (!prev) return prev;
      const school = { ...prev };
      switch (field) {
        case "startComing":
          school.hours.startHourComing = hour;
          break;
        case "endComing":
          school.hours.endHourComing = hour;
          break;
        case "startGoing":
          school.hours.startHourGoing = hour;
          break;
        case "endGoing":
          school.hours.endHourGoing = hour;
          break;
      }
      return school;
    });
  }
  function onInputComingStart(value: string) {
    const date = GradeEntity.getHourFormatFromString(value);
    updateSchoolDetailHours("startComing", date);
  }

  function onInputComingEnd(value: string) {
    const date = GradeEntity.getHourFormatFromString(value);
    updateSchoolDetailHours("endComing", date);
  }

  function onInputGoingStart(value: string) {
    const date = GradeEntity.getHourFormatFromString(value);
    updateSchoolDetailHours("startGoing", date);
  }

  function onInputGoingEnd(value: string) {
    const date = GradeEntity.getHourFormatFromString(value);
    updateSchoolDetailHours("endGoing", date);
  }

  return (
    <>
      <div>
        <label>Horraire d'arrivé</label>
        <div class="flex justify-between w-[70%]">
          <TimeInput
            onInput={onInputComingStart}
            value={GradeEntity.getStringFromHourFormat(startHourComing)}
            disabled={!schoolDetailEditing()}
          />

          <p>à</p>
          <TimeInput
            onInput={onInputComingEnd}
            value={GradeEntity.getStringFromHourFormat(endHourComing)}
            disabled={!schoolDetailEditing()}
          />
        </div>
      </div>
      <div>
        <label>Horraires départ</label>
        <div class="flex justify-between w-[70%]">
          <TimeInput
            onInput={onInputGoingStart}
            value={GradeEntity.getStringFromHourFormat(startHourGoing)}
            disabled={!schoolDetailEditing()}
          />

          <p>à</p>
          <TimeInput
            onInput={onInputGoingEnd}
            value={GradeEntity.getStringFromHourFormat(endHourGoing)}
            disabled={!schoolDetailEditing()}
          />
        </div>
      </div>
    </>
  );
}
