import { Show, mergeProps } from "solid-js";

import { useStateGui } from "../../../../StateGui";
import OpenPictogram from "../../../../icons/OpenPictogram";
import ClosePictogram from "../atom/ClosePictogram";

import LeftMenuItemList from "./LeftMenuItemList";

import EnterpriseLogo from "../../../../icons/EnterpriseLogo";
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

  let refDivLeftMenu!: HTMLElement;

  return (
    <div id="left-nav-container">
      <nav
        id="left-nav"
        classList={{ active: mergedProps.getDisplayedLeftMenu() }}
        ref={refDivLeftMenu}
      >
        <div id="left-nav-header">
          <EnterpriseLogo />
        </div>

        <LeftMenuItemList displayedLabel={mergedProps.getDisplayedLeftMenu()} />

        <button
          id="left-nav-btn-colapse"
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
    </div>
  );
}
