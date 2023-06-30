import { useStateAction } from "../../../StateAction";
import {
  openClearConfirmationBox,
  openExportConfirmationBox,
  openGeneratorDialogBox,
} from "../../../signaux";

import { displayRemoveLineMessage } from "../../../userInformation/utils";
import {
  confirmAbortEditionNeedToBeCall,
  defineModalToOpen,
} from "./ConfirmStopAddLineBox";
import { deselectAllPoints } from "./Point";

import { fetchBusLines } from "./line/busLinesUtils";

const [
  ,
  {
    // setModeAddLine,
    // isInAddLineMode,
    setModeRead,
    isInRemoveLineMode,
    setModeRemoveLine,
  },
] = useStateAction();

// export const addLineButtonHandleClick = () => {
//   if (isInAddLineMode()) {
//     setModeRead();
//     fetchBusLines();
//   } else {
//     deselectAllPoints();
//     setModeAddLine();
//     fetchBusLines();
//     displayAddLineMessage();
//   }
// };

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
  defineModalToOpen(openClearConfirmationBox);
  confirmAbortEditionNeedToBeCall();
};

export const generateButtonHandleClick = () => {
  defineModalToOpen(openGeneratorDialogBox);
  confirmAbortEditionNeedToBeCall();
};

export const exportButtonHandleClick = () => {
  defineModalToOpen(openExportConfirmationBox);
  confirmAbortEditionNeedToBeCall();
};
