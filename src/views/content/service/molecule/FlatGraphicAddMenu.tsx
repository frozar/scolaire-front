import { createSignal, onMount } from "solid-js";
import { CalendarDayEnum } from "../../../../_entities/calendar.entity";
import { FlatGraphicType } from "../../../../_entities/flatGraphic.entity";
import { FlatGraphicAddMenuInputs } from "./FlatGraohicAddMenuInputs";
import "./FlatGraphicAddMenu.css";
import { FlatGraohicAddMenuButtons } from "./FlatGraphicAddMenuButtons";
import { FlatGraphicAddMenuDays } from "./FlatGraphicAddMenuDays";

interface FlatGraphicAddMenuProps {
  graphic?: FlatGraphicType;
  cancel: () => void;
  submit: (graphic: FlatGraphicType) => void;
}

export function FlatGraphicAddMenu(props: FlatGraphicAddMenuProps) {
  let checkedDays: number[] = [];

  const [newFlatGraphic, setNewFlatGraphic] = createSignal<FlatGraphicType>(
    {} as FlatGraphicType
  );

  onMount(() => {
    if (props.graphic) {
      setNewFlatGraphic(props.graphic);
      props.graphic.days.forEach((day) => {
        if (day == CalendarDayEnum.monday) checkedDays.push(0);
        if (day == CalendarDayEnum.tuesday) checkedDays.push(1);
        if (day == CalendarDayEnum.wednesday) checkedDays.push(2);
        if (day == CalendarDayEnum.thursday) checkedDays.push(3);
        if (day == CalendarDayEnum.friday) checkedDays.push(4);
        if (day == CalendarDayEnum.saturday) checkedDays.push(5);
      });
    }
  });

  function onNameInput(value: string) {
    setNewFlatGraphic((prev) => {
      return { ...prev, name: value };
    });
  }

  function onColorInput(color: string) {
    setNewFlatGraphic((prev) => {
      return { ...prev, color: color };
    });
  }

  function onDayChanged(clicked: number) {
    if (checkedDays.includes(clicked))
      checkedDays = checkedDays.filter((day) => day != clicked);
    else checkedDays.push(clicked);

    const dayList: CalendarDayEnum[] = [];
    checkedDays.forEach((id) => {
      if (id == 0) dayList.push(CalendarDayEnum.monday);
      if (id == 1) dayList.push(CalendarDayEnum.tuesday);
      if (id == 2) dayList.push(CalendarDayEnum.wednesday);
      if (id == 3) dayList.push(CalendarDayEnum.thursday);
      if (id == 4) dayList.push(CalendarDayEnum.friday);
      if (id == 5) dayList.push(CalendarDayEnum.saturday);
    });
    setNewFlatGraphic((prev) => {
      return { ...prev, days: dayList };
    });
  }

  function submitFunction() {
    props.submit(newFlatGraphic());
  }

  return (
    <div class="flat-graphic-menu">
      <FlatGraphicAddMenuInputs
        graphic={newFlatGraphic()}
        onColorChange={onColorInput}
        onNameChange={onNameInput}
      />
      <FlatGraphicAddMenuDays
        graphic={newFlatGraphic()}
        onChange={onDayChanged}
      />
      <FlatGraohicAddMenuButtons
        cancel={props.cancel}
        submit={submitFunction}
      />
    </div>
  );
}
