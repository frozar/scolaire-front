import { GradeEntity } from "../../../../../_entities/grade.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { SchoolDetailUtils } from "../../../../../utils/school-details.utils";
import TimesInputWrapper from "../molecule/TimesInputWrapper";
import { schoolDetailEditing } from "./SchoolDetails";

interface SchoolHoursSlotsProps {
  school: SchoolType;
}

export function SchoolHoursSlots(props: SchoolHoursSlotsProps) {
  const { startHourComing, endHourComing, endHourGoing, startHourGoing } =
    // eslint-disable-next-line solid/reactivity
    props.school.hours;

  function onInputComingStart(value: string) {
    const date = GradeEntity.getHourFormatFromString(value);
    SchoolDetailUtils.updateSchoolDetails({
      hours: { ...props.school.hours, startHourComing: date },
    });
  }

  function onInputComingEnd(value: string) {
    const date = GradeEntity.getHourFormatFromString(value);
    SchoolDetailUtils.updateSchoolDetails({
      hours: { ...props.school.hours, endHourComing: date },
    });
  }

  function onInputGoingStart(value: string) {
    const date = GradeEntity.getHourFormatFromString(value);
    SchoolDetailUtils.updateSchoolDetails({
      hours: { ...props.school.hours, startHourGoing: date },
    });
  }

  function onInputGoingEnd(value: string) {
    const date = GradeEntity.getHourFormatFromString(value);
    SchoolDetailUtils.updateSchoolDetails({
      hours: { ...props.school.hours, endHourGoing: date },
    });
  }

  return (
    <>
      <TimesInputWrapper
        label="Horaires matin"
        startValue={GradeEntity.getStringFromHourFormat(startHourComing)}
        endValue={GradeEntity.getStringFromHourFormat(endHourComing)}
        onInputStart={onInputComingStart}
        onInputEnd={onInputComingEnd}
        disabled={!schoolDetailEditing()}
      />
      <TimesInputWrapper
        label="Horaires après-midi"
        startValue={GradeEntity.getStringFromHourFormat(startHourGoing)}
        endValue={GradeEntity.getStringFromHourFormat(endHourGoing)}
        onInputStart={onInputGoingStart}
        onInputEnd={onInputGoingEnd}
        disabled={!schoolDetailEditing()}
      />
    </>
  );
}
