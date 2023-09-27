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
// ! Refactor / Move
export function deselectAllPointsAndBusLines() {
  deselectAllPoints();
  deselectAllBusLines();
  setStopPointsColor([], COLOR_STOP_FOCUS);
  setSchoolPointsColor([], COLOR_SCHOOL_FOCUS);
}

export default function (props: LeftMenuItemProps) {
  const mergedProps = mergeProps({ getSelectedMenu, setSelectedMenu }, props);
  // ! Déplacer dans un contextManager like
  // ! Essayer d'enlever deselectAllPointsAndBusLines de la
  createEffect(() => {
    console.log("createEffect");
    console.log("onBoard()", onBoard());

    // console.log("schoolDetailsItem()", schoolDetailsItem());
    // console.log("stopDetailsItem()", stopDetailsItem());
    const onBoardMode = onBoard();
    if (!onBoardMode) {
      return;
    }
    if (["line", "line-draw", "line-details"].includes(onBoardMode)) {
      setSelectedMenu("graphicage");
    } else if (
      ["schools", "school-details", "school-class"].includes(onBoardMode)
    ) {
      setSelectedMenu("schools");
    } else if (["stops", "stop-details"].includes(onBoardMode)) {
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
