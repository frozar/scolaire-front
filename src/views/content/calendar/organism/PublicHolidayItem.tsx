import { createEffect, createSignal } from "solid-js";
import { PublicHolidayType } from "../../../../_entities/calendar.entity";
import { TextInput } from "../../../../component/atom/TextInput";
import { DateInput } from "../../../../component/molecule/DateInput";
import { addNewUserInformation } from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import { CalendarManager } from "../calendar.manager";
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
      CalendarManager.updatePublicHoliday(
        props.item?.name as string,
        bufferHoliday(),
        "date"
      );
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

    CalendarManager.pushPublicHolidayToCalendarPeriod(bufferHoliday());
    setBufferHoliday(initalBufferHoliday);
  }

  function removeHoliday() {
    CalendarManager.removePublicHoliday(bufferHoliday());
  }

  function editMode() {
    if (actionMode() == actionEnum.isEditing)
      CalendarManager.updatePublicHoliday(
        props.item?.name as string,
        bufferHoliday(),
        "all"
      );

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
