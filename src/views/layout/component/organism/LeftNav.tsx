import { Show, createSignal, mergeProps, onCleanup, onMount } from "solid-js";

import { useStateGui } from "../../../../StateGui";
import ClosePictogram from "../atom/ClosePictogram";
import EnterpriseLogo from "../atom/EnterpriseLogo";
import OpenPictogram from "../atom/OpenPictogram";

import LeftMenuItemList from "./LeftMenuItemList";

import "./LeftNav.css";

const [, { getDisplayedLeftMenu, toggleDisplayedLeftMenu }] = useStateGui();

export interface LeftNavProps {
  getDisplayedLeftMenu?: () => boolean;
  toggleDisplayedLeftMenu?: () => void;
}

export default function (props: LeftNavProps) {
  const mergedProps = mergeProps(
    { getDisplayedLeftMenu, toggleDisplayedLeftMenu },
    props
  );

  const [displayedLabel, setDisplayedLabel] = createSignal(false);

  let refDivLeftMenu!: HTMLElement;

  function computeIsOpened(width: string) {
    const widthNumber = parseFloat(width.replace("px", ""));
    return 72 < widthNumber;
  }

  function handleTransitionStart() {
    const isOpened = computeIsOpened(getComputedStyle(refDivLeftMenu).width);
    if (isOpened) {
      setDisplayedLabel(false);
    }
  }

  function handleTransitionEnd() {
    const isOpened = computeIsOpened(getComputedStyle(refDivLeftMenu).width);
    if (isOpened) {
      setDisplayedLabel(true);
    }
  }

  onMount(() => {
    setDisplayedLabel(mergedProps.getDisplayedLeftMenu());

    if (!refDivLeftMenu) {
      return;
    }

    refDivLeftMenu.addEventListener("transitionstart", handleTransitionStart);
    refDivLeftMenu.addEventListener("transitionend", handleTransitionEnd);
  });

  onCleanup(() => {
    refDivLeftMenu.removeEventListener(
      "transitionstart",
      handleTransitionStart
    );
    refDivLeftMenu.removeEventListener("transitionend", handleTransitionEnd);
  });

  return (
    <nav
      id="left-nav"
      classList={{ active: mergedProps.getDisplayedLeftMenu() }}
      ref={refDivLeftMenu}
    >
      <div id="left-nav-header">
        <EnterpriseLogo displayedLeftMenu={displayedLabel()} />
      </div>

      <LeftMenuItemList displayedLabel={displayedLabel()} />

      <button
        id="left-close"
        onClick={() => mergedProps.toggleDisplayedLeftMenu()}
      >
        <Show
          when={mergedProps.getDisplayedLeftMenu()}
          fallback={<OpenPictogram />}
        >
          <ClosePictogram />
        </Show>
      </button>
    </nav>
  );
}
