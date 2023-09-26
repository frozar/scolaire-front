import { For, createEffect, mergeProps } from "solid-js";

import { useStateGui } from "../../../../StateGui";
import { SelectedMenuType } from "../../../../type";

import {
  setSchoolPointsColor,
  setStopPointsColor,
  updateOnMapPointColor,
  updateOnMapPointColorForBusLine,
} from "../../../../leafletUtils";
import { onBoard } from "../../../content/board/component/template/ContextManager";
import {
  deselectAllBusLines,
  getBusLines,
} from "../../../content/map/component/organism/BusLines";
import { deselectAllPoints } from "../../../content/map/component/organism/Points";
import {
  COLOR_SCHOOL_FOCUS,
  COLOR_STOP_FOCUS,
} from "../../../content/map/constant";
import { schoolDetailsItem } from "../../../content/schools/component/organism/SchoolDetails";
import { stopDetailsItem } from "../../../content/stops/component/organism/StopDetails";
import menuItems from "../../menuItemFields";
import LeftMenuItem from "../molecule/LeftMenuItem";

const [, { setSelectedMenu, getSelectedMenu }] = useStateGui();

export interface LeftMenuItemProps {
  getSelectedMenu?: () => SelectedMenuType;
  setSelectedMenu?: (itemMenu: SelectedMenuType) => void;
}
// ! Refactor
function deselectAllPointsAndBusLines() {
  deselectAllPoints();
  deselectAllBusLines();
  setStopPointsColor([], COLOR_STOP_FOCUS);
  setSchoolPointsColor([], COLOR_SCHOOL_FOCUS);
}

export default function (props: LeftMenuItemProps) {
  const mergedProps = mergeProps({ getSelectedMenu, setSelectedMenu }, props);
  // ! Déplacer dans un contextManager like
  createEffect(() => {
    const onBoardMode = onBoard();
    if (!onBoardMode) {
      return;
    }
    // ! utiliser switch case ?
    if (["line", "line-draw", "line-details"].includes(onBoardMode)) {
      if (onBoardMode == "line") {
        deselectAllPointsAndBusLines();
      } else if (onBoardMode == "line-details") {
        const selectedBusLine = getBusLines().filter((busLine) =>
          busLine.selected()
        )[0];
        updateOnMapPointColorForBusLine(selectedBusLine);
      }
      setSelectedMenu("graphicage");
    } else if (
      ["schools", "school-details", "school-class"].includes(onBoardMode)
    ) {
      if (onBoardMode == "schools") {
        deselectAllPointsAndBusLines();
      } else if (onBoardMode == "school-details") {
        const selectedSchool = schoolDetailsItem();
        if (!selectedSchool) return;

        updateOnMapPointColor(selectedSchool);
      }
      setSelectedMenu("schools");
    } else if (["stops", "stop-details"].includes(onBoardMode)) {
      if (onBoardMode == "stops") {
        deselectAllPointsAndBusLines();
      } else {
        const selectedStop = stopDetailsItem();
        if (!selectedStop) return;
        updateOnMapPointColor(selectedStop);
      }
      setSelectedMenu("stops");
    }
  });

  return (
    <ul>
      <For each={menuItems}>
        {(menuItemArg) => {
          const { label, menuItem, Logo, isDisabled } = menuItemArg;

          function isSelected() {
            return menuItem == mergedProps.getSelectedMenu() ? true : false;
          }

          return (
            <LeftMenuItem
              isDisabled={isDisabled}
              Logo={Logo}
              label={label}
              isSelected={isSelected()}
              onClick={menuItemArg.onClick}
            />
          );
        }}
      </For>
    </ul>
  );
}
