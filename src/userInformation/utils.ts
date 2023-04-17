import { useStateAction } from "../StateAction";
import { addNewUserInformation } from "../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../type";
import DisplayAddLineMessageContent from "./DisplayAddLineMessageContent";
import DisplayRemoveLineMessageContent from "./DisplayRemoveLineMessageContent";
const [, { isInAddLineMode, isInRemoveLineMode }] = useStateAction();

export function displayAddLineMessage() {
  if (isInAddLineMode()) {
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.info,
      type: MessageTypeEnum.enterAddLine,
      content: DisplayAddLineMessageContent(),
    });
  }
}

export function displayRemoveLineMessage() {
  if (isInRemoveLineMode()) {
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.info,
      type: MessageTypeEnum.enterRemoveLine,
      content: DisplayRemoveLineMessageContent(),
    });
  }
}
