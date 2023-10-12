import { useStateAction } from "../StateAction";
import { addNewUserInformation } from "../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../type";
import DisplayAddRaceMessageContent from "./DisplayAddCourseMessageContent";
import DisplayRemoveRaceMessageContent from "./DisplayRemoveCourseMessageContent";
const [, { isInDrawRaceMode }] = useStateAction();

export function displayAddRaceMessage() {
  if (isInDrawRaceMode()) {
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.info,
      type: MessageTypeEnum.enterAddRace,
      content: DisplayAddRaceMessageContent(),
    });
  }
}

export function displayNoRaceMessage() {
  addNewUserInformation({
    displayed: true,
    level: MessageLevelEnum.error,
    type: MessageTypeEnum.global,
    content: "Aucune ligne de bus à exporter",
  });
}

export function displayRemoveRaceMessage() {
  addNewUserInformation({
    displayed: true,
    level: MessageLevelEnum.info,
    type: MessageTypeEnum.enterRemoveRace,
    content: DisplayRemoveRaceMessageContent(),
  });
}

export function displayDownloadErrorMessage() {
  addNewUserInformation({
    displayed: true,
    level: MessageLevelEnum.error,
    type: MessageTypeEnum.global,
    content: "Erreur lors du téléchargement",
  });
}

export function displayOnGoingDownloadMessage() {
  addNewUserInformation({
    displayed: true,
    level: MessageLevelEnum.info,
    type: MessageTypeEnum.global,
    content: "Téléchargement en cours",
  });
}

export function displayDownloadSuccessMessage() {
  addNewUserInformation({
    displayed: true,
    level: MessageLevelEnum.success,
    type: MessageTypeEnum.global,
    content: "Téléchargement réussi",
  });
}
