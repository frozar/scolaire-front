import { createSignal } from "solid-js";
import { CalendarPeriodType } from "../../../../_entities/calendar.entity";
import PlusIcon from "../../../../icons/PlusIcon";
import { CalendarInputText } from "../atom/CalendarInputText";
import { CalendarMonthsDetails } from "../molecule/CalendarMonthsDetails";
import { CalendarActionsEnum } from "../template/Calendar";

import { addNewUserInformation } from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { CalendarManager } from "../calendar.manager";
import "./CalendarAddLine.css";
import "./CalendarLineContent.css";

interface CalendarAddLineProps {
  month: Date;
}

export function CalendarPeriodAddLine(props: CalendarAddLineProps) {
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>(
    document.createElement("input")
  );
  const bufferCalendarPeriod: Omit<CalendarPeriodType, "id"> = {
    name: "",
    startDate: new Date(),
    endDate: new Date(),
    publicHolidays: [],
    vacationsPeriod: [],
  };

  function isValidCalendarPeriod(): boolean {
    if (bufferCalendarPeriod.name.length == 0) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        // eslint-disable-next-line quotes
        content: 'Le champs "nom du calendrier scolaire" est requis.',
      });
      return false;
    } else return true;
  }

  async function createCalendarPeriod() {
    if (!isValidCalendarPeriod()) return;
    CalendarManager.createCalendarPeriod(bufferCalendarPeriod);
    inputRef().value = "";
  }

  // TODO keypress
  function onKeyPress(key: string) {
    if (key == "Enter") {
      createCalendarPeriod();
    }
  }

  function onInput(value: string) {
    bufferCalendarPeriod.name = value;
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
          <ButtonIcon
            icon={<PlusIcon size={12} />}
            onClick={createCalendarPeriod}
          />
        </div>
        <CalendarMonthsDetails
          action={CalendarActionsEnum.add}
          calendarPeriod={{ ...bufferCalendarPeriod, id: 0 }}
          month={props.month}
          onClickAction={() => undefined}
        />
      </div>
    </div>
  );
}
