import { createEffect, createSignal } from "solid-js";
import { VacationPeriodType } from "../../../../_entities/calendar.entity";
import { TextInput } from "../../../../component/atom/TextInput";
import { DateInput } from "../../../../component/molecule/DateInput";
import { addNewUserInformation } from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import { CalendarManager } from "../calendar.manager";
import { ItemActions, actionEnum } from "./ItemActions";
import "./VacationItem.css";

interface VacationItemProps {
  item?: VacationPeriodType;
}

const initialBufferVacation = {
  name: "",
  start: new Date(),
  end: new Date(),
};

export function VacationItem(props: VacationItemProps) {
  const name = () => (props.item ? props.item.name : bufferVacation().name);
  const [actionMode, setActionMode] = createSignal<actionEnum>(
    !props.item ? actionEnum.append : actionEnum.edit
  );
  const [bufferVacation, setBufferVacation] = createSignal<VacationPeriodType>(
    props.item ?? initialBufferVacation
  );

  createEffect(() => {
    CalendarManager.updateVacation(
      props.item?.name as string,
      bufferVacation(),
      "date"
    );
  });

  function onChangeDate(date: Date, field: "start" | "end") {
    setBufferVacation((prev) => {
      if (!prev) return prev;
      const datas = { ...prev };
      datas[field] = date;
      return datas;
    });
  }

  function onInputName(value: string) {
    setBufferVacation((prev) => {
      if (!prev) return prev;
      const datas = { ...prev };
      datas.name = value;
      return datas;
    });
  }

  function appendVacation() {
    if (bufferVacation().name.length == 0) {
      return addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.info,
        type: MessageTypeEnum.global,
        content: "Veuillez compléter touts les champs",
      });
    }

    CalendarManager.pushVacationToCalendarPeriod(bufferVacation());
    setBufferVacation(initialBufferVacation);
  }

  function removeVacation() {
    CalendarManager.removeVacation(bufferVacation());
  }

  function editMode() {
    if (actionMode() == actionEnum.isEditing) {
      CalendarManager.updateVacation(
        props.item?.name as string,
        bufferVacation(),
        "all"
      );
    }

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
        placeholder="Nom vacance"
        disabled={
          actionMode() != actionEnum.isEditing &&
          actionMode() != actionEnum.append
        }
      />
      <DateInput
        label="Début"
        defaultValue={bufferVacation().start}
        maxDate={bufferVacation().start}
        disabled={
          actionMode() != actionEnum.isEditing &&
          actionMode() != actionEnum.append
        }
        onChange={(date: Date) => onChangeDate(date, "start")}
      />
      <DateInput
        label="Fin"
        minDate={bufferVacation().start}
        defaultValue={bufferVacation().end}
        disabled={
          actionMode() != actionEnum.isEditing &&
          actionMode() != actionEnum.append
        }
        onChange={(date: Date) => onChangeDate(date, "end")}
      />
      <ItemActions
        mode={actionMode()}
        appendItem={appendVacation}
        editMode={editMode}
        removeItem={removeVacation}
      />
    </div>
  );
}
