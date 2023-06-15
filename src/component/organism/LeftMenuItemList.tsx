import { For, mergeProps } from "solid-js";
import LeftMenuItem from "../molecule/LeftMenuItem";
import { useStateGui } from "../../StateGui";
import menuItems from "../molecule/menuItemFields";
import { SelectedMenuType } from "../../type";
const [
  ,
  {
    setSelectedMenu,
    getSelectedMenu,
    // toggleDisplayedLeftMenu,
    // getDisplayedLeftMenu,
  },
] = useStateGui();

export interface LeftMenuItemProps {
  displayedLabel: boolean;
  getSelectedMenu?: () => SelectedMenuType;
  setSelectedMenu?: (itemMenu: SelectedMenuType) => void;
}

export default function (props: LeftMenuItemProps) {
  const mergedProps = mergeProps({ getSelectedMenu, setSelectedMenu }, props);

  // const [waitingToDisplayText, SetWaitingToDisplayText] = createSignal(
  //   getDisplayedLeftMenu()
  // );

  // let refDivLeftMenu!: HTMLElement;

  // onMount(() => {
  //   if (!refDivLeftMenu) {
  //     return;
  //   }

  //   refDivLeftMenu.addEventListener("transitionend", () => {
  //     SetWaitingToDisplayText((bool) => !bool);
  //   });
  // });

  return (
    <ul class="lateral-nav-list">
      <For each={menuItems}>
        {(menuItemArg) => {
          const { label, menuItem, Logo, isDisabled } = menuItemArg;

          const isSelected = () => mergedProps.getSelectedMenu() === menuItem;

          return (
            <LeftMenuItem
              isDisabled={isDisabled}
              Logo={Logo}
              label={label}
              displayedLabel={props.displayedLabel}
              isSelected={isSelected()}
              onClick={() => mergedProps.setSelectedMenu(menuItem)}
            />
          );
        }}
      </For>
    </ul>
  );
}
