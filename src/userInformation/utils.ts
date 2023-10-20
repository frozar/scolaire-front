import { useStateAction } from "../StateAction";
import { addNewUserInformation } from "../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../type";
import DisplayAddTripMessageContent from "./DisplayAddTripMessageContent";
import DisplayRemoveTripMessageContent from "./DisplayRemoveTripMessageContent";
const [, { isInDrawTripMode }] = useStateAction();

export function displayAddTripMessage() {
  if (isInDrawTripMode()) {
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.info,
      type: MessageTypeEnum.enterAddTrip,
      content: DisplayAddTripMessageContent(),
    });
  }
}

export function displayNoTripMessage() {
  addNewUserInformation({
    displayed: true,
    level: MessageLevelEnum.error,
    type: MessageTypeEnum.global,
    content: "Aucune ligne de bus à exporter",
  });
}

export function displayRemoveTripMessage() {
  addNewUserInformation({
    displayed: true,
    level: MessageLevelEnum.info,
    type: MessageTypeEnum.enterRemoveTrip,
    content: DisplayRemoveTripMessageContent(),
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
