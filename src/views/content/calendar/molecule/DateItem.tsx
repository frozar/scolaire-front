import { createSignal, onMount } from "solid-js";
import {
  CalendarDayEnum,
  DateAddedType,
} from "../../../../_entities/calendar.entity";
import { DateInput } from "../../../../component/molecule/DateInput";
import { CalendarManager } from "../calendar.manager";
import { ItemActions, actionEnum } from "../organism/ItemActions";
import { RulesSelectorWrapper } from "./RulesSelectorWrapper";

interface DateItemProps {
  date?: DateAddedType;
}

export function DateItem(props: DateItemProps) {
  const initalDateAdded: DateAddedType = {
    date: 0,
    reference: CalendarDayEnum.monday,
  };

  const [bufferAdded, setBufferAdded] = createSignal<DateAddedType>();
  const [actionMode, setActionMode] = createSignal<actionEnum>();

  onMount(() => {
    if (props.date) setBufferAdded(props.date);
    else setBufferAdded(initalDateAdded);
    setActionMode(!props.date ? actionEnum.append : actionEnum.edit);
  });

  function onChangeDate(date: Date) {
    setBufferAdded((prev) => {
      if (!prev) return prev;
      const datas = { ...prev };
      datas.date = date.getTime();
      return datas;
    });
  }

  function editMode() {
    if (
      actionMode() == actionEnum.isEditing &&
      bufferAdded()?.date != props.date?.date
    )
      CalendarManager.updateAddedDate(
        props.date as DateAddedType,
        bufferAdded() as DateAddedType
      );

    setActionMode(
      actionMode() != actionEnum.isEditing
        ? actionEnum.isEditing
        : actionEnum.edit
    );
  }

  function appendDate() {
    CalendarManager.appendAddedDate(bufferAdded() as DateAddedType);
  }

  function removeDate() {
    CalendarManager.removeAddedDate(new Date(props.date?.date as number));
  }

  function onChangeSelect(value: string) {
    setBufferAdded((prev) => {
      if (!prev) return prev;
      const datas = { ...prev };
      datas.reference = value as CalendarDayEnum;
      return datas;
    });
  }

  return (
    <div class="add-added-date flex gap-2">
      <DateInput
        disabled={
          actionMode() != actionEnum.isEditing &&
          actionMode() != actionEnum.append
        }
        defaultValue={
          props.date ? new Date(props.date.date as number) : undefined
        }
        label="Date ajouté"
        onChange={onChangeDate}
      />
      <RulesSelectorWrapper
        disabled={
          actionMode() != actionEnum.isEditing &&
          actionMode() != actionEnum.append
        }
        onChange={onChangeSelect}
        defaultValue={props.date?.reference}
      />

      <ItemActions
        mode={actionMode() ?? actionEnum.none}
        appendItem={appendDate}
        editMode={editMode}
        removeItem={removeDate}
      />
    </div>
  );
}
