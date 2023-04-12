import { useStateAction } from "../StateAction";
import { addNewUserInformation } from "../signaux";
import { ModeEnum, MessageLevelEnum, MessageTypeEnum } from "../type";
const [, { getMode }] = useStateAction();

export function displayAddLineMessage() {
  if (getMode() === ModeEnum.addLine) {
    const content = () => (
      <div>
        <div>
          <kbd class="kbd">Entrée</kbd> Sauvegarder
          <kbd class="kbd ml-2">Echap</kbd> Abandonner les modifications
        </div>
      </div>
    );
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.info,
      type: MessageTypeEnum.enterAddLine,
      content: content(),
    });
  }
}
