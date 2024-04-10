import { For, createEffect, createSignal, mergeProps } from "solid-js";

import { useStateGui } from "../../../../StateGui";
import { SelectedMenuType } from "../../../../type";

import { getSelectedOrganisation } from "../../../content/board/component/organism/OrganisationSelector";
import { onBoard } from "../../../content/board/component/template/ContextManager";
import menuItems, { adminItems } from "../../menuItemFields";
import LeftMenuItem from "../molecule/LeftMenuItem";
import {
  AuthenticatedUserStore,
  authenticated,
} from "../../../../_stores/authenticated-user.store";

const [, { getActiveMapId, setSelectedMenu, getSelectedMenu }] = useStateGui();

export interface LeftMenuItemProps {
  getSelectedMenu?: () => SelectedMenuType;
  setSelectedMenu?: (itemMenu: SelectedMenuType) => void;
  displayedLabel: boolean;
}

export default function (props: LeftMenuItemProps) {
  const mergedProps = mergeProps({ getSelectedMenu, setSelectedMenu }, props);

  // TODO mettre cette logique dans le context manager
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
    } else if (["dashboard"].includes(onBoardMode)) {
      setSelectedMenu("dashboard");
    }
  });

  const [previousAuthenticatedUser, setPreviousAuthenticatedUser] =
    createSignal(AuthenticatedUserStore.get());

  createEffect(() => {
    if (
      previousAuthenticatedUser() == undefined &&
      previousAuthenticatedUser() != AuthenticatedUserStore.get()
    ) {
      setSelectedMenu("maps");
    }

    if (previousAuthenticatedUser() != AuthenticatedUserStore.get()) {
      setPreviousAuthenticatedUser(AuthenticatedUserStore.get());
    }
  });

  return (
    <ul>
      <For
        each={
          getSelectedOrganisation().user_privilege === "admin"
            ? menuItems.concat(adminItems)
            : menuItems
        }
      >
        {(menuItemArg) => {
          const { label, menuItem, Logo, isDisabled } = menuItemArg;

          const effectiveIsDisabled = () => {
            if (!authenticated()) {
              return true;
            }

            if (getActiveMapId() == null) {
              return true;
            }

            return isDisabled;
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
