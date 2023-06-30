import { openExportConfirmationBox } from "../../../signaux";

import {
  confirmAbortEditionNeedToBeCall,
  defineModalToOpen,
} from "./ConfirmStopAddLineBox";

// const [
//   ,
//   {
//     // setModeAddLine,
//     // isInAddLineMode,
//     setModeRead,
//     isInRemoveLineMode,
//     setModeRemoveLine,
//   },
// ] = useStateAction();

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

// export const removeLineButtonHandleClick = () => {
//   deselectAllPoints();
//   if (isInRemoveLineMode()) {
//     setModeRead();
//     fetchBusLines();
//     return;
//   }
//   setModeRemoveLine();
//   fetchBusLines();
//   displayRemoveLineMessage();
// };

// export const clearButtonHandleClick = () => {
//   defineModalToOpen(openClearConfirmationBox);
//   confirmAbortEditionNeedToBeCall();
// };

// export const generateButtonHandleClick = () => {
//   defineModalToOpen(openGeneratorDialogBox);
//   confirmAbortEditionNeedToBeCall();
// };

export const exportButtonHandleClick = () => {
  defineModalToOpen(openExportConfirmationBox);
  confirmAbortEditionNeedToBeCall();
};
