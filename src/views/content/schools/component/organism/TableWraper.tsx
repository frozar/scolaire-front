import { JSXElement, children } from "solid-js";
import "./TableWraper.css";
// Table wraper is to have scroll on table if data go out of the screen/container

export default function (props: { children: JSXElement }) {
  const child = children(() => props.children);
  return <div class="board-content">{child()}</div>;
}
