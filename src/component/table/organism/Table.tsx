import { JSXElement, children } from "solid-js";

import "./Table.css";

export function Table(props: { children: JSXElement }) {
  const child = children(() => props.children);
  return <table class="custom-table">{child()}</table>;
}
