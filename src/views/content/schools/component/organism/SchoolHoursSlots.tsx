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
        label="Horaires d'arrivés"
        startValue={GradeEntity.getStringFromHourFormat(startHourComing)}
        endValue={GradeEntity.getStringFromHourFormat(endHourComing)}
        onInputStart={onInputComingStart}
        onInputEnd={onInputComingEnd}
        disabled={!schoolDetailEditing()}
      />
      <TimesInputWrapper
        label="Horaires de départs"
        startValue={GradeEntity.getStringFromHourFormat(startHourGoing)}
        endValue={GradeEntity.getStringFromHourFormat(endHourGoing)}
        onInputStart={onInputGoingStart}
        onInputEnd={onInputGoingEnd}
        disabled={!schoolDetailEditing()}
      />
    </>
  );
}
