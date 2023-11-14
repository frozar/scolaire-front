import { createEffect, createSignal } from "solid-js";
import { PublicHolidayType } from "../../../../_entities/calendar.entity";
import { TextInput } from "../../../../component/atom/TextInput";
import { DateInput } from "../../../../component/molecule/DateInput";
import { setOnCalendarsPeriod } from "../template/Calendar";
import { ItemActions } from "./ItemActions";
import "./VacationItem.css";

interface PublicHolidayItemProps {
  item?: PublicHolidayType;
}

const initalBufferHoliday = {
  name: "",
  date: new Date(),
};

export function PublicHolidayItem(props: PublicHolidayItemProps) {
  const [bufferHoliday, setBufferHoliday] = createSignal<PublicHolidayType>(
    props.item ?? initalBufferHoliday
  );
  const name = () => (props.item ? props.item.name : bufferHoliday().name);
  const [disabled, setDisabled] = createSignal<boolean>(
    props.item != undefined
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
    setDisabled(!disabled());
  }

  return (
    <div class="vacation-item">
      <TextInput
        onInput={onInputName}
        defaultValue={name()}
        placeholder="Nom du jour férié"
        disabled={disabled()}
      />
      <DateInput
        label="Date"
        defaultValue={bufferHoliday().date}
        disabled={disabled()}
        onChange={onChangeDate}
      />
      <ItemActions
        appendItem={appendHoliday}
        disabled={disabled()}
        editMode={editMode}
        removeItem={removeHoliday}
        item={props.item}
      />
    </div>
  );
}