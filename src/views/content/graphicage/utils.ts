import { useStateAction } from "../../../StateAction";
import {
  displayAddLineMessage,
  displayRemoveLineMessage,
} from "../../../userInformation/utils";
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
