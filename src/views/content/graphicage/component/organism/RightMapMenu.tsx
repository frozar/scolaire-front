import { children, JSXElement } from "solid-js";
import "./RightMapMenu.css";

export interface RightMapMenuProps {
  children: JSXElement;
  storyMode: boolean;
}

export default function (props: RightMapMenuProps) {
  const buttons = children(() => props.children);
  // let posAdjustments = "";

  const storyPositionAdjustment = () =>
    props.storyMode ? "relative left-[200px]" : "";
  // if (isInStoryMode()) {
  //   posAdjustments = "relative left-72";
  // }

  return (
    <div id="control-map-menu" class={storyPositionAdjustment()}>
      {buttons()}
    </div>
  );
}
