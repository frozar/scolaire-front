import { createSignal } from "solid-js";
import { VacationPeriodType } from "../../../../_entities/calendar.entity";
import { TextInput } from "../../../../component/atom/TextInput";
import { DateInput } from "../../../../component/molecule/DateInput";
import { setOnCalendarsPeriod } from "../template/Calendar";
import { VacationActions } from "./VacationActions";
import "./VacationItem.css";

interface VacationItemProps {
  item?: VacationPeriodType;
}

export function VacationItem(props: VacationItemProps) {
  const [disabled, setDisabled] = createSignal<boolean>(
    props.item != undefined
  );
  // let disabled = () => props.item != undefined;
  const name = () => (props.item ? props.item.name : bufferItem.name);

  const bufferItem: VacationPeriodType = {
    name: "",
    start: new Date(),
    end: new Date(),
  };

  function onChangeDate(date: Date, field: "start" | "end") {
    if (props.item) {
      setOnCalendarsPeriod((prev) => {
        if (!prev) return prev;
        const datas = { ...prev };
        const index = datas.vacationsPeriod.findIndex(
          (item) => item.name == props.item?.name
        );
        if (index == -1) return datas;
        datas.vacationsPeriod[index][field] = date;
        return datas;
      });
    } else {
      bufferItem[field] = date;
    }
  }

  function onInputName(value: string) {
    if (props.item) {
      setOnCalendarsPeriod((prev) => {
        if (!prev) return prev;
        const datas = { ...prev };
        const index = datas.vacationsPeriod.findIndex(
          (item) => item.name == props.item?.name
        );
        if (index == -1) return datas;
        datas.vacationsPeriod[index].name = value;
        return datas;
      });
    } else {
      bufferItem.name = value;
    }
  }

  function appendVacation() {
    setOnCalendarsPeriod((prev) => {
      if (!prev) return prev;
      const datas = { ...prev };
      datas.vacationsPeriod.push(bufferItem);
      return datas;
    });
  }

  function removeVacation() {
    console.log("remove vacation", props.item);
    setOnCalendarsPeriod((prev) => {
      if (!prev) return prev;
      const datas = { ...prev };
      datas.vacationsPeriod = datas.vacationsPeriod.filter(
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
        placeholder="Nom vacance"
        disabled={disabled()}
      />
      <DateInput
        label="Début"
        maxDate={props.item?.end}
        defaultValue={props.item?.start}
        disabled={disabled()}
        onChange={(date: Date) => onChangeDate(date, "start")}
      />
      <DateInput
        label="Fin"
        minDate={props.item?.start}
        defaultValue={props.item?.end}
        disabled={disabled()}
        onChange={(date: Date) => onChangeDate(date, "end")}
      />
      <VacationActions
        appendVacation={appendVacation}
        disabled={disabled()}
        editMode={editMode}
        removeVacation={removeVacation}
        item={props.item}
      />
    </div>
  );
}
