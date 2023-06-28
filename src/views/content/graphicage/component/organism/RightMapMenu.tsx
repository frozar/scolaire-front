import { children, JSXElement } from "solid-js";
import "./RightMapMenu.css";

export interface RightMapMenuProps {
  children: JSXElement;
  // storyMode: boolean;
}

export default function (props: RightMapMenuProps) {
  const buttons = children(() => props.children);

  // const positionAdjustment = () =>
  //   props.storyMode ? "relative left-[200px]" : "";

  // return (
  //   <div id="control-map-menu" class={positionAdjustment()}>
  //     {buttons()}
  //   </div>
  // );
  return <div id="control-map-menu">{buttons()}</div>;
}
