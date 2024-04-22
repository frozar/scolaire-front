import { createSignal } from "solid-js";
import { CalendarDayEnum } from "../../../../_entities/calendar.entity";
import { FlatGraphicType } from "../../../../_entities/flatGraphic.entity";
import { CircleCrossIcon } from "../../../../icons/CircleCrossIcon";
import UpdatePen from "../../../../icons/UpdatePen";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { LabeledColorPicker } from "../../board/component/molecule/LabeledColorPicker";
import LabeledInputField from "../../board/component/molecule/LabeledInputField";
import { CheckableElementList } from "../../line/molecule/CheckableElementList";

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

  return (
    <div class="flex align-middle gap-4">
      <LabeledInputField
        label="Nom"
        value={""}
        placeholder="Entrer un nom"
        name="name"
        onInput={(e) => onNameInput(e.target.value)}
      />
      <LabeledColorPicker
        text="Couleur"
        onChange={(e) => onColorInput(e)}
        defaultColor="#000000"
      />
      <CheckableElementList
        displayQuantity={false}
        title="Jours"
        elements={[
          {
            name: "Lundi",
            id: 0,
            checked: false,
            onChange: () => onDayChanged(0),
          },
          {
            name: "Mardi",
            id: 1,
            checked: false,
            onChange: () => onDayChanged(1),
          },
          {
            name: "Mercredi",
            id: 2,
            checked: false,
            onChange: () => onDayChanged(2),
          },
          {
            name: "Jeudi",
            id: 3,
            checked: false,
            onChange: () => onDayChanged(3),
          },
          {
            name: "Vendredi",
            id: 4,
            checked: false,
            onChange: () => onDayChanged(4),
          },
          {
            name: "Samedi",
            id: 5,
            checked: false,
            onChange: () => onDayChanged(5),
          },
        ]}
      />
      <div class="flex align-top gap-4">
        <ButtonIcon icon={<CircleCrossIcon />} onClick={props.cancel} />
        <ButtonIcon
          icon={<UpdatePen />}
          onClick={() => props.submit(newFlatGraphic())}
        />
      </div>
    </div>
  );
}
