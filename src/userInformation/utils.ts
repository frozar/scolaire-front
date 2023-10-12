import { useStateAction } from "../StateAction";
import { addNewUserInformation } from "../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../type";
import DisplayAddCourseMessageContent from "./DisplayAddCourseMessageContent";
import DisplayRemoveCourseMessageContent from "./DisplayRemoveCourseMessageContent";
const [, { isInDrawRaceMode }] = useStateAction();

export function displayAddCourseMessage() {
  if (isInDrawRaceMode()) {
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.info,
      type: MessageTypeEnum.enterAddCourse,
      content: DisplayAddCourseMessageContent(),
    });
  }
}

export function displayNoCourseMessage() {
  addNewUserInformation({
    displayed: true,
    level: MessageLevelEnum.error,
    type: MessageTypeEnum.global,
    content: "Aucune ligne de bus à exporter",
  });
}

export function displayRemoveCourseMessage() {
  addNewUserInformation({
    displayed: true,
    level: MessageLevelEnum.info,
    type: MessageTypeEnum.enterRemoveCourse,
    content: DisplayRemoveCourseMessageContent(),
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
