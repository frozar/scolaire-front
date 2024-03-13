import { createSignal } from "solid-js";
import { CalendarType } from "../../../../_entities/calendar.entity";
import PlusIcon from "../../../../icons/PlusIcon";
import { CalendarInputText } from "../atom/CalendarInputText";
import { CalendarMonthsDetails } from "../molecule/CalendarMonthsDetails";
import { CalendarActionsEnum } from "../template/Calendar";

import { CalendarStore } from "../../../../_stores/calendar.store";
import {
  addNewUserInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { CalendarUtils } from "../calendar.utils";
import "./CalendarAddLine.css";
import "./CalendarLineContent.css";

interface CalendarAddLineProps {
  month: Date;
}

export function CalendarAddLine(props: CalendarAddLineProps) {
  const newCalendar: CalendarType = CalendarUtils.defaultCalendar();
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>(
    document.createElement("input")
  );

  function isValideCalendar() {
    if (newCalendar.name.length == 0) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.info,
        type: MessageTypeEnum.global,
        // eslint-disable-next-line quotes
        content: 'Le champs "nom du calendrier" est requis.',
      });
      return false;
    } else return true;
  }

  async function onClickCreateCalendar() {
    if (!isValideCalendar()) return;
    enableSpinningWheel();

    await CalendarStore.create(newCalendar);
    inputRef().value = "";

    disableSpinningWheel();
  }

  // TODO keypress
  function onKeyPress(key: string) {
    if (key == "Enter") onClickCreateCalendar();
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
          <ButtonIcon
            icon={<PlusIcon size={12} />}
            onClick={onClickCreateCalendar}
          />
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
