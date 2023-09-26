import { For, createEffect, mergeProps } from "solid-js";

import { useStateGui } from "../../../../StateGui";
import { SelectedMenuType } from "../../../../type";

import {
  setSchoolPointsColor,
  setStopPointsColor,
  updateOnMapPointColor,
} from "../../../../leafletUtils";
import { onBoard } from "../../../content/board/component/template/ContextManager";
import { deselectAllBusLines } from "../../../content/map/component/organism/BusLines";
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
    if (["line", "line-draw", "line-details"].includes(onBoardMode)) {
      if (onBoardMode == "line") {
        deselectAllPointsAndBusLines();
      }
      setSelectedMenu("graphicage");
    } else if (
      ["schools", "school-details", "school-class"].includes(onBoardMode)
    ) {
      // deselectAllPointsAndBusLines(); // ! cas particulier ou etablissement selectionées à prendre en compte
      if (onBoardMode == "schools") {
        deselectAllPointsAndBusLines();
      } else if (onBoardMode == "school-details") {
        const selectedSchool = schoolDetailsItem();
        if (!selectedSchool) return;

        updateOnMapPointColor(selectedSchool);
      }
      // else if (onBoardMode == "school-details") {
      //   // ! Refactor (schoolPoint.tsx)
      //   const selectedSchool = schoolDetailsItem();
      //   if (!selectedSchool) {
      //     return;
      //   }
      //   // console.log("selectedSchool", selectedSchool);
      //   const ids: number[] = [selectedSchool.leafletId];

      //   for (const associated of selectedSchool.associated) {
      //     const school = getStops().filter(
      //       (item) => item.id == associated.id
      //     )[0];
      //     if (school != undefined) {
      //       ids.push(school.leafletId);
      //     }
      //   }
      //   // ! necessaire ?
      //   const circle = linkMap.get(selectedSchool.leafletId);
      //   circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });

      //   setSchoolPointsColor(ids, COLOR_SCHOOL_LIGHT);
      //   setStopPointsColor(ids, COLOR_STOP_LIGHT);

      //   // ! deselectAllPoints à mettre en place si code doublons suppr de SchoolPoint.tsx
      //   selectedSchool.setSelected(true);
      // }
      setSelectedMenu("schools");
    } else if (["stops", "stop-details"].includes(onBoardMode)) {
      // deselectAllPointsAndBusLines(); // ! cas stop-details ?!
      if (onBoardMode == "stops") {
        deselectAllPointsAndBusLines();
      } else {
        const selectedStop = stopDetailsItem();
        if (!selectedStop) return;
        updateOnMapPointColor(selectedStop);
      }
      // getSchools().map((point) => point.setSelected(false));
      // setSchoolPointsColor([], COLOR_SCHOOL_FOCUS);
      // deselectAllBusLines();
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
