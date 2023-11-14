import { createEffect, createSignal } from "solid-js";
import { PublicHolidayType } from "../../../../_entities/calendar.entity";
import { TextInput } from "../../../../component/atom/TextInput";
import { DateInput } from "../../../../component/molecule/DateInput";
import { addNewUserInformation } from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import { setOnCalendarsPeriod } from "../template/Calendar";
import { ItemActions, actionEnum } from "./ItemActions";
import "./VacationItem.css";

interface PublicHolidayItemProps {
  item?: PublicHolidayType;
}

const initalBufferHoliday = {
  name: "",
  date: new Date(),
};

export function PublicHolidayItem(props: PublicHolidayItemProps) {
  const name = () => (props.item ? props.item.name : bufferHoliday().name);
  const [actionMode, setActionMode] = createSignal<actionEnum>(
    !props.item ? actionEnum.append : actionEnum.edit
  );
  const [bufferHoliday, setBufferHoliday] = createSignal<PublicHolidayType>(
    props.item ?? initalBufferHoliday
  );

  createEffect(() => {
    if (bufferHoliday()) {
      setOnCalendarsPeriod((prev) => {
        if (!prev) return prev;
        const datas = { ...prev };
        const index = datas.publicHolidays.findIndex(
          (item) => item.name == bufferHoliday().name
        );
        if (index == -1) return datas;
        datas.publicHolidays[index] = bufferHoliday();
        return datas;
      });
    }
  });

  function onChangeDate(date: Date) {
    setBufferHoliday((prev) => {
      if (!prev) return prev;
      const datas = { ...prev };
      datas.date = date;
      return datas;
    });
  }

  function onInputName(value: string) {
    setBufferHoliday((prev) => {
      if (!prev) return prev;
      const datas = { ...prev };
      datas.name = value;
      return datas;
    });
  }

  function appendHoliday() {
    if (bufferHoliday().name.length == 0) {
      return addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.info,
        type: MessageTypeEnum.global,
        content: "Veuillez compléter touts les champs",
      });
    }

    setOnCalendarsPeriod((prev) => {
      if (!prev) return prev;
      const datas = { ...prev };
      datas.publicHolidays.push(bufferHoliday());
      return datas;
    });
    setBufferHoliday(initalBufferHoliday);
  }

  function removeHoliday() {
    setOnCalendarsPeriod((prev) => {
      if (!prev) return prev;
      const datas = { ...prev };
      datas.publicHolidays = datas.publicHolidays.filter(
        (item) => item.name != props.item?.name
      );
      return datas;
    });
  }

  function editMode() {
    setActionMode(
      actionMode() != actionEnum.isEditing
        ? actionEnum.isEditing
        : actionEnum.edit
    );
  }

  return (
    <div class="vacation-item">
      <TextInput
        onInput={onInputName}
        defaultValue={name()}
        placeholder="Nom du jour férié"
        disabled={
          actionMode() != actionEnum.isEditing &&
          actionMode() != actionEnum.append
        }
      />
      <DateInput
        label="Date"
        defaultValue={bufferHoliday().date}
        disabled={
          actionMode() != actionEnum.isEditing &&
          actionMode() != actionEnum.append
        }
        onChange={onChangeDate}
      />
      <ItemActions
        mode={actionMode()}
        appendItem={appendHoliday}
        editMode={editMode}
        removeItem={removeHoliday}
      />
    </div>
  );
}
