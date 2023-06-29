import { useStateAction } from "../../../StateAction";
import { displayAddLineMessage } from "../../../userInformation/utils";
import { deselectAllPoints } from "./Point";
import { fetchBusLines } from "./line/busLinesUtils";

const [, { setModeAddLine, isInAddLineMode, setModeRead }] = useStateAction();

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
