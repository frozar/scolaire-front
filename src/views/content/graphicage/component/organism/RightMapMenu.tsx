import { children, JSXElement } from "solid-js";
import "./RightMapMenu.css";
export interface RightMapMenuProps {
  children: JSXElement;
}

export default function (props: RightMapMenuProps) {
  const buttons = children(() => props.children);

  return <div id="control-map-menu">{buttons()}</div>;
}
