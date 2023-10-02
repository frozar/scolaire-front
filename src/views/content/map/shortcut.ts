import { useStateAction } from "../../../StateAction";
import { useStateGui } from "../../../StateGui";
import {
  setSchoolPointsColor,
  setStopPointsColor,
} from "../../../leafletUtils";
import { addBusCourse } from "../../../request";
import {
  displayedClearConfirmationDialogBox,
  getDisplayedGeneratorDialogBox,
  getExportConfirmationDialogBox,
  getRemoveConfirmation,
} from "../../../signaux";
import { displayAddCourseMessage } from "../../../userInformation/utils";
import { MapElementUtils } from "../../../utils/mapElement.utils";
import {
  currentStep,
  drawModeStep,
  setCurrentStep,
} from "../board/component/organism/DrawModeBoardContent";
import {
  changeBoard,
  onBoard,
  toggleDrawMod,
} from "../board/component/template/ContextManager";
import { displayedConfirmStopAddCourse } from "./ConfirmStopAddCourseBox";

import { deselectAllPoints } from "./component/organism/Points";
import { COLOR_SCHOOL_FOCUS, COLOR_STOP_FOCUS } from "./constant";

const [
  ,
  {
    setModeAddCourse,
    isInAddCourseMode,
    resetCourseUnderConstruction,
    getCourseUnderConstruction,
    setModeRead,
  },
  history,
] = useStateAction();

const isOpenedModal = () =>
  getExportConfirmationDialogBox().displayed ||
  getDisplayedGeneratorDialogBox() ||
  displayedClearConfirmationDialogBox().displayed ||
  getRemoveConfirmation().displayed ||
  displayedConfirmStopAddCourse();

const [, { getSelectedMenu }] = useStateGui();

const disable_shortcut = () =>
  getSelectedMenu() != "graphicage" || isOpenedModal();

// Handler the Undo/Redo from the user
function undoRedoHandler({ ctrlKey, shiftKey, code }: KeyboardEvent) {
  if (disable_shortcut()) {
    return;
  }

  if (ctrlKey) {
    // @ts-expect-error: Currently the 'keyboard' field doesn't exist on 'navigator'
    const keyboard = navigator.keyboard;
    // @ts-expect-error: The type 'KeyboardLayoutMap' is not available
    keyboard.getLayoutMap().then((keyboardLayoutMap) => {
      const upKey = keyboardLayoutMap.get(code);
      if (upKey === "z") {
        if (!shiftKey && history.isUndoable()) {
          history.undo();
        } else if (shiftKey && history.isRedoable()) {
          history.redo();
        }
      }
    });
  }
}

function escapeHandler({ code }: KeyboardEvent) {
  if (disable_shortcut()) {
    return;
  }

  if (code === "Escape") {
    if (onBoard() == "line-draw") {
      quitModeAddCourse();
      setCurrentStep(drawModeStep.start);
    }
    changeBoard("line");
    MapElementUtils.deselectAllPointsAndBusCourses();

    //TODO voir l'impact de la suppression
    // fetchBusCourses();
  }
}

export function quitModeAddCourse() {
  // setModeRead();
  resetCourseUnderConstruction();
  setStopPointsColor([], COLOR_STOP_FOCUS);
  setSchoolPointsColor([], COLOR_SCHOOL_FOCUS);
  toggleDrawMod();
}

function enterHandler({ code }: KeyboardEvent) {
  if (disable_shortcut()) {
    return;
  }

  if (code === "Enter") {
    if (
      !isInAddCourseMode() ||
      currentStep() === drawModeStep.schoolSelection
    ) {
      return;
    }
    const resourceInfo = getCourseUnderConstruction().course.points.map(
      function (value) {
        return {
          id_resource: value["id"],
          nature: value["nature"].toLowerCase(),
        };
      }
    );

    addBusCourse(resourceInfo).then(async (res) => {
      if (!res) {
        console.error("addBusCourse failed");
        return;
      }

      await res.json();

      resetCourseUnderConstruction();
      setModeRead();
      //TODO voir l'impact de la suppression
      // fetchBusCourses();
    });
  }
}

function toggleCourseUnderConstruction({ code }: KeyboardEvent) {
  if (disable_shortcut()) {
    return;
  }

  // @ts-expect-error: Currently the 'keyboard' field doesn't exist on 'navigator'
  const keyboard = navigator.keyboard;
  // @ts-expect-error: The type 'KeyboardLayoutMap' is not available
  keyboard.getLayoutMap().then((keyboardLayoutMap) => {
    const upKey = keyboardLayoutMap.get(code);
    if (upKey === "l") {
      if (isInAddCourseMode()) {
        setModeRead();
        //TODO voir l'impact de la suppression
        // fetchBusCourses();
      } else {
        deselectAllPoints();
        setModeAddCourse();
        //TODO voir l'impact de la suppression
        // fetchBusCourses();
        displayAddCourseMessage();
      }
    }
  });
}

export const listHandlerLMap = [
  undoRedoHandler,
  escapeHandler,
  enterHandler,
  toggleCourseUnderConstruction,
];
