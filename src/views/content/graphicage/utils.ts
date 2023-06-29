import { useStateAction } from "../../../StateAction";
import { openClearConfirmationBox } from "../../../signaux";

import {
  displayAddLineMessage,
  displayRemoveLineMessage,
} from "../../../userInformation/utils";
import {
  confirmAbortEditionNeedToBeCall,
  defineModalToOpen,
} from "./ConfirmStopAddLineBox";
import { deselectAllPoints } from "./Point";
import { fetchBusLines } from "./line/busLinesUtils";

const [
  ,
  {
    setModeAddLine,
    isInAddLineMode,
    setModeRead,
    isInRemoveLineMode,
    setModeRemoveLine,
  },
] = useStateAction();

export const addLineButtonHandleClick = () => {
  if (isInAddLineMode()) {
    setModeRead();
    fetchBusLines();
  } else {
    deselectAllPoints();
    setModeAddLine();
    fetchBusLines();
    displayAddLineMessage();
  }
};

export const removeLineButtonHandleClick = () => {
  deselectAllPoints();
  if (isInRemoveLineMode()) {
    setModeRead();
    fetchBusLines();
    return;
  }
  setModeRemoveLine();
  fetchBusLines();
  displayRemoveLineMessage();
};

export const clearButtonHandleClick = () => {
  console.log("no mock");

  defineModalToOpen(openClearConfirmationBox);
  confirmAbortEditionNeedToBeCall();
};
