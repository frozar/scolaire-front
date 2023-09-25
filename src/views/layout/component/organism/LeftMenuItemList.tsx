import { For, createEffect, mergeProps } from "solid-js";

import { useStateGui } from "../../../../StateGui";
import { SelectedMenuType } from "../../../../type";

import {
  setSchoolPointsColor,
  setStopPointsColor,
} from "../../../../leafletUtils";
import { onBoard } from "../../../content/board/component/template/ContextManager";
import { deselectAllBusLines } from "../../../content/map/component/organism/BusLines";
import { deselectAllPoints } from "../../../content/map/component/organism/Points";
import {
  COLOR_SCHOOL_FOCUS,
  COLOR_STOP_FOCUS,
} from "../../../content/map/constant";
import menuItems from "../../menuItemFields";
import LeftMenuItem from "../molecule/LeftMenuItem";

const [, { setSelectedMenu, getSelectedMenu }] = useStateGui();

export interface LeftMenuItemProps {
  getSelectedMenu?: () => SelectedMenuType;
  setSelectedMenu?: (itemMenu: SelectedMenuType) => void;
}

function deselectAllPointsAndBusLines() {
  deselectAllPoints();
  deselectAllBusLines();
  setStopPointsColor([], COLOR_STOP_FOCUS);
  setSchoolPointsColor([], COLOR_SCHOOL_FOCUS);
}

export default function (props: LeftMenuItemProps) {
  const mergedProps = mergeProps({ getSelectedMenu, setSelectedMenu }, props);
  createEffect(() => {
    const onBoardMode = onBoard();
    if (!onBoardMode) {
      return;
    }
    if (["line", "line-draw", "line-details"].includes(onBoardMode)) {
      if (onBoardMode == "line") {
        deselectAllPointsAndBusLines();
      }
      setSelectedMenu("graphicage");
    } else if (
      ["schools", "school-details", "school-class"].includes(onBoardMode)
    ) {
      deselectAllPointsAndBusLines(); // ! cas particulier ou etablissement selectionées à prendre en compte
      setSelectedMenu("schools");
    } else if (["stops", "stop-details"].includes(onBoardMode)) {
      deselectAllPointsAndBusLines(); // ! cas particulier à prendre en compte
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
