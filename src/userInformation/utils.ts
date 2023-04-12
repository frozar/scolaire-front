import { useStateAction } from "../StateAction";
import { addNewUserInformation } from "../signaux";
import { ModeEnum, MessageLevelEnum, MessageTypeEnum } from "../type";
import DisplayAddLineMessageContent from "./DisplayAddLineMessageContent";
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
