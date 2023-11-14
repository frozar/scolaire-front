import { createEffect, createSignal } from "solid-js";
import { VacationPeriodType } from "../../../../_entities/calendar.entity";
import { TextInput } from "../../../../component/atom/TextInput";
import { DateInput } from "../../../../component/molecule/DateInput";
import { setOnCalendarsPeriod } from "../template/Calendar";
import { ItemActions } from "./ItemActions";
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
  const [editingMode, setEditingMode] = createSignal<boolean>(
    props.item != undefined
  );

  const [bufferVacation, setBufferVacation] = createSignal<VacationPeriodType>(
    props.item ?? initialBufferVacation
  );

  createEffect(() => {
    if (bufferVacation()) {
      setOnCalendarsPeriod((prev) => {
        if (!prev) return prev;
        const datas = { ...prev };
        const index = datas.vacationsPeriod.findIndex(
          (item) => item.name == bufferVacation().name
        );
        if (index == -1) return datas;
        datas.vacationsPeriod[index] = bufferVacation();
        return datas;
      });
    }
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
    setOnCalendarsPeriod((prev) => {
      if (!prev) return prev;
      const datas = { ...prev };
      datas.vacationsPeriod.push(bufferVacation());
      return datas;
    });

    setBufferVacation(initialBufferVacation);
  }

  function removeVacation() {
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
    setEditingMode(!editingMode());
  }

  function canAppend() {
    return props.item == undefined && bufferVacation().name.length > 0;
  }

  return (
    <div class="vacation-item">
      <TextInput
        onInput={onInputName}
        defaultValue={name()}
        placeholder="Nom vacance"
        disabled={editingMode()}
      />
      <DateInput
        label="Début"
        maxDate={bufferVacation().end}
        defaultValue={bufferVacation().start}
        disabled={editingMode()}
        onChange={(date: Date) => onChangeDate(date, "start")}
      />
      <DateInput
        label="Fin"
        minDate={bufferVacation().start}
        defaultValue={bufferVacation().end}
        disabled={editingMode()}
        onChange={(date: Date) => onChangeDate(date, "end")}
      />
      <ItemActions
        isEditing={editingMode()}
        appendItem={appendVacation}
        editMode={editMode}
        removeItem={removeVacation}
        canAppend={canAppend()}
        canEdit={props.item != undefined}
      />
    </div>
  );
}
