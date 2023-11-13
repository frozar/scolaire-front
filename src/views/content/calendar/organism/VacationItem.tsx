import { Show } from "solid-js";
import { VacationPeriodType } from "../../../../_entities/calendar.entity";
import { TextInput } from "../../../../component/atom/TextInput";
import { DateInput } from "../../../../component/molecule/DateInput";
import PlusIcon from "../../../../icons/PlusIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { setOnCalendarsPeriod } from "../template/Calendar";
import "./VacationItem.css";

interface VacationItemProps {
  item?: VacationPeriodType;
}

export function VacationItem(props: VacationItemProps) {
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

  return (
    <div class="vacation-item">
      <TextInput
        onInput={onInputName}
        defaultValue={name()}
        placeholder="Nom vacance"
        disabled={props.item != undefined}
      />
      <DateInput
        label="Début"
        maxDate={props.item?.end}
        defaultValue={props.item?.start}
        disabled={props.item != undefined}
        onChange={(date: Date) => onChangeDate(date, "start")}
      />
      <DateInput
        label="Fin"
        minDate={props.item?.start}
        defaultValue={props.item?.end}
        disabled={props.item != undefined}
        onChange={(date: Date) => onChangeDate(date, "end")}
      />
      <Show when={props.item == undefined}>
        <ButtonIcon icon={<PlusIcon />} onClick={appendVacation} />
      </Show>
    </div>
  );
}
