import { For, createSignal, onMount } from "solid-js";
import LeftMenuItem from "../molecule/LeftMenuItem";
import { useStateGui } from "../../StateGui";
import MenuItemsFields from "../molecule/menuItemFields";
const [
  ,
  {
    setSelectedMenu,
    getSelectedMenu,
    // toggleDisplayedLeftMenu,
    getDisplayedLeftMenu,
  },
] = useStateGui();

export default function () {
  const [waitingToDisplayText, SetWaitingToDisplayText] = createSignal(
    getDisplayedLeftMenu()
  );

  let refDivLeftMenu!: HTMLElement;

  onMount(() => {
    refDivLeftMenu.addEventListener("transitionend", () => {
      SetWaitingToDisplayText(!waitingToDisplayText());
    });
  });

  return (
    <ul class="lateral-nav-list">
      <For each={MenuItemsFields(waitingToDisplayText())}>
        {(menuItemArg) => {
          const { title, menuItem, Logo } = menuItemArg;

          const isActiveItem = () => getSelectedMenu() === menuItem;
          const isActiveText = () =>
            getDisplayedLeftMenu() == true && waitingToDisplayText() == true;

          return (
            <LeftMenuItem
              title={title}
              menuItem={menuItem}
              logo={Logo}
              isActiveItem={isActiveItem()}
              isActiveText={isActiveText()}
              onClick={() => setSelectedMenu(menuItem)}
            />
          );
        }}
      </For>
    </ul>
  );
}
