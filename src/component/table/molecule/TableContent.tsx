import { JSXElement, children } from "solid-js";

export function TableContent(props: { children: JSXElement }) {
  const child = children(() => props.children);
  return <tbody>{child()}</tbody>;
}
