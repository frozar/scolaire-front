import { For, createEffect, mergeProps } from "solid-js";

import { useStateGui } from "../../../../StateGui";
import { SelectedMenuType } from "../../../../type";

import { onBoard } from "../../../content/board/component/template/ContextManager";
import menuItems from "../../menuItemFields";
import LeftMenuItem from "../molecule/LeftMenuItem";

const [, { setSelectedMenu, getSelectedMenu }] = useStateGui();

export interface LeftMenuItemProps {
  getSelectedMenu?: () => SelectedMenuType;
  setSelectedMenu?: (itemMenu: SelectedMenuType) => void;
}

export default function (props: LeftMenuItemProps) {
  const mergedProps = mergeProps({ getSelectedMenu, setSelectedMenu }, props);
  createEffect(() => {
    console.log("mergedProps.getSelectedMenu()", mergedProps.getSelectedMenu());
  });
  createEffect(() => {
    console.log("onBoard", onBoard());
  });
  createEffect(() => {
    console.log("menuItems", menuItems);
  });
  return (
    <ul>
      <For each={menuItems}>
        {(menuItemArg) => {
          const { label, menuItem, Logo, isDisabled } = menuItemArg;

          // const pageSelected = () =>
          //   mergedProps.getSelectedMenu() === menuItem && isOnPage();

          // const deepSchoolSelected = () =>
          //   (onBoard() == "school-details" || onBoard() == "school-class") &&
          //   menuItem == "schools";

          // const deepStopSelected = () =>
          //   onBoard() == "stop-details" && menuItem == "stops";

          // const isSelected = () =>
          //   pageSelected() ||
          //   (onBoard() == menuItem && !isOnPage()) ||
          //   deepSchoolSelected() ||
          //   deepStopSelected();
          // ! Pas oublier cas particulier dashboard
          // ! Factoriser toutes les conditions ??
          // ! getSelectedMenu cassé !? => fix et delete tout les "mergedProps.getSelectedMenu() == "graphicage""
          // ! onClick sur graphicage quand 'school-details' cassé
          function isSelected() {
            if (menuItem == "graphicage") {
              return ["line", "line-details", "line-draw"].includes(
                onBoard()
              ) && mergedProps.getSelectedMenu() == "graphicage"
                ? true
                : false;
            } else if (menuItem == "schools") {
              return ["schools", "school-details", "school-class"].includes(
                onBoard()
              ) && mergedProps.getSelectedMenu() == "graphicage"
                ? true
                : false;
            } else if (menuItem == "stops") {
              return ["stops", "stop-details"].includes(onBoard()) &&
                mergedProps.getSelectedMenu() == "graphicage"
                ? true
                : false;
            } else if (menuItem == "dashboard") {
              return mergedProps.getSelectedMenu() == "dashboard"
                ? true
                : false;
            } else {
              // !
              return false;
            }
          }
          // function isSelected() {
          //   if ()
          // }

          // console.log("isSelected", isSelected());

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
