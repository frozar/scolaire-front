import { For, mergeProps } from "solid-js";

import { useStateGui } from "../../../../StateGui";
import { SelectedMenuType } from "../../../../type";

import menuItems from "../../menuItemFields";
import LeftMenuItem from "../molecule/LeftMenuItem";

const [, { setSelectedMenu, getSelectedMenu }] = useStateGui();

export interface LeftMenuItemProps {
  getSelectedMenu?: () => SelectedMenuType;
  setSelectedMenu?: (itemMenu: SelectedMenuType) => void;
}

export default function (props: LeftMenuItemProps) {
  const mergedProps = mergeProps({ getSelectedMenu, setSelectedMenu }, props);
  return (
    <ul>
      <For each={menuItems}>
        {(menuItemArg) => {
          const { label, menuItem, Logo, isDisabled } = menuItemArg;

          const isSelected = () => mergedProps.getSelectedMenu() === menuItem;

          return (
            <LeftMenuItem
              isDisabled={isDisabled}
              Logo={Logo}
              label={label}
              isSelected={isSelected()}
              onClick={() => mergedProps.setSelectedMenu(menuItem)}
            />
          );
        }}
      </For>
    </ul>
  );
}
