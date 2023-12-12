import { For, createEffect, createSignal, mergeProps } from "solid-js";

import { useStateGui } from "../../../../StateGui";
import { SelectedMenuType } from "../../../../type";

import { getAuthenticatedUser } from "../../../../signaux";
import { getSelectedOrganisation } from "../../../content/board/component/organism/OrganisationSelector";
import { onBoard } from "../../../content/board/component/template/ContextManager";
import menuItems, { adminItems } from "../../menuItemFields";
import LeftMenuItem from "../molecule/LeftMenuItem";

const [, { getActiveMapId, setSelectedMenu, getSelectedMenu }] = useStateGui();

export interface LeftMenuItemProps {
  getSelectedMenu?: () => SelectedMenuType;
  setSelectedMenu?: (itemMenu: SelectedMenuType) => void;
  displayedLabel: boolean;
}

export default function (props: LeftMenuItemProps) {
  const mergedProps = mergeProps({ getSelectedMenu, setSelectedMenu }, props);

  createEffect(() => {
    const onBoardMode = onBoard();

    if (!onBoardMode) return;

    if (["line", "trip-draw", "line-details", "trip"].includes(onBoardMode)) {
      setSelectedMenu("graphicage");
    } else if (
      [
        "schools",
        "school-details",
        "school-grade-add",
        "school-grade-modify",
      ].includes(onBoardMode)
    ) {
      setSelectedMenu("schools");
    } else if (["stops", "stop-details"].includes(onBoardMode)) {
      setSelectedMenu("stops");
    }
  });

  const [previousAuthenticatedUser, setPreviousAuthenticatedUser] =
    createSignal(getAuthenticatedUser());

  createEffect(() => {
    if (
      previousAuthenticatedUser() == undefined &&
      previousAuthenticatedUser() != getAuthenticatedUser()
    ) {
      setSelectedMenu("dashboard");
    }

    if (previousAuthenticatedUser() != getAuthenticatedUser()) {
      setPreviousAuthenticatedUser(getAuthenticatedUser());
    }
  });

  return (
    <ul>
      <For each={getItems()}>
        {(menuItemArg) => {
          const { label, menuItem, Logo, isDisabled } = menuItemArg;

          const effectiveIsDisabled = () => {
            return (
              isDisabled ||
              (!isDisabled &&
                menuItem != "dashboard" &&
                menuItem != "parametres" &&
                getAuthenticatedUser() != undefined &&
                getActiveMapId() == null)
            );
          };

          function isSelected() {
            return menuItem == mergedProps.getSelectedMenu() ? true : false;
          }

          return (
            <LeftMenuItem
              displayedLabel={mergedProps.displayedLabel}
              isDisabled={effectiveIsDisabled()}
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
function getItems():
  | false
  | import("/home/flexible/wk/flaxib/scolaire/front/src/type").MenuItemType[]
  | null
  | undefined {
  console.log("getSelectedOrganisation()", getSelectedOrganisation());
  return getSelectedOrganisation().user_privilege === "member"
    ? menuItems
    : menuItems.concat(adminItems);
}
