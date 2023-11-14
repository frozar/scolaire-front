import { createSignal } from "solid-js";
import { PublicHolidayType } from "../../../../_entities/calendar.entity";
import { TextInput } from "../../../../component/atom/TextInput";
import { DateInput } from "../../../../component/molecule/DateInput";
import { setOnCalendarsPeriod } from "../template/Calendar";
import { ItemActions } from "./ItemActions";
import "./VacationItem.css";

interface PublicHolidayItemProps {
  item?: PublicHolidayType;
}

export function PublicHolidayItem(props: PublicHolidayItemProps) {
  const name = () => (props.item ? props.item.name : bufferItem.name);
  const [disabled, setDisabled] = createSignal<boolean>(
    props.item != undefined
  );

  const bufferItem: PublicHolidayType = {
    name: "",
    date: new Date(),
  };

  function onChangeDate(date: Date) {
    if (props.item) {
      setOnCalendarsPeriod((prev) => {
        if (!prev) return prev;
        const datas = { ...prev };
        const index = datas.publicHolidays.findIndex(
          (item) => item.name == props.item?.name
        );
        if (index == -1) return datas;
        datas.publicHolidays[index].date = date;
        return datas;
      });
    } else {
      bufferItem.date = date;
    }
  }

  function onInputName(value: string) {
    if (props.item) {
      setOnCalendarsPeriod((prev) => {
        if (!prev) return prev;
        const datas = { ...prev };
        const index = datas.publicHolidays.findIndex(
          (item) => item.name == props.item?.name
        );
        if (index == -1) return datas;
        datas.publicHolidays[index].name = value;
        return datas;
      });
    } else {
      bufferItem.name = value;
    }
  }

  function appendHoliday() {
    setOnCalendarsPeriod((prev) => {
      if (!prev) return prev;
      const datas = { ...prev };
      datas.publicHolidays.push(bufferItem);
      return datas;
    });
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
        defaultValue={props.item?.date}
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
