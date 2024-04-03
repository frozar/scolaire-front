import { Setter } from "solid-js";
import {
  HourRuleType,
  HoursType,
} from "../../../../../_entities/_utils.entity";
import { CalendarType } from "../../../../../_entities/calendar.entity";
import { GradeEntity } from "../../../../../_entities/grade.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { calendars } from "../../../../../_stores/calendar.store";
import { LabeledInputSelect } from "../../../../../component/molecule/LabeledInputSelect";
import LabeledInputField from "../../../board/component/molecule/LabeledInputField";
import { LabeledInputNumber } from "../../../board/component/molecule/LabeledInputNumber";
import TimesInputWrapper from "../molecule/TimesInputWrapper";
import { GradeHourRuleList } from "./GradeHourRuleList";

interface SchoolAddContentProps {
  school: SchoolType;
  schoolSetter: Setter<SchoolType>;
  hours: HoursType;
  hoursSetter: Setter<HoursType>;
}

export function SchoolAddContent(props: SchoolAddContentProps) {
  function onInputName(value: string) {
    props.schoolSetter((prev) => {
      return { ...prev, name: value };
    });
  }

  function onInputCalendar(value: number) {
    const _calendar = calendars().find((c) => c.id == value);
    props.schoolSetter((prev) => {
      return { ...prev, calendar: _calendar };
    });
  }

  function onInputWaitingTime(value: number) {
    props.schoolSetter((prev) => {
      return { ...prev, waitingTime: value };
    });
  }

  function onInputLat(value: number) {
    props.schoolSetter((prev) => {
      return { ...prev, lat: value };
    });
  }

  function onInputLng(value: number) {
    props.schoolSetter((prev) => {
      return { ...prev, lon: value };
    });
  }

  function onInputComingStart(value: string) {
    props.hoursSetter((prev) => {
      return {
        ...prev,
        startHourComing: GradeEntity.getHourFormatFromString(value),
      };
    });
  }

  function onInputComingEnd(value: string) {
    props.hoursSetter((prev) => {
      return {
        ...prev,
        endHourComing: GradeEntity.getHourFormatFromString(value),
      };
    });
  }

  function onInputGoingStart(value: string) {
    props.hoursSetter((prev) => {
      return {
        ...prev,
        startHourGoing: GradeEntity.getHourFormatFromString(value),
      };
    });
  }

  function onInputGoingEnd(value: string) {
    props.hoursSetter((prev) => {
      return {
        ...prev,
        endHourGoing: GradeEntity.getHourFormatFromString(value),
      };
    });
  }

  function onUpdateHourRules(rules: HourRuleType[]) {
    props.hoursSetter((prev) => {
      return {
        ...prev,
        rules: [...rules],
      };
    });
  }

  return (
    <div>
      <LabeledInputField
        label="Nom"
        name="name"
        value={props.school.name}
        onInput={(e) => onInputName(e.target.value)}
      />
      <LabeledInputSelect
        label="Calendrier"
        options={calendars().map((item) => {
          return { value: item.id, text: item.name };
        })}
        onChange={(e) => onInputCalendar(Number(e))}
        defaultValue={0}
      />
      <div>
        <div class="text-xl">Horaires</div>
        <TimesInputWrapper
          label="Aller"
          startValue={props.hours.startHourComing}
          endValue={props.hours.endHourComing}
          onInputStart={onInputComingStart}
          onInputEnd={onInputComingEnd}
        />
        <TimesInputWrapper
          label="Retour"
          startValue={props.hours.startHourGoing}
          endValue={props.hours.endHourGoing}
          onInputStart={onInputGoingStart}
          onInputEnd={onInputGoingEnd}
        />
        <GradeHourRuleList
          rules={props.hours.rules}
          calendar={props.school.calendar as CalendarType}
          onUpdate={onUpdateHourRules}
          enabled={true}
        />
      </div>
      <div>
        <div class="text-xl">Coordonnées</div>
        <LabeledInputNumber
          label="Latitude"
          name="lat"
          value={props.school.lat}
          onInput={(e) => onInputLat(Number(e.target.value))}
        />
        <LabeledInputNumber
          label="Longitude"
          name="lng"
          value={props.school.lon}
          onInput={(e) => onInputLng(Number(e.target.value))}
        />
      </div>
      <LabeledInputNumber
        label="Temps d'attente"
        name="waitTime"
        onInput={(e) => onInputWaitingTime(Number(e.target.value))}
        value={props.school.waitingTime}
      />
    </div>
  );
}
