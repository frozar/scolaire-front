import { GradeEntity } from "../../../../../_entities/grade.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { SchoolDetailUtils } from "../../../../../utils/school-details.utils";
import TimesInputWrapper from "../molecule/TimesInputWrapper";
import { schoolDetailEditing } from "./SchoolDetails";

interface SchoolHoursSlotsProps {
  school: SchoolType;
}

export function SchoolHoursSlots(props: SchoolHoursSlotsProps) {
  function schoolHours() {
    return props.school.hours;
  }

  function onInputComingStart(value: string) {
    SchoolDetailUtils.update({
      hours: {
        ...props.school.hours,
        startHourComing: GradeEntity.getHourFormatFromString(value),
      },
    });
  }

  function onInputComingEnd(value: string) {
    SchoolDetailUtils.update({
      hours: {
        ...props.school.hours,
        endHourComing: GradeEntity.getHourFormatFromString(value),
      },
    });
  }

  function onInputGoingStart(value: string) {
    SchoolDetailUtils.update({
      hours: {
        ...props.school.hours,
        startHourGoing: GradeEntity.getHourFormatFromString(value),
      },
    });
  }

  function onInputGoingEnd(value: string) {
    SchoolDetailUtils.update({
      hours: {
        ...props.school.hours,
        endHourGoing: GradeEntity.getHourFormatFromString(value),
      },
    });
  }

  return (
    <>
      <TimesInputWrapper
        label="Aller"
        startValue={schoolHours().startHourComing}
        endValue={schoolHours().endHourComing}
        onInputStart={onInputComingStart}
        onInputEnd={onInputComingEnd}
        disabled={!schoolDetailEditing()}
      />
      <TimesInputWrapper
        label="Retour"
        startValue={schoolHours().startHourGoing}
        endValue={schoolHours().endHourGoing}
        onInputStart={onInputGoingStart}
        onInputEnd={onInputGoingEnd}
        disabled={!schoolDetailEditing()}
      />
    </>
  );
}
