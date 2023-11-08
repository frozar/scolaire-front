import { createSignal } from "solid-js";
import {
  CalendarDayEnum,
  CalendarType,
} from "../../../../_entities/calendar.entity";
import { CalendarService } from "../../../../_services/calendar.service";
import PlusIcon from "../../../../icons/PlusIcon";
import { CalendarInputText } from "../atom/CalendarInputText";
import { CalendarMonthsDetails } from "../molecule/CalendarMonthsDetails";
import {
  CalendarActionsEnum,
  pushCalendar,
  setCurrentCalendar,
} from "../template/Calendar";

import { addNewUserInformation } from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./CalendarAddLine.css";
import "./CalendarLineContent.css";

interface CalendarAddLineProps {
  month: Date;
}

export function CalendarAddLine(props: CalendarAddLineProps) {
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>(
    document.createElement("input")
  );

  const newCalendar: CalendarType = {
    id: 0,
    name: "",
    rules: Object.values(CalendarDayEnum),
    added: [],
    deleted: [],
  };

  async function createCalendar() {
    if (newCalendar.name.length == 0) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.info,
        type: MessageTypeEnum.global,
        // eslint-disable-next-line quotes
        content: 'Le champs "nom du calendrier" est requis.',
      });
      return;
    }
    const calendar = await CalendarService.createCalendar(newCalendar);
    pushCalendar(calendar);
    inputRef().value = "";
    setCurrentCalendar(calendar);
  }

  // TODO keypress
  function onKeyPress(key: string) {
    if (key == "Enter") {
      createCalendar();
    }
  }

  function onInput(value: string) {
    newCalendar.name = value;
  }

  return (
    <div class="calendar-cells">
      <div class="calendar-line-content">
        <div class="calendar-add-input-container">
          <CalendarInputText
            placeholder="Ajouter une ligne"
            onKeyPress={onKeyPress}
            onInput={onInput}
            ref={setInputRef}
          />
          <ButtonIcon icon={<PlusIcon size={12} />} onClick={createCalendar} />
        </div>
        <CalendarMonthsDetails
          action={CalendarActionsEnum.add}
          calendar={newCalendar}
          month={props.month}
          onClickAction={() => undefined}
        />
      </div>
    </div>
  );
}
