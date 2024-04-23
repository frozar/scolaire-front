import { createSignal } from "solid-js";
import { CalendarDayEnum } from "../../../../_entities/calendar.entity";
import { FlatGraphicType } from "../../../../_entities/flatGraphic.entity";
import { FlatGraphicAddMenuInputs } from "./FlatGraohicAddMenuInputs";
import "./FlatGraphicAddMenu.css";
import { FlatGraohicAddMenuButtons } from "./FlatGraphicAddMenuButtons";
import { FlatGraphicAddMenuDays } from "./FlatGraphicAddMenuDays";

interface FlatGraphicAddMenuProps {
  cancel: () => void;
  submit: (graphic: FlatGraphicType) => void;
}

export function FlatGraphicAddMenu(props: FlatGraphicAddMenuProps) {
  let checkedDays: number[] = [];

  const [newFlatGraphic, setNewFlatGraphic] = createSignal<FlatGraphicType>(
    {} as FlatGraphicType
  );

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
      checkedDays = checkedDays.filter((a) => a != clicked);
    else checkedDays.push(clicked);

    const dayList: CalendarDayEnum[] = [];
    checkedDays.forEach((b) => {
      if (b == 0) dayList.push(CalendarDayEnum.monday);
      if (b == 1) dayList.push(CalendarDayEnum.tuesday);
      if (b == 2) dayList.push(CalendarDayEnum.wednesday);
      if (b == 3) dayList.push(CalendarDayEnum.thursday);
      if (b == 4) dayList.push(CalendarDayEnum.friday);
      if (b == 5) dayList.push(CalendarDayEnum.saturday);
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
        onColorChange={onColorInput}
        onNameChange={onNameInput}
      />
      <FlatGraphicAddMenuDays onChange={onDayChanged} />
      <FlatGraohicAddMenuButtons
        cancel={props.cancel}
        submit={submitFunction}
      />
    </div>
  );
}
