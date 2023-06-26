import TopNav from "./topNav/TopNav";
import LeftNav from "./leftNav/LeftNav";
import { mergeProps } from "solid-js";

export interface LayoutProps {
  getDisplayedLeftMenu?: () => boolean;
  toggleDisplayedLeftMenu?: () => void;
  yOffset?: number;
}

export default function (props: LayoutProps) {
  const mergedProps = mergeProps({ yOffset: 0 }, props);

  const yOffsetClassName = () =>
    "translate-y-[" + String(mergedProps.yOffset) + "px]";

  return (
    <div>
      <TopNav />
      <div id="left-menu-container" class={yOffsetClassName()}>
        <LeftNav
          getDisplayedLeftMenu={props.getDisplayedLeftMenu}
          toggleDisplayedLeftMenu={props.toggleDisplayedLeftMenu}
        />
      </div>
    </div>
  );
}
