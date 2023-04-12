import { useStateAction } from "../StateAction";
import { addNewUserInformation } from "../signaux";
import { ModeEnum, MessageLevelEnum, MessageTypeEnum } from "../type";
import DisplayAddLineMessageContent from "./DisplayAddLineMessageContent";
import DisplayRemoveLineMessageContent from "./DisplayRemoveLineMessageContent";
const [, { getMode }] = useStateAction();

export function displayAddLineMessage() {
  if (getMode() === ModeEnum.addLine) {
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.info,
      type: MessageTypeEnum.enterAddLine,
      content: DisplayAddLineMessageContent(),
    });
  }
}

export function displayRemoveLineMessage() {
  if (getMode() === ModeEnum.removeLine) {
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.info,
      type: MessageTypeEnum.enterAddLine,
      content: DisplayRemoveLineMessageContent(),
    });
  }
}
